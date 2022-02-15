import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class ProfilePasswordUpdateView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: '',
            alertModal: false,
            currentPassword: '',
            currentPasswordFocus: false,
            newPassword: '',
            newPasswordFocus: false,
            newPasswordConfirm: '',
            newPasswordConfirmFocus: false,
        }
    }
    componentDidMount() {
        document.title = "パスワード更新 | Eiyoo"
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
    updatePassword = e => {
        const {currentPassword, newPassword, newPasswordConfirm} = this.state
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (currentPassword == '') {
            this.setState({
                error: "現在のパスワードを入力してください。",
                alertModal: true,
            })
            return
        }
        if (newPassword == '') {
            this.setState({
                error: "新しいパスワードを入力してください。",
                alertModal: true,
            })
            return
        }
        if (newPasswordConfirm == '') {
            this.setState({
                error: "新しいパスワードを再入力してください。",
                alertModal: true,
            })
            return
        }
        if (newPassword!=newPasswordConfirm) {
            this.setState({
                error: "新しいパスワードが一致しません。",
                alertModal: true
            })
            return
        }
        var data = JSON.stringify({'currentPass': currentPassword, 'newPass': newPassword})
        var token = loginuserData.token
        var config = {
            method: 'post',
            url: `${baseurl}/api/update_password`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : data
        }
        axios(config)
            .then((response)=>{
                this.setState({
                    error: 'パスワードは正常に変更されました。',
                    alertModal: true
                })
            })
            .catch((error)=>{
                this.setState({
                    error: 'パスワード変更中にエラーが発生しました。',
                    alertModal: true
                })
            })
    }
    render() {
        const {currentPassword, currentPasswordFocus, newPassword, newPasswordFocus, newPasswordConfirm, newPasswordConfirmFocus, error, alertModal} = this.state
        return(
            <>
                <div className="profile profile-email-input">
                    <div className={`top-input-box ${currentPasswordFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                        <input type="password" value={currentPassword} onFocus={this.inputFocus("currentPassword")} onBlur={this.inputBlur('currentPassword')} onChange={this.inputChange('currentPassword')}/>
                        <span>現在のパスワード</span>
                    </div>
                    <div className={`top-input-box ${newPasswordFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                        <input type="password" value={newPassword} onFocus={this.inputFocus("newPassword")} onBlur={this.inputBlur('newPassword')} onChange={this.inputChange('newPassword')}/>
                        <span>新しいパスワード</span>
                    </div>
                    <div className={`top-input-box ${newPasswordConfirmFocus? "focus" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                        <input type="password" value={newPasswordConfirm} onFocus={this.inputFocus("newPasswordConfirm")} onBlur={this.inputBlur('newPasswordConfirm')} onChange={this.inputChange('newPasswordConfirm')}/>
                        <span>新しいパスワード確認</span>
                    </div>
                    <div className="profile-link">
                        <a onClick={this.updatePassword}>パスワード更新</a>
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

export default ProfilePasswordUpdateView