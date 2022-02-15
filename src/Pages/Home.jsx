import axios from "axios";
import React, { Component, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";

const baseurl = import.meta.env.EY_BASE_URL;

function HomeView() {
    const navigation = useNavigate();
    const [newMessage, setNewMessage] = useState(0)
    useEffect(()=>{
        document.title="ホーム | Eiyoo";
        
        getUnreads()
        const interval = setInterval(() => getUnreads(), 2000)
        return () => clearInterval(interval)
    })
    const getUnreads = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_user_unreads`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        };
        if (loginuserData.userstatus == 3) {
            axios(config)
                .then((response)=>{
                    setNewMessage(response.data.countUnreadMessages)
                })
                .catch((error)=>{
                    if (error.response.data.userstatus) {
                        var refresh = loginuserData.refresh
                        var email = loginuserData.email
                        localStorage.setItem('userData', JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'email': email, 'userstatus': error.response.data.userstatus}))
                        window.location.reload()
                    }
                })
        }
    }
    return <Home navigation={navigation} newMessage={newMessage} />
}

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advisorList1:[],
            advisorList2:[],
            advisorList3:[],
            advisorList4:[],
            more: false,
            avatar:'',
            name1:'',
            name2:'',
            expirydate:1,
            last_login:'',
            meal:[],
            word:'',
        }
    }
    componentDidMount() {
        document.title = "Home | Eiyoo"
        this.getAdvisor()
    }
    async getAdvisor() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_advisor_list`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : {}
        };
        await axios(config)
            .then((response)=>{
                if (response.data.advisor.advisor1) {
                    this.setState({
                        advisorList1: response.data.advisor.advisor1,
                        advisorList2: response.data.advisor.advisor2,
                        advisorList3: response.data.advisor.advisor3,
                        advisorList4: response.data.advisor.advisor4
                    })
                }
                else {
                    if (response.data.advisor.last_login!=null) {
                        var last_login1 = new Date(response.data.advisor.last_login)
                        var last_login = ''
                        var now = new Date()
                        var now_date = now.getDate()
                        if ((now_date - last_login1.getDate()) == 0) {
                            last_login = '今日'
                        }
                        else if ((now_date - last_login1.getDate()) == 1) {
                            last_login = '昨日'
                        }
                        else {
                            last_login = (last_login1.getMonth()+1).toString() + '月' + last_login1.getDate().toString() + '日'
                        }
                    } else {
                        last_login=''
                    }
                    var expirydate = 0, expirydate1
                    if (response.data.expirydate != null) {
                        expirydate1 = response.data.expirydate
                        expirydate = (new Date(expirydate1).getFullYear().toString()) == '10000' ? 0:1
                    }
                    this.setState({
                        avatar:response.data.advisor.avatar==null?'':response.data.advisor.avatar,
                        name1:response.data.advisor.name1==null?'':response.data.advisor.name1,
                        name2:response.data.advisor.name2==null?'':response.data.advisor.name2,
                        last_login:last_login,
                        expirydate:expirydate,
                        meal:response.data.meal,
                        word:response.data.word==null?'':response.data.word,
                    })
                    var i;
                    var word = ''
                    for (i=0;i<this.state.word.split('\n').length;i++) {
                        if (i < this.state.word.split('\n').length - 1) {
                            word+=this.state.word.split('\n')[i] + '<br />'
                        }
                        else {
                            word+=this.state.word.split('\n')[i]
                        }
                    }
                    this.setState({word: word})
                }
            })
            .catch((error)=>{

            })
    }
    moreClick = e => {
        this.setState({
            more: !this.state.more
        })
    }
    changeAdvisor = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/user_change_advisor`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
        };
        axios(config)
            .then((response)=>{
            })
            .catch((error)=>{

            })
    }
    cancelSubscription = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/cancel_subscription`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
        };
        axios(config)
            .then((response)=>{
            })
            .catch((error)=>{

            })
    }
    render() {
        const userstatus = JSON.parse(localStorage.getItem('userData')).userstatus
        const {advisorList1,
            advisorList2,
            advisorList3,
            advisorList4,
            more,
            avatar,
            name1,
            name2,
            last_login,
            expirydate,
            meal,
            word
        } = this.state
        return(
            <>  
                {userstatus==3?
                    <div className="home">
                        <div className="home-main">
                            <div className="home-main-advisor">
                                <img src={avatar!=''? `${baseurl}/media/${avatar}`:'/assets/img/avatar.jpg'} alt="advisor" />
                                <h4>{name1} {name2}さん</h4>
                                <p>最終ログイン:{last_login}</p>
                            </div>
                            <div className="home-main-link">
                                <Link to="/dashboard/message">
                                    <span>メッセージ</span>
                                    {
                                        this.props.newMessage>0?
                                        <div>{this.props.newMessage}</div>
                                        :
                                        <></>
                                    }
                                </Link>
                                <Link to="/dashboard/record">
                                    <span>食事を記録する</span>
                                </Link>
                                <Link to="/dashboard/data">
                                    <span>データを見る</span>
                                </Link>
                                <a onClick={this.changeAdvisor}>
                                    <span>アドバイザーを変える</span>
                                </a>
                                {
                                    expirydate == 0?
                                    <></>
                                    :
                                    <a onClick={this.cancelSubscription}>
                                        <span>有料会員をやめる</span>
                                    </a>
                                }
                            </div>
                        </div>
                        <div className="home-meal">
                            <h3>最近記録した食事</h3>
                            <div className="home-meal-container">
                                {
                                    meal.length==0?
                                    <p>最近記録した食事はありません。</p>
                                    :
                                    meal.map((meal)=>(
                                        <div
                                            key = {meal.pk}
                                            className="home-meal-card"
                                        >
                                            <div className="home-meal-card-img">
                                                {
                                                    meal.photo?
                                                    <img src={`${baseurl}/media/${meal.photo}`} />
                                                    :
                                                    <></>
                                                }
                                            </div>
                                            <p>{moment(meal.date).format('YYYY年MM月DD日')}</p>
                                            <p>
                                                {
                                                    meal.meals==1?
                                                    '朝ご飯'
                                                    :
                                                    meal.meals==2?
                                                    '昼ご飯'
                                                    :
                                                    '夜ご飯'
                                                }
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                            <Link to="/dashboard/data">もっと見る</Link>
                        </div>
                        {
                            word==''?
                            <></>
                            :
                            <div className="home-meal">
                                <h3>アドバイザーから一言</h3>
                                <p dangerouslySetInnerHTML={{__html: word}}></p>
                            </div>
                        }
                    </div>
                    :
                    
                    <div className="home">
                        <h2>栄養アドバイザーを選びましょう！</h2>
                        <div className="home-advisor">
                            <h3>楽しく食事管理をしたい</h3>
                            <div className={`home-advisor-link ${more? 'more':''}`}>
                                {advisorList1.map((advisor)=>(
                                    <a
                                        key={advisor.pk}
                                        to=''
                                        onClick={
                                            ()=>this.props.navigation(
                                                'select_advisor',
                                                {
                                                    state: {
                                                        advisor_field: 1,
                                                        pk: advisor.pk
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        <img src={advisor.avatar? `${baseurl}/media/${advisor.avatar}`:'/assets/img/avatar.jpg'} alt="" />
                                        <p>{advisor.name1==null?'':advisor.name1} {advisor.name2==null?'':advisor.name2}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="home-advisor">
                            <h3>ストイックなダイエットをしたい</h3>
                            <div className={`home-advisor-link ${more? 'more':''}`}>
                                {advisorList2.map((advisor)=>(
                                    <a
                                        key={advisor.pk}
                                        to=''
                                        onClick={
                                            ()=>this.props.navigation(
                                                'select_advisor',
                                                {
                                                    state: {
                                                        advisor_field: 2,
                                                        pk: advisor.pk
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        <img src={advisor.avatar? `${baseurl}/media/${advisor.avatar}`:'/assets/img/avatar.jpg'} alt="" />
                                        <p>{advisor.name1==null?'':advisor.name1} {advisor.name2==null?'':advisor.name2}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="home-advisor">
                            <h3>細かいカロリー制限をしたい</h3>
                            <div className={`home-advisor-link ${more? 'more':''}`}>
                                {advisorList3.map((advisor)=>(
                                    <a
                                        key={advisor.pk}
                                        to=''
                                        onClick={
                                            ()=>this.props.navigation(
                                                'select_advisor',
                                                {
                                                    state: {
                                                        advisor_field: 3,
                                                        pk: advisor.pk
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        <img src={advisor.avatar? `${baseurl}/media/${advisor.avatar}`:'/assets/img/avatar.jpg'} alt="" />
                                        <p>{advisor.name1==null?'':advisor.name1} {advisor.name2==null?'':advisor.name2}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="home-advisor">
                            <h3>とにかく初心者</h3>
                            <div className={`home-advisor-link ${more? 'more':''}`}>
                                {advisorList4.map((advisor)=>(
                                    <a
                                        key={advisor.pk}
                                        to=''
                                        onClick={
                                            ()=>this.props.navigation(
                                                'select_advisor',
                                                {
                                                    state: {
                                                        advisor_field: 4,
                                                        pk: advisor.pk
                                                    }
                                                }
                                            )
                                        }
                                    >
                                        <img src={advisor.avatar? `${baseurl}/media/${advisor.avatar}`:'/assets/img/avatar.jpg'} alt="" />
                                        <p>{advisor.name1==null?'':advisor.name1} {advisor.name2==null?'':advisor.name2}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="top-login-or">
                            <div></div>
                            <h4>OR</h4>
                            <div></div>
                        </div>
                        <div className="profile-link">
                            <a onClick={this.moreClick}>もっと見る</a>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default HomeView