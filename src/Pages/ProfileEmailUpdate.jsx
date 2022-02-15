import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class ProfileEmailUpdateView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: '',
            alertModal: false,
            currentEmail: '',
            currentEmailFocus: false,
            newEmail: '',
            newEmailFocus: false,
            newEmailConfirm: '',
            newEmailConfirmFocus: false,
        }
    }
    componentDidMount() {
        document.title = "メール更新 | Eiyoo"
    }
    inputFocus = fieldName => e => {
        this.setState({
            [`${fieldName}Focus`]: true
        })
    }
    inputBlur = fieldName => e => {
        if (e.target.value=='') {
            this.setState({
                [`${fieldName}Focus`]: false
            })
        }
    }
    inputChange = fieldName => e => {
        this.setState({
            [fieldName]: e.target.value
        })
    }
    modalClose = e => {
        this.setState({alertModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    updateEmail= e=> {
        const {currentEmail, newEmail, newEmailConfirm} = this.state
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (currentEmail != loginuserData.email) {
            this.setState({
                error: "現在のメールが正しくありません。",
                alertModal: true,
            })
            return
        }
        if (currentEmail == '') {
            this.setState({
                error: "現在のメールを入力してください。",
                alertModal: true,
            })
            return
        }
        if (newEmail == '') {
            this.setState({
                error: "新しいメールを入力してください。",
                alertModal: true,
            })
            return
        }
        if (newEmailConfirm == '') {
            this.setState({
                error: "新しいメールを再入力してください。",
                alertModal: true,
            })
            return
        }
        if (newEmail!=newEmailConfirm) {
            this.setState({
                error: "新しいメールが一致しません。",
                alertModal: true
            })
            return
        }
        var data = JSON.stringify({'email': newEmail})
        var token = loginuserData.token
        var config = {
            method: 'post',
            url: `${baseurl}/api/update_email`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : data
        }
        axios(config)
            .then((response)=>{
                var refresh = loginuserData.refresh
                var userstatus = loginuserData.userstatus
                localStorage.setItem("userData", JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'userstatus': userstatus, 'email': response.data.email }))
                this.setState({
                    error: 'メールは正常に変更されました。',
                    alertModal: true
                })
            })
            .catch((error)=>{
                this.setState({
                    error: 'メール変更中にエラーが発生しました。',
                    alertModal: true
                })
            })
    }
    render() {
        const {currentEmail, currentEmailFocus, newEmail, newEmailFocus, newEmailConfirm, newEmailConfirmFocus, error, alertModal} = this.state
        return(
            <>
                <div className="profile profile-email-input">
                    <div className={`top-input-box ${currentEmailFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.4" height="12.576" viewBox="0 0 16.4 12.576"><g transform="translate(0.2 -57.55)"><g transform="translate(0 57.75)"><path d="M14.047,57.75H1.957A1.958,1.958,0,0,0,0,59.707V67.97a1.958,1.958,0,0,0,1.957,1.957H14.043A1.958,1.958,0,0,0,16,67.97V59.71A1.956,1.956,0,0,0,14.047,57.75Zm1.063,10.22a1.064,1.064,0,0,1-1.063,1.063H1.957A1.064,1.064,0,0,1,.894,67.97V59.71a1.064,1.064,0,0,1,1.063-1.063H14.043a1.064,1.064,0,0,1,1.063,1.063v8.26Z" transform="translate(0 -57.75)" fill="#fff" stroke="#fff" strokeWidth="0.4"/><path d="M62.761,112.368l3.326-2.833a.35.35,0,0,0,.028-.511.4.4,0,0,0-.537-.027l-4.587,3.91-.895-.759s-.006-.005-.006-.008a.556.556,0,0,0-.062-.051l-3.641-3.1a.394.394,0,0,0-.537.029.348.348,0,0,0,.031.511l3.366,2.857-3.352,2.98a.35.35,0,0,0-.017.511.4.4,0,0,0,.279.115.392.392,0,0,0,.259-.1l3.4-3.023.923.783a.394.394,0,0,0,.507,0l.948-.807,3.382,3.052a.4.4,0,0,0,.537-.013.35.35,0,0,0-.014-.511Z" transform="translate(-52.982 -106.361)" fill="#fff" stroke="#fff" strokeWidth="0.4"/></g></g></svg>
                        <input type="email" value={currentEmail} onFocus={this.inputFocus("currentEmail")} onBlur={this.inputBlur('currentEmail')} onChange={this.inputChange('currentEmail')}/>
                        <span>現在のメールアドレス</span>
                    </div>
                    <div className={`top-input-box ${newEmailFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.4" height="12.576" viewBox="0 0 16.4 12.576"><g transform="translate(0.2 -57.55)"><g transform="translate(0 57.75)"><path d="M14.047,57.75H1.957A1.958,1.958,0,0,0,0,59.707V67.97a1.958,1.958,0,0,0,1.957,1.957H14.043A1.958,1.958,0,0,0,16,67.97V59.71A1.956,1.956,0,0,0,14.047,57.75Zm1.063,10.22a1.064,1.064,0,0,1-1.063,1.063H1.957A1.064,1.064,0,0,1,.894,67.97V59.71a1.064,1.064,0,0,1,1.063-1.063H14.043a1.064,1.064,0,0,1,1.063,1.063v8.26Z" transform="translate(0 -57.75)" fill="#fff" stroke="#fff" strokeWidth="0.4"/><path d="M62.761,112.368l3.326-2.833a.35.35,0,0,0,.028-.511.4.4,0,0,0-.537-.027l-4.587,3.91-.895-.759s-.006-.005-.006-.008a.556.556,0,0,0-.062-.051l-3.641-3.1a.394.394,0,0,0-.537.029.348.348,0,0,0,.031.511l3.366,2.857-3.352,2.98a.35.35,0,0,0-.017.511.4.4,0,0,0,.279.115.392.392,0,0,0,.259-.1l3.4-3.023.923.783a.394.394,0,0,0,.507,0l.948-.807,3.382,3.052a.4.4,0,0,0,.537-.013.35.35,0,0,0-.014-.511Z" transform="translate(-52.982 -106.361)" fill="#fff" stroke="#fff" strokeWidth="0.4"/></g></g></svg>
                        <input type="email" value={newEmail} onFocus={this.inputFocus("newEmail")} onBlur={this.inputBlur('newEmail')} onChange={this.inputChange('newEmail')}/>
                        <span>新しいメールアドレス</span>
                    </div>
                    <div className={`top-input-box ${newEmailConfirmFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.4" height="12.576" viewBox="0 0 16.4 12.576"><g transform="translate(0.2 -57.55)"><g transform="translate(0 57.75)"><path d="M14.047,57.75H1.957A1.958,1.958,0,0,0,0,59.707V67.97a1.958,1.958,0,0,0,1.957,1.957H14.043A1.958,1.958,0,0,0,16,67.97V59.71A1.956,1.956,0,0,0,14.047,57.75Zm1.063,10.22a1.064,1.064,0,0,1-1.063,1.063H1.957A1.064,1.064,0,0,1,.894,67.97V59.71a1.064,1.064,0,0,1,1.063-1.063H14.043a1.064,1.064,0,0,1,1.063,1.063v8.26Z" transform="translate(0 -57.75)" fill="#fff" stroke="#fff" strokeWidth="0.4"/><path d="M62.761,112.368l3.326-2.833a.35.35,0,0,0,.028-.511.4.4,0,0,0-.537-.027l-4.587,3.91-.895-.759s-.006-.005-.006-.008a.556.556,0,0,0-.062-.051l-3.641-3.1a.394.394,0,0,0-.537.029.348.348,0,0,0,.031.511l3.366,2.857-3.352,2.98a.35.35,0,0,0-.017.511.4.4,0,0,0,.279.115.392.392,0,0,0,.259-.1l3.4-3.023.923.783a.394.394,0,0,0,.507,0l.948-.807,3.382,3.052a.4.4,0,0,0,.537-.013.35.35,0,0,0-.014-.511Z" transform="translate(-52.982 -106.361)" fill="#fff" stroke="#fff" strokeWidth="0.4"/></g></g></svg>
                        <input type="email" value={newEmailConfirm} onFocus={this.inputFocus("newEmailConfirm")} onBlur={this.inputBlur('newEmailConfirm')} onChange={this.inputChange('newEmailConfirm')}/>
                        <span>新しいメールアドレス確認</span>
                    </div>
                    <div className="profile-link">
                        <a onClick={this.updateEmail}>メール更新</a>
                        <Link to="/dashboard/profile/profile_update">取消</Link>
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

export default ProfileEmailUpdateView