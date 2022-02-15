import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

async function setUserData(userdata) {
    localStorage.setItem("userData", JSON.stringify(userdata))
}

class LoginView extends Component {
    state = {
        emailFocus: false,
        passwordFocus: false,
        email: '',
        password: '',
        alertModal: false,
        error: 'ログインに失敗しました。',
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
    handleLogin = e => {
        const {email, password} = this.state;
        if (email == '') {
            this.setState({
                error: 'メールを入力してください。',
                alertModal: true,
            })
            return
        }
        if (password == '') {
            this.setState({
                error: 'パスワードを入力してください。',
                alertModal: true,
            })
            return
        }
        var data = JSON.stringify({"email":email,"password":password});
        var config = {
            method: 'post',
            url: `${baseurl}/api/login`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
        };
        axios(config)
            .then(async (response)=>{
                if (response.data.userstatus!=0) {
                    setUserData(response.data)
                    window.location.assign('/dashboard')
                }
                if (response.data.userstatus==0) {
                    window.location.assign('/email_verify')
                }
            })
            .catch((error)=>{
                this.setState({
                    error: 'メールまたはパスワードが正しくありません。',
                    alertModal: true
                })
            })
    }
    modalClose = e => {
        this.setState({alertModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    componentDidMount() {
        document.title = "ログイン | Eiyoo"
    }
    render() {
        const {emailFocus, passwordFocus, email, password, alertModal, error} = this.state
        return(
            <>
                <div className="top">
                    <img className="top-login-logo" src="/assets/img/logo.png" alt="logo" />
                    <p className="top-login-desc">定額制で栄養アドバイザーから<br/>食事の記録とコミュニケーションし放題</p>
                    <div className="top-login-input">
                        <div className={`top-input-box ${emailFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.4" height="12.576" viewBox="0 0 16.4 12.576"><g transform="translate(0.2 -57.55)"><g transform="translate(0 57.75)"><path d="M14.047,57.75H1.957A1.958,1.958,0,0,0,0,59.707V67.97a1.958,1.958,0,0,0,1.957,1.957H14.043A1.958,1.958,0,0,0,16,67.97V59.71A1.956,1.956,0,0,0,14.047,57.75Zm1.063,10.22a1.064,1.064,0,0,1-1.063,1.063H1.957A1.064,1.064,0,0,1,.894,67.97V59.71a1.064,1.064,0,0,1,1.063-1.063H14.043a1.064,1.064,0,0,1,1.063,1.063v8.26Z" transform="translate(0 -57.75)" fill="#fff" stroke="#fff" strokeWidth="0.4"/><path d="M62.761,112.368l3.326-2.833a.35.35,0,0,0,.028-.511.4.4,0,0,0-.537-.027l-4.587,3.91-.895-.759s-.006-.005-.006-.008a.556.556,0,0,0-.062-.051l-3.641-3.1a.394.394,0,0,0-.537.029.348.348,0,0,0,.031.511l3.366,2.857-3.352,2.98a.35.35,0,0,0-.017.511.4.4,0,0,0,.279.115.392.392,0,0,0,.259-.1l3.4-3.023.923.783a.394.394,0,0,0,.507,0l.948-.807,3.382,3.052a.4.4,0,0,0,.537-.013.35.35,0,0,0-.014-.511Z" transform="translate(-52.982 -106.361)" fill="#fff" stroke="#fff" strokeWidth="0.4"/></g></g></svg>
                            <input type="email" value={email} onFocus={this.inputFocus("email")} onBlur={this.inputBlur('email')} onChange={this.inputChange('email')} />
                            <span>メールアドレス</span>
                        </div>
                        <div className={`top-input-box ${passwordFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><g transform="translate(-245.5 -244)"><g transform="translate(245.5 244)"><circle cx="0.938" cy="0.938" r="0.938" transform="translate(9.45 9.756)" fill="#fff"/><path d="M258.875,258.125a.625.625,0,0,0,.625-.625v-5.125a2.5,2.5,0,0,0-2.5-2.5h-.751v-2.2a3.751,3.751,0,0,0-7.5,0v2.2H248a2.5,2.5,0,0,0-2.5,2.5V257.5A2.5,2.5,0,0,0,248,260h9a2.5,2.5,0,0,0,2.5-2.5.625.625,0,0,0-1.25,0,1.251,1.251,0,0,1-1.25,1.25h-9a1.251,1.251,0,0,1-1.25-1.25v-5.125a1.251,1.251,0,0,1,1.25-1.25h9a1.251,1.251,0,0,1,1.25,1.25V257.5A.625.625,0,0,0,258.875,258.125ZM255,249.875h-5v-2.2a2.5,2.5,0,0,1,5,0Z" transform="translate(-245.5 -244)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(4.963 9.756)" fill="#fff"/><circle cx="0.937" cy="0.937" r="0.937" transform="translate(2.734 9.756)" fill="#fff"/><circle cx="0.938" cy="0.938" r="0.938" transform="translate(7.192 9.756)" fill="#fff"/></g></g></svg>
                            <input type="password" value={password} onFocus={this.inputFocus("password")} onBlur={this.inputBlur('password')} onChange={this.inputChange('password')} />
                            <span>パスワード</span>
                        </div>
                    </div>
                    <div className="top-login-btns">
                        <a onClick={this.handleLogin}>ログイン</a>
                        <Link className="top-login-forgot" to="/password_reset">パスワード忘れる</Link>
                        <div className="top-login-or">
                            <div></div>
                            <h4>OR</h4>
                            <div></div>
                        </div>
                        <Link to="/signup">新規登録</Link>
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

export default LoginView