import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class ProfileView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountName: '',
            userName1: '',
            userName2: '',
            gana1: '',
            gana2: '',
            email:'',
            phone:'',
            credit:'',
            avatarimg: '',
            userstatus: 1,
            paydate:'',
            expirydate:'',
            create:'',
        }
    }
    componentDidMount() {
        document.title = "プロフィール | Eiyoo"
        this.getProfile()
    }
    getProfile(){
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
        axios(config)
            .then(async (response)=>{
                var userData= response.data.user
                var date = new Date(userData.create)
                var paydate1, paydate, expirydate1, expirydate
                if (userData.userstatus>1) {
                    paydate1 = new Date(userData.paydate)
                    expirydate1 = new Date(userData.expirydate)
                    paydate = paydate1.getFullYear().toString() + '年' + (paydate1.getMonth()+1).toString() + '月' + paydate1.getDate().toString() + '日'
                    expirydate = expirydate1.getFullYear().toString() == '10000' ? '無期限':expirydate1.getFullYear().toString() + '年' + (expirydate1.getMonth()+1).toString() + '月' + expirydate1.getDate().toString() + '日'
                }
                else {
                    paydate = '';
                    expirydate = '';
                }
                this.setState({
                    accountName:userData.accountName,
                    userName1:userData.userName1==null?'':userData.userName1,
                    userName2:userData.userName2==null?'':userData.userName2,
                    gana1:userData.gana1==null?'':userData.gana1,
                    gana2:userData.gana2==null?'':userData.gana2,
                    email:userData.email==null?'':userData.email,
                    phone:userData.phone==null?'':userData.phone,
                    credit:userData.credit==null?'':userData.credit,
                    avatarimg:userData.avatar?`${baseurl}/media/${userData.avatar}`:"",
                    userstatus: userData.userstatus,
                    paydate:paydate,
                    expirydate:expirydate,
                    create:(date.getFullYear().toString() + '年' + (date.getMonth()+1).toString() + '月' + date.getDate().toString() + '日')
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
    updateAvatar = e =>{
        let fileObj = e.target.files[0];
        let avatar = URL.createObjectURL(fileObj);
        const fd = new FormData();
        fd.append('avatar', fileObj);
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        var token = userData.token
        axios.post(`${baseurl}/api/updateAvatar`, fd, {
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
        const {accountName, userName1, userName2, gana1, gana2, email, phone, credit, avatarimg, userstatus, create, paydate, expirydate} = this.state
        return(
            <div className="profile">
                <div className="profile-img">
                    <img src={avatarimg=="" ? "/assets/img/avatar.jpg" : avatarimg} alt="avatar" />
                </div>
                <div className="profile-content">
                    <table>
                        <tbody>
                            <tr>
                                <td>アカウント名</td>
                                <td>{accountName}</td>
                            </tr>
                            <tr>
                                <td>名前</td>
                                <td>
                                    <div className="profile-name">
                                        <p>{userName1}</p>
                                        <p>{userName2}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>ふりがな</td>
                                <td>
                                    <div className="profile-name">
                                        <p>{gana1}</p>
                                        <p>{gana2}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>メール</td>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <td>電話番号</td>
                                <td>{phone}</td>
                            </tr>
                            <tr>
                                <td>クレジットカード</td>
                                <td>{credit}</td>
                            </tr>
                            <tr>
                                <td>登録日</td>
                                <td>{create}</td>
                            </tr>
                            <tr>
                                <td>会員形態</td>
                                <td>{userstatus==1?'無料会員':'有料会員'}</td>
                            </tr>
                            <tr style={{display:`${userstatus==1?"none":"table-row"}`}}>
                                <td>支払日</td>
                                <td>{paydate}</td>
                            </tr>
                            <tr style={{display:`${userstatus==1?"none":"table-row"}`}}>
                                <td>終了日</td>
                                <td>{expirydate}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="profile-link">
                    <Link to="profile_update">プロフィール更新</Link>
                </div>
            </div>
        )
    }
}

export default ProfileView