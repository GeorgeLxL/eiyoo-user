import React, { Component } from "react";
import { Link } from "react-router-dom";

class TopView extends Component {
    render() {
        return(
            <div className="top">
                <img src="/assets/img/logo.png" alt="logo" />
                <div className="top-link">
                    <Link to="login">ログイン</Link>
                    <Link to="signup">新規登録</Link>
                    <Link to="terms_service">利用規約</Link>
                    <Link to="privacy_policy">プライバシーポリシー</Link>
                </div>
            </div>
        )
    }
}

export default TopView