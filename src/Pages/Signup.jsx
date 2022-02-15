import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

class SignupView extends Component {
    constructor(props){
        super(props);
        this.state = {
            accountNameFocus: false,
            emailFocus: false,
            passwordFocus: false,
            accountName: '',
            email: '',
            password: '',
            agree: false,
            errorTerms:'',
            erroremail:'',
            errorpassword:'',
            erroraccountName:'',
            alertModal: false,
            successModal: false,
        }
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
    agreeChange = e => {
        this.setState({agree:!this.state.agree})
    }
    handleSignup = e => {
        e.preventDefault();
        const {accountName, email, password, agree} = this.state
        if(!agree){
            this.setState({
                errorTerms:'プライバシーポリシーに同意する必要があります。',
                alertModal:true
            });
            return
        } else {
            this.setState({errorTerms:''})
        }
        var data = JSON.stringify({"accountName":accountName, "email": email, "password":password});
        var config = {
            method: 'post',
            url: `${baseurl}/api/signup`,
            headers: {
                'content-type': 'application/json'
            },
            data : data
        };
        axios(config)
            .then((response)=>{
                localStorage.setItem("userData", JSON.stringify(response.data.email))
                this.setState({successModal: true})
            })
            .catch((error)=>{  
                if(error.response.data) {
                    var errordata = error.response.data;
                    if(errordata.email) {
                        if((errordata.email[0]).indexOf('blank')!==-1){
                            this.setState({erroremail:'メールは必要です。'})
                        }
                        if((errordata.email[0]).indexOf('exists')!==-1)
                        {
                            this.setState({erroremail:'メールは既に存在します。'})
                        }
                        if((errordata.email[0]).indexOf('valid')!==-1)
                        {
                            this.setState({erroremail:'メールは正しくありません。'})
                        }
                    }
                    if(errordata.password) {
                        if((errordata.password[0]).indexOf('blank')!==-1){
                            this.setState({errorpassword:'パスワードは必要です。'})
                        }
                    }
                    if(errordata.accountName) {
                        if((errordata.accountName[0]).indexOf('blank')!==-1)
                        {
                            this.setState({erroraccountName:'アカウント名は必要です。'})
                        }
                        if((errordata.accountName[0]).indexOf('exists')!==-1)
                        {
                            this.setState({erroraccountName:'アカウント名は既存します。'})
                        }
                    
                    }
                }
                this.setState({alertModal: true})
            })
    }
    modalClose = e => {
        this.setState({alertModal: false})
    }
    modalClick = e => {
        e.stopPropagation();
    }
    successModalClose = e => {
        this.setState({successModal: false})
        window.location.assign('/email_verify')
    }
    componentDidMount() {
        document.title = "新規登録 | Eiyoo"
    }
    render() {
        const {accountNameFocus, emailFocus, passwordFocus, accountName, email, password, agree, alertModal, successModal, errorTerms, erroraccountName, erroremail, errorpassword} = this.state
        return(
            <>
                <div className="top">
                    <p className="top-signup-desc">※無料体験を始めていただく際のご注意<br /><br />アカウント作成後、<br />無料でご利用いただけます。<br />お申し込みに際しては、<br />必ず利用規約をご確認ください。</p>
                    <div className="top-login-input">
                        <div className={`top-input-box ${accountNameFocus? "focus" : ""}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15"><g transform="translate(-58 -476)"><g transform="translate(62 476)" fill="none" stroke="#fff" strokeWidth="1"><circle cx="3" cy="3" r="3" stroke="none"/><circle cx="3" cy="3" r="2.5" fill="none"/></g><g transform="translate(58 483)" fill="none" stroke="#fff" strokeWidth="1"><path d="M6,0H8a6,6,0,0,1,6,6V8a0,0,0,0,1,0,0H0A0,0,0,0,1,0,8V6A6,6,0,0,1,6,0Z" stroke="none"/><path d="M6,.5H8A5.5,5.5,0,0,1,13.5,6V7a.5.5,0,0,1-.5.5H1A.5.5,0,0,1,.5,7V6A5.5,5.5,0,0,1,6,.5Z" fill="none"/></g></g></svg>
                            <input type="text" value={accountName} onFocus={this.inputFocus("accountName")} onBlur={this.inputBlur('accountName')} onChange={this.inputChange('accountName')} />
                            <span>アカウント名</span>
                        </div>
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
                        <div className="top-input-checkbox">
                            <label htmlFor="agree">
                                <input type="checkbox" id="agree" checked={agree} onChange={this.agreeChange} />
                                <span></span>
                                利用規約に同意する
                            </label>
                        </div>
                    </div>
                    <div className="top-login-btns">
                        <a onClick={this.handleSignup}>新規登録</a>
                        <div className="top-login-or">
                            <div></div>
                            <h4>OR</h4>
                            <div></div>
                        </div>
                        <Link to="/login">ログイン</Link>
                    </div>
                </div>
                <div className={`modal ${successModal? "modal-show" : ""}`} onClick={this.successModalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>仮登録が完了しました。<br />メールから本登録を完了して下さい。</p>
                        <a onClick={this.successModalClose}>OK</a>
                    </div>
                </div>
                <div className={`modal ${alertModal? "modal-show" : ""}`} onClick={this.modalClose}>
                    <div className="modal-body" onClick={this.modalClick}>
                        <p>{errorTerms? `${errorTerms}`:""}</p>
                        <p>{erroraccountName? `${erroraccountName}`:""}</p>
                        <p>{erroremail? `${erroremail}`:""}</p>
                        <p>{errorpassword? `${errorpassword}`:""}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default SignupView