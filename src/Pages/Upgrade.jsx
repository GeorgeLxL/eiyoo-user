import axios from "axios";
import react, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function UpgradeView() {

    const [countAdvisor, setCountAdvisor] = useState(0)
    const [advisorList, setAdvisorList] = useState([])

    useEffect(()=>{
        document.title = "無料切替 | Eiyoo"
        getData()
    },[])

    const getData = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/user_upgrade_get`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        };
        axios(config)
            .then((response)=> {
                setCountAdvisor(response.data.count)
                setAdvisorList(response.data.advisors)
            })
            .catch((error)=>{
                
            })
    }
    return (
        <>
            <div className="home">
                <div className="upgrade">
                    <h3>現在、<span>{countAdvisor}</span>名の栄養サポーターが在籍しています。<br />専属の栄養サポーターからアドバイス食事の管理をする方はまず有料会員に切り替えて下さい。</h3>
                    <h3>在籍栄養サポーター</h3>
                    <div className="upgrade-advisor-container">
                        {
                            advisorList.map((advisor)=>(
                                <div
                                    className="upgrade-advisor"
                                    key={advisor.pk}
                                >
                                    <img src={advisor.avatar== null ? "/assets/img/avatar.jpg" : `${baseurl}/media/${advisor.avatar}`} alt="avatar" />
                                    <p>{advisor.name1} {advisor.name2}さん</p>
                                </div>
                            ))
                        }
                    </div>
                    <Link to="subscription" className="upgrade-link">有料会員に切り替え</Link>
                </div>
            </div>
        </>
    )
}

export default UpgradeView