import { Component } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";

class Dashboard extends Component {
    render() {
        return(
            <>
                <Header />
                <main>
                    <div className="main-container">
                        <Outlet />
                    </div>
                </main>
            </>
        )
    }
}

export default Dashboard