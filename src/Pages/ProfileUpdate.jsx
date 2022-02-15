import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class ProfileUpdateView extends Component {
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
            error:'',
            alertModal: false,
        }
    }
    componentDidMount() {
        document.title = "プロフィール更新 | Eiyoo"
        this.getProfile()
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
                var date = new Date(userData.create)
                var paydate1, paydate, expirydate1, expirydate
                if (userData.userstatus>1) {
                    paydate1 = new Date(userData.paydate)
                    expirydate1 = new Date(userData.expirydate)
                    paydate = paydate1.getFullYear().toString() + '年' + (paydate1.getMonth()+1).toString() + '月' + paydate1.getDate().toString() + '日'
                    expirydate = expirydate1.getFullYear().toString() + '年' + (expirydate1.getMonth()+1).toString() + '月' + expirydate1.getDate().toString() + '日'
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
    inputChange = fieldName => e => {
        if(fieldName==="phone"){
            this.setState({
                [fieldName]: (e.target.value).replace(/[^0-9]/ig, '')
            })
            return;
        }
        if(fieldName==="credit"){
            this.setState({
                [fieldName]: (e.target.value).replace(/[^0-9]/ig, '')
            })
            return;
        }
        if(fieldName==="accountName"){
            this.setState({
                [fieldName]: (e.target.value).replace(/[^A-Za-z0-9]/ig, '')
            })
            return;
        }
        this.setState({
            [fieldName]: e.target.value
        })
    }
    updateProfile = e=>{
        const {accountName, userName1, userName2, gana1, gana2, phone, credit} = this.state
        if (accountName=='') {
            this.setState({
                error:'アカウント名をご入力ください。',
                alertModal: true
            })
            return
        }
        if (userName1=='') {
            this.setState({
                error:'姓をご入力ください。',
                alertModal: true
            })
            return
        }
        if (userName2=='') {
            this.setState({
                error:'名をご入力ください。',
                alertModal: true
            })
            return
        }
        if (gana1=='') {
            this.setState({
                error:'せいをご入力ください。',
                alertModal: true
            })
            return
        }
        if (gana2=='') {
            this.setState({
                error:'めいをご入力ください。',
                alertModal: true
            })
            return
        }
        var data = JSON.stringify({'accountName': accountName, 'userName1': userName1, 'userName2': userName2, 'gana1': gana1, 'gana2': gana2, 'phone': phone, 'credit': credit })
        var userData =  JSON.parse(localStorage.getItem("userData")) || null;
        var token = userData.token
        var config = {
            method: 'post',
            url: `${baseurl}/api/updateProfile`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : data
        };
        axios(config)
            .then((response)=>{
                var userData= response.data.user
                this.setState({
                    accountName:userData.accountName,
                    userName1:userData.userName1==null?'':userData.userName1,
                    userName2:userData.userName2==null?'':userData.userName2,
                    gana1:userData.gana1==null?'':userData.gana1,
                    gana2:userData.gana2==null?'':userData.gana2,
                    phone:userData.phone==null?'':userData.phone,
                    credit:userData.credit==null?'':userData.credit,
                })
                window.location.reload()
            })
            .catch((error) =>{
                this.setState({
                    error: 'アカウント名は既存します。',
                    alertModal: true,
                })
            })
    }
    modalClose = e => {
        this.setState({alertModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    render() {
        const {accountName, userName1, userName2, gana1, gana2, phone, credit, avatarimg, error, alertModal} = this.state
        return(
            <>
                <div className="profile">
                    <div className="profile-img profile-img1" onClick={(e) => this.upload.click() }>
                        <div className="profile-img-cover">
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 490.337 490.337"><path d="M229.9,145.379l-47.5,47.5c-17.5,17.5-35.1,35-52.5,52.7c-4.1,4.2-7.2,9.8-8.4,15.3c-6.3,28.9-12.4,57.8-18.5,86.7 l-3.4,16c-1.6,7.8,0.5,15.6,5.8,20.9c4.1,4.1,9.8,6.4,15.8,6.4c1.7,0,3.4-0.2,5.1-0.5l17.6-3.7c28-5.9,56.1-11.9,84.1-17.7 c6.5-1.4,12-4.3,16.7-9c78.6-78.7,157.2-157.3,235.8-235.8c5.8-5.8,9-12.7,9.8-21.2c0.1-1.4,0-2.8-0.3-4.1c-0.5-2-0.9-4.1-1.4-6.1 c-1.1-5.1-2.3-10.9-4.7-16.5l0,0c-14.7-33.6-39.1-57.6-72.5-71.1c-6.7-2.7-13.8-3.6-20-4.4l-1.7-0.2c-9-1.1-17.2,1.9-24.3,9.1 C320.4,54.879,275.1,100.179,229.9,145.379z M386.4,24.679c0.2,0,0.3,0,0.5,0l1.7,0.2c5.2,0.6,10,1.2,13.8,2.8 c27.2,11,47.2,30.6,59.3,58.2c1.4,3.2,2.3,7.3,3.2,11.6c0.3,1.6,0.7,3.2,1,4.8c-0.4,1.8-1.1,3-2.5,4.3 c-78.7,78.5-157.3,157.2-235.9,235.8c-1.3,1.3-2.5,1.9-4.3,2.3c-28.1,5.9-56.1,11.8-84.2,17.7l-14.8,3.1l2.8-13.1 c6.1-28.8,12.2-57.7,18.4-86.5c0.2-0.9,1-2.3,1.9-3.3c17.4-17.6,34.8-35.1,52.3-52.5l47.5-47.5c45.3-45.3,90.6-90.6,135.8-136 C384.8,24.979,385.7,24.679,386.4,24.679z"/><path d="M38.9,109.379h174.6c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H38.9c-21.5,0-38.9,17.5-38.9,38.9v327.4 c0,21.5,17.5,38.9,38.9,38.9h327.3c21.5,0,38.9-17.5,38.9-38.9v-167.5c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v167.5 c0,7.9-6.5,14.4-14.4,14.4H38.9c-7.9,0-14.4-6.5-14.4-14.4v-327.3C24.5,115.879,31,109.379,38.9,109.379z"/></svg>
                        </div>
                        <img src={avatarimg=="" ? "/assets/img/avatar.jpg" : avatarimg} alt="avatar" />
                        <input type="file" onChange={this.updateAvatar} ref={(ref) => this.upload = ref} style={{ display: 'none' }} multiple accept="image/png, image/gif, image/jpeg"/>
                    </div>
                    <div className="profile-content">
                        <div className="profile-input">
                            <label>アカウント名</label>
                            <input type="text" value={accountName} onChange={this.inputChange('accountName')} />
                        </div>
                        <div className="profile-input">
                            <h4>名前</h4>
                            <div className="profile-input-name">
                                <div>
                                    <label>姓</label>
                                    <input type="text" value={userName1} onChange={this.inputChange('userName1')} />
                                </div>
                                <div>
                                    <label>名</label>
                                    <input type="text" value={userName2} onChange={this.inputChange('userName2')} />
                                </div>
                            </div>
                        </div>
                        <div className="profile-input">
                            <h4>ふりがな</h4>
                            <div className="profile-input-name">
                                <div>
                                    <label>せい</label>
                                    <input type="text" value={gana1} onChange={this.inputChange('gana1')} />
                                </div>
                                <div>
                                    <label>めい</label>
                                    <input type="text" value={gana2} onChange={this.inputChange('gana2')} />
                                </div>
                            </div>
                        </div>
                        <div className="profile-input">
                            <h4>電話番号</h4>
                            <input type="tel" value={phone} onChange={this.inputChange('phone')} />
                        </div>
                        <div className="profile-input">
                            <h4>クレジットカード</h4>
                            <input type="text" value={credit} onChange={this.inputChange('credit')} />
                        </div>
                    </div>
                    <div className="profile-link">
                        <a onClick={this.updateProfile}>プロフィール設定</a>
                    </div>
                    <div className="profile-link">
                        <Link to="/dashboard/profile/change_email">メール更新</Link>
                        <Link to="/dashboard/profile/change_password">パスワード更新</Link>
                    </div>
                </div>
                <div className={`modal ${alertModal? "modal-show" : ""}`} onClick={this.modalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>{error}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default ProfileUpdateView