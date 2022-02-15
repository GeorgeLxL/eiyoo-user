import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class PasswordResetVerifyView extends Component {
    state = {
        email: '',
        error: true,
        alertModal: false,
        newPass: '',
        newPassConfirm: '',
        newPassFocus: false,
        newPassConfirmFocus: false,
        message: '',
        successModal: false,
    }
    componentDidMount() {
        document.title = "パスワード更新 | Eiyoo"
        var email= window.location.pathname.split("/")[2]
        var code= window.location.pathname.split("/")[3]
        this.setState({
            email: email
        })
        
        var data = JSON.stringify({'code': code, 'email': email})
        var config = {
            method: 'post',
            url: `${baseurl}/api/password_reset_verify`,
            headers: {
                'content-type': 'application/json'
            },
            data : data
        }
        axios(config)
            .then((response) =>{
                this.setState({
                    error: false
                })
            })
            .catch((error) =>{
                this.setState({
                    error: true
                })
            })
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
        this.setState({alertModal: false, successModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    passwordRest = e => {
        const { newPass, newPassConfirm} = this.state
        if (newPass=='') {
            this.setState({
                message: '新しいパスワードを入力してください。',
                alertModal: true
            })
        }
        else if (newPassConfirm=='') {
            this.setState({
                message: '新しいパスワードを再入力してください。',
                alertModal: true
            })
        }
        else if (newPass!=newPassConfirm) {
            this.setState({
                message: "新しいパスワードが一致しません。",
                alertModal: true
            })
        }
        else {
            var data = JSON.stringify({'email': this.state.email, 'password': newPass})
            var config = {
                method: 'post',
                url: `${baseurl}/api/password_reset_confirm`,
                headers: {
                    'content-type': 'application/json'
                },
                data : data
            }
            axios(config)
                .then((response)=>{
                    this.setState({
                        message: 'パスワードは正常に変更されました。',
                        successModal: true
                    })
                })
                .catch((error)=>{
                    this.setState({
                        message: "パスワード変更中にエラーが発生しました。",
                        alertModal: true
                    })
                })
        }
    }
    successModalClose = e =>{
        this.setState({successModal: false})
        window.location.assign('/login')
    }
    render() {
        const {error, alertModal, newPass, newPassConfirm, newPassFocus, newPassConfirmFocus, message, successModal} = this.state
        return(
            <>
                <div className="top" style={{display: `${error? "none":"block"}`}}>
                    <img src="/assets/img/logo.png" alt="logo" />
                    <div className="top-login-input">
                        <div className={`top-input-box ${newPassFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                            <input type="password" value={newPass} onFocus={this.inputFocus("newPass")} onBlur={this.inputBlur('newPass')} onChange={this.inputChange('newPass')} />
                            <span>新しいパスワード</span>
                        </div>
                        <div className={`top-input-box ${newPassConfirmFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                            <input type="password" value={newPassConfirm} onFocus={this.inputFocus("newPassConfirm")} onBlur={this.inputBlur('newPassConfirm')} onChange={this.inputChange('newPassConfirm')} />
                            <span>新しいパスワード確認</span>
                        </div>
                    </div>
                    <div className="top-login-btns">
                        <a onClick={this.passwordRest}>RESET PASSWORD</a>
                        <div className="top-login-or">
                            <div></div>
                            <h4>OR</h4>
                            <div></div>
                        </div>
                        <Link to="/login">LOGIN</Link>
                    </div>
                </div>
                <div className={`modal ${successModal? "modal-show" : ""}`} onClick={this.successModalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>{message}</p>
                        <a onClick={this.successModalClose}>OK</a>
                    </div>
                </div>
                <div className={`modal ${alertModal? "modal-show" : ""}`} onClick={this.modalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>{message}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default PasswordResetVerifyView