import React, { Component } from "react";

class NotFoundView extends Component {
    componentDidMount() {
        document.title = "404 | Eiyoo"
    }
    render() {
        return(
            <>
                <div className="top">
                    <h1 className="not-found">404</h1>
                    <p className="not-found">ページが見つかりません</p>
                </div>
            </>
        )
    }
}

export default NotFoundView