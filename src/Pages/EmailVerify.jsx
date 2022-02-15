import axios from "axios";
import React, { Component } from "react";

const baseurl = import.meta.env.EY_BASE_URL;

class EmailVerifyView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: '',
            error: '',
            alertModal: false,
        }
    }
    inputChange = fieldNumber => e => {
        this.setState({
            [`code${fieldNumber}`]: (e.target.value).replace(/[^0-9]/ig, '')
        })
        if (fieldNumber != 6 && e.target.value!="") {
            e.target.nextSibling.focus()
        }
        if (fieldNumber != 1 && e.target.value=="") {
            e.target.previousSibling.focus()
        }
    }
    inputFocus = fieldNumber => e=> {
        if (fieldNumber!=1&& e.target.value=="" && e.target.previousSibling.value=="") {
            e.target.previousSibling.focus()
        }
    }
    keyPress = fieldNumber => e => {
        var key = e.keyCode
        if (key==8 && fieldNumber!=1&& e.target.value=="") {
            e.target.previousSibling.focus()
        }
        if (key==8 && e.target.value!="") {
            e.target.focus()
        }
        if (key!=8 &&fieldNumber!=6&&e.target.value!="") {
            e.target.nextSibling.focus()
        }
    }
    handleVerify = e =>{
        if ((JSON.parse(localStorage.getItem('userData')))['userstatus']>=0) {
            var email = JSON.parse(localStorage.getItem('userData')).email
        }
        else {
            email =  JSON.parse(localStorage.getItem("userData")) || null;
        }
        const {code1, code2, code3, code4, code5, code6} = this.state
        var data = JSON.stringify({"code": (code1 + code2 + code3 + code4 + code5 + code6).toString(), "email": email})
        var config = {
            method: 'post',
            url: `${baseurl}/api/email_verify`,
            headers: {
                'content-type': 'application/json'
            },
            data : data
        }
        axios(config)
            .then((response)=>{
                window.location.assign('/login')
            })
            .catch((error)=>{
                this.setState({
                    error: 'メール検証に失敗しました。',
                    alertModal: true
                })
            })
    }
    resendCode = e => {
        if ((JSON.parse(localStorage.getItem('userData')))['userstatus']>=0) {
            var email = JSON.parse(localStorage.getItem('userData')).email
        }
        else {
            email =  JSON.parse(localStorage.getItem("userData")) || null;
        }
        var data = JSON.stringify({'email': email})
        var config = {
            method: 'post',
            url: `${baseurl}/api/resend_code`,
            headers: {
                'content-type': 'application/json'
            },
            data : data
        }
        axios(config)
            .then((response) => {
                this.setState({
                    error:'検証コードが再送信されました。',
                    alertModal: true
                })
            })
            .catch((error)=>{
                this.setState({
                    error: '検証コードを再送信できません。',
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
        document.title = "メール検証 | Eiyoo"
    }
    render() {
        const {code1, code2, code3, code4, code5, code6, alertModal, error} = this.state
        return(
            <>
                <div className="top verify">
                    <h2>メール検証</h2>
                    <div className="top-verify-input">
                        <input type="text" maxLength="1" minLength="1" value={code1} onChange={this.inputChange(1)} onFocus={this.inputFocus(1)} onKeyDown={this.keyPress(1)} />
                        <input type="text" maxLength="1" minLength="1" value={code2} onChange={this.inputChange(2)} onFocus={this.inputFocus(2)} onKeyDown={this.keyPress(2)} />
                        <input type="text" maxLength="1" minLength="1" value={code3} onChange={this.inputChange(3)} onFocus={this.inputFocus(3)} onKeyDown={this.keyPress(3)} />
                        <input type="text" maxLength="1" minLength="1" value={code4} onChange={this.inputChange(4)} onFocus={this.inputFocus(4)} onKeyDown={this.keyPress(4)} />
                        <input type="text" maxLength="1" minLength="1" value={code5} onChange={this.inputChange(5)} onFocus={this.inputFocus(5)} onKeyDown={this.keyPress(5)} />
                        <input type="text" maxLength="1" minLength="1" value={code6} onChange={this.inputChange(6)} onFocus={this.inputFocus(6)} onKeyDown={this.keyPress(6)} />
                    </div>
                    <a onClick={this.handleVerify}>検証</a>
                    <a onClick={this.resendCode}>コードを再送信</a>
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

export default EmailVerifyView