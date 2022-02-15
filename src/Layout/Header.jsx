import React, {Component, useEffect, useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const baseurl = import.meta.env.EY_BASE_URL;

function Header() {
    const Location = useLocation()
    const [tabName, setTabName] = useState();
    const [newMessage, setNewMessage] = useState(0)
    useEffect(()=>{
        setTabName((location.pathname).split('/')[2])
        getUnreads()
        const interval = setInterval(() => getUnreads(), 2000)
        return () => clearInterval(interval)
    })
    async function getUnreads() {
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
            await axios(config)
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
    return(
        <HeaderComp Location={Location} tabName={tabName} newMessage={newMessage} />
    )
}

class HeaderComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuShow: false,
            userName1:'',
            userName2:'',
            avatarimg:'',
        }
    }
    menuShow = e => {
        e.stopPropagation()
        this.setState({menuShow: !this.state.menuShow})
    }
    menuClose = e => {
        this.setState({menuShow: false})
    }
    menuClick = e => {
        e.stopPropagation()
    }
    menuLink = e => {
        this.setState({
            menuShow: false
        })
    }
    
    componentDidMount() {
        this.getProfile();
    }
    
    async getProfile(){
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'get',
            url: `${baseurl}/api/getProfile`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : {}
        };
        await axios(config)
            .then(async (response)=>{
                var userData= response.data.user 
                this.setState({
                    userName1:userData.userName1==null?'':userData.userName1,
                    userName2:userData.userName2==null?'':userData.userName2,
                    avatarimg:userData.avatar?`${baseurl}/media/${userData.avatar}`:"",
                })

            })
            .catch((error)=>{
                if (error.response) {
                    if(error.response.status===401){
                        localStorage.removeItem("userData");
                        window.location.assign('/');
                    }
                }
            });
    }
    logout = e => {
        localStorage.removeItem('userData');
        window.location.assign('/')
    }
    async updateAvatar(e) {
        let fileObj = e.target.files[0];
        let avatar = URL.createObjectURL(fileObj);
        const fd = new FormData();
        fd.append('avatar', fileObj);
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        var token = userData.token
        await axios.post(`${baseurl}/api/updateAvatar`, fd, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((response)=>{
            window.location.reload()
        }).catch((error)=> {
        })
        this.setState({
            avatarimg:avatar,
        })
    }
    render() {
        const {menuShow, userName1, userName2, avatarimg} = this.state
        return(
            <>
                <header>
                    <div className="header">
                        <div className={`menu-btn ${menuShow? "menu-show":""}`} onClick={this.menuShow}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <Link className="logo" to="/dashboard/home"><img src="/assets/img/logo1.png" alt="logo" /></Link>
                        <a className="header-profile">
                            <img onClick={(e) => this.upload.click() } src={avatarimg=="" ? "/assets/img/avatar.jpg" : avatarimg} alt="avatar" />
                            <input type="file" onChange={this.updateAvatar} ref={(ref) => this.upload = ref} style={{ display: 'none' }} multiple accept="image/png, image/gif, image/jpeg"/>
                        </a>
                    </div>
                </header>
                <menu className={menuShow? "menu-show":""} onClick={this.menuClose}>
                    <div className="menu" onClick={this.menuClick}>
                        <div className="menu-profile">
                            <img src={avatarimg=="" ? "/assets/img/avatar.jpg" : avatarimg} alt="avatar" />
                            <h4>{userName1} {userName2}</h4>
                        </div>
                        <div className="menu-link">
                            <Link onClick={this.menuLink} className={this.props.tabName=='home'?"current":""} to="/dashboard/home">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21.348" height="17.96" viewBox="0 0 21.348 17.96" transform="scale(1.1)"><path d="M2248.465,8.45l8.035-7.077,8.02,7.077H2263V17h-4V11h-5v6h-4V8.45Z" transform="translate(-2245.816 -0.04)" fill="none" stroke="#707070" strokeWidth="2"/></svg>
                                <span>ホーム</span>
                            </Link>
                            <Link onClick={this.menuLink} className={this.props.tabName=='profile'?"current":""} to="/dashboard/profile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><g fill="none"><path d="M 10.5 2 C 5.813079833984375 2 2 5.813079833984375 2 10.5 C 2 15.18692016601563 5.813079833984375 19 10.5 19 C 15.18692016601563 19 19 15.18692016601563 19 10.5 C 19 5.813079833984375 15.18692016601563 2 10.5 2 M 10.5 0 C 16.29899024963379 0 21 4.701009750366211 21 10.5 C 21 16.29899024963379 16.29899024963379 21 10.5 21 C 4.701009750366211 21 0 16.29899024963379 0 10.5 C 0 4.701009750366211 4.701009750366211 0 10.5 0 Z" stroke="none" fill="#707070"/></g><g transform="translate(6.5 4)" fill="none"><path d="M 4 2 C 2.897200107574463 2 2 2.897200107574463 2 4 C 2 5.102799892425537 2.897200107574463 6 4 6 C 5.102799892425537 6 6 5.102799892425537 6 4 C 6 2.897200107574463 5.102799892425537 2 4 2 M 4 0 C 6.209139823913574 0 8 1.790860176086426 8 4 C 8 6.209139823913574 6.209139823913574 8 4 8 C 1.790860176086426 8 0 6.209139823913574 0 4 C 0 1.790860176086426 1.790860176086426 0 4 0 Z" stroke="none" fill="#707070"/></g><path d="M0,0S3.75-3,7.5-3,15,0,15,0" transform="translate(3 16)" fill="none" stroke="#707070" strokeWidth="2"/></svg>
                                <span>プロフィール設定</span>
                            </Link>
                            <Link onClick={this.menuLink} className={this.props.tabName=='record'?"current":""} to="/dashboard/record">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21.344" height="21" viewBox="0 0 21.344 21"><path d="M2247,1V20h9l6-6V1Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeWidth="2"/><path d="M2263.776,4.588,2253.69,14.674l-1.7,3.883,3.838-1.777,10.086-10.13Z" transform="translate(-2246 -2)" fill="none" stroke="#707070" strokeWidth="2"/><path d="M0,0,2,2" transform="translate(7.5 13.5)" fill="none" stroke="#707070" strokeWidth="2"/></svg>
                                <span>食事を記録する</span>
                            </Link>
                            <Link onClick={this.menuLink} className={this.props.tabName=='data'?"current":""} to="/dashboard/data">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="M2247,1V20h13l6-6V1Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinejoin="round" strokeWidth="2"/><line x2="11" transform="translate(5 5)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line x2="11" transform="translate(5 9)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line x2="5" transform="translate(5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><path d="M2260,20V14h6Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinejoin="round" strokeWidth="2"/></svg>
                                <span>データを見る</span>
                            </Link>
                            <Link onClick={this.menuLink} className={this.props.tabName=='message'?"current":""} to="/dashboard/message">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19"><path d="M2247,1V13h4l-2,5,7.5-5h9.5V1Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinejoin="round" strokeWidth="2"/><line x2="11" transform="translate(5 5)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line x2="11" transform="translate(5 9)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/></svg>
                                <span>メッセージ一覧</span>
                                {
                                    this.props.newMessage>0?
                                    <div>{this.props.newMessage}</div>
                                    :
                                    <></>
                                }
                            </Link>
                            <Link onClick={this.menuLink} className={this.props.tabName=='inquiry'?"current":""} to="/dashboard/inquiry">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="M2247,1V15h4l-2,5,7.5-5h9.5V1Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinejoin="round" strokeWidth="2"/><path d="M0,.2A2.062,2.062,0,0,1,2.056-1.173,1.689,1.689,0,0,1,3.875.2" transform="translate(8 5.673)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><path d="M0,.412V0" transform="translate(10 8.545)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><path d="M1.986,0a5.452,5.452,0,0,1-.178.929,1.462,1.462,0,0,1-.292.54,2.41,2.41,0,0,1-1.25.953" transform="translate(9.884 5.999)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line transform="translate(10 11.299)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/></svg>
                                <span>お問い合わせ</span>
                            </Link>
                            <a onClick={this.logout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21.414" height="21" viewBox="0 0 21.414 21"><path d="M2247,1h13V16h-13Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M2255,5V20l-8-4V1Z" transform="translate(-2246)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><line x2="8" transform="translate(12 8.5)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line x2="3" y2="3" transform="translate(17 5.5)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/><line y1="3" x2="3" transform="translate(17 8.5)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/></svg>
                                <span>Log out</span>
                            </a>
                        </div>
                    </div>
                    
                </menu>
            </>
        )
    }
}

export default Header