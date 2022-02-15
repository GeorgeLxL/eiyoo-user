import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class PasswordResetView extends Component {
    state = {
        emailFocus: false,
        email: '',
        erroremail: '',
        alertModal: false,
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
    passwordRest = e => {
        const {email} = this.state;
        if (email==="") {
            this.setState({
                erroremail: 'メールを入力してください。',
                alertModal: true,
            })
            return
        }
        var data = JSON.stringify({"email": email});
        var config = {
            method: 'post',
            url: `${baseurl}/api/password_reset`,
            headers: {
                'content-type': 'application/json'
            },
            data : data
        }
        axios(config)
            .then((response)=>{
                localStorage.setItem("userData", JSON.stringify(response.data.email))
                this.setState({
                    erroremail: "再設定メールを送信しました。",
                    alertModal: true,
                })
            })
            .catch((error)=>{
                this.setState({
                    erroremail: 'メールアドレスが存在しません。',
                    alertModal: true,
                })
            })
    }
    modalClose = e => {
        this.setState({alertModal: false, successModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    componentDidMount() {
        document.title = "パスワード更新 | Eiyoo"
    }
    render() {
        const {emailFocus, email, erroremail, alertModal} = this.state
        return(
            <>
                <div className="top">
                    <img src="/assets/img/logo.png" alt="logo" />
                    <div className="top-login-input">
                        <div className={`top-input-box ${emailFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.4" height="12.576" viewBox="0 0 16.4 12.576"><g transform="translate(0.2 -57.55)"><g transform="translate(0 57.75)"><path d="M14.047,57.75H1.957A1.958,1.958,0,0,0,0,59.707V67.97a1.958,1.958,0,0,0,1.957,1.957H14.043A1.958,1.958,0,0,0,16,67.97V59.71A1.956,1.956,0,0,0,14.047,57.75Zm1.063,10.22a1.064,1.064,0,0,1-1.063,1.063H1.957A1.064,1.064,0,0,1,.894,67.97V59.71a1.064,1.064,0,0,1,1.063-1.063H14.043a1.064,1.064,0,0,1,1.063,1.063v8.26Z" transform="translate(0 -57.75)" fill="#fff" stroke="#fff" strokeWidth="0.4"/><path d="M62.761,112.368l3.326-2.833a.35.35,0,0,0,.028-.511.4.4,0,0,0-.537-.027l-4.587,3.91-.895-.759s-.006-.005-.006-.008a.556.556,0,0,0-.062-.051l-3.641-3.1a.394.394,0,0,0-.537.029.348.348,0,0,0,.031.511l3.366,2.857-3.352,2.98a.35.35,0,0,0-.017.511.4.4,0,0,0,.279.115.392.392,0,0,0,.259-.1l3.4-3.023.923.783a.394.394,0,0,0,.507,0l.948-.807,3.382,3.052a.4.4,0,0,0,.537-.013.35.35,0,0,0-.014-.511Z" transform="translate(-52.982 -106.361)" fill="#fff" stroke="#fff" strokeWidth="0.4"/></g></g></svg>
                            <input type="email" value={email} onFocus={this.inputFocus("email")} onBlur={this.inputBlur('email')} onChange={this.inputChange('email')} />
                            <span>メールアドレス</span>
                        </div>
                    </div>
                    <div className="top-login-btns">
                        <a onClick={this.passwordRest}>パスワード更新</a>
                        <div className="top-login-or">
                            <div></div>
                            <h4>OR</h4>
                            <div></div>
                        </div>
                        <Link to="/login">ログイン</Link>
                    </div>
                </div>
                <div className={`modal ${alertModal? "modal-show" : ""}`} onClick={this.modalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>{erroremail}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default PasswordResetView