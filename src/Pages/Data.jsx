import axios from "axios";
import React, {useState, useEffect} from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import moment from "moment";

const baseurl = import.meta.env.EY_BASE_URL;

function DataView() {
    const navigate = useNavigate()
    const userstatus = JSON.parse(localStorage.getItem('userData')).userstatus

    const now = new Date()
    const [date, setDate] = useState(now);
    const [prevMonthDate, setPrevMonthDate] = useState([]);
    const [currentMonthDate, setCurrentMonthDate] = useState([]);
    const [nextMonthDate, setNextMonthDate] = useState([]);
    const [evaluation, setEvaluation] = useState([]);

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    const nextDate = () => {
        var nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setDate(nextDay)
    }

    const prevDate = () => {
        var prevDay = new Date(date);
        prevDay.setDate(date.getDate() - 1);
        setDate(prevDay)
    }

    const nextMonth = () => {
        var nextMonth = new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
        setDate(nextMonth)
    }

    const prevMonth = () => {
        var prevMonth = new Date(date.getFullYear(), date.getMonth()-1, date.getDate())
        setDate(prevMonth)
    }

    function setCurrentDate(item) {
        var currentDate = new Date(date.getFullYear(), date.getMonth(), item)
        setDate(currentDate)
    }
    
    function setNextDate(item) {
        var nextMonthDate = new Date(date.getFullYear(), date.getMonth()+1, item)
        setDate(nextMonthDate)
    }

    function setPrevDate(item) {
        var prevMonthDate = new Date(date.getFullYear(), date.getMonth()-1, item)
        setDate(prevMonthDate)
    }

    const setToday = () => {
        setDate(now)
    }

    useEffect(()=>{
        document.title = "評価データ | Eiyoo"
        getData()
        const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var prevdays = daysInMonth(date.getMonth(), date.getFullYear())
        var currentdays = daysInMonth(date.getMonth()+1, date.getFullYear())
        const dayOfWeekLast = new Date(date.getFullYear(), date.getMonth(), currentdays).getDay()
        var prevDate=[];
        var currentDate=[]
        var nextDate=[]

        for(let i= 0; i<dayOfWeek; i++){
            prevDate.push(prevdays - dayOfWeek + i + 1);
        }

        for(let i= 1; i<=currentdays; i++){
            currentDate.push(i);
        }
        for(let i= dayOfWeekLast; i<6; i++){
            nextDate.push(i - dayOfWeekLast + 1);
        }
        setCurrentMonthDate(currentDate);
        setPrevMonthDate(prevDate);
        setNextMonthDate(nextDate);
        
    }, [date])

    async function getData() {
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        var date1 = moment(date).format('YYYY-MM-DD')
        var data = JSON.stringify({'date': date1,})
        var config = {
            method: 'post',
            url: `${baseurl}/api/user_get_evaluation`,
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        }
        if (userData.userstatus ==3) {
            await axios(config)
                .then((response)=>{
                    if (response.data.evaluation.length>0) {
                        setEvaluation(response.data.evaluation)
                    }
                })
                .catch((error)=>{
                    if (error.response.data.userstatus) {
                        var refresh = userData.refresh
                        var email = userData.email
                        localStorage.setItem('userData', JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'email': email, 'userstatus': error.response.data.userstatus}))
                        window.location.reload()
                    }
                })
        }
    }


    return(
        <>
            {
                userstatus!=3?
                <div className="home home-not-selected">
                    <h3>この機能を利用するには、<br />まずサポーターに申請してください。</h3>
                    <Link to="/dashboard/home">申請する</Link>
                </div>
                :
                <div className="data">
                    <div className="record">
                        <div className="record-date record-devaluation-date">
                            <a onClick={prevMonth}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(7.827 0) rotate(90)" fill="#fff"/></svg></a>
                            <p>
                                {
                                    date.getFullYear().toString() + '年' + (date.getMonth() + 1).toString() + '月'
                                }
                            </p>
                            <a onClick={nextMonth}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(0 13.046) rotate(-90)" fill="#fff"/></svg></a>
                        </div>
                        <div className="record-calendar">
                            <div className="record-calendar-header">
                                <h4>{date.getFullYear().toString()+'年'+(date.getMonth() + 1).toString()+'月'}</h4>
                                <div className="record-calendar-header-link">
                                    <a onClick={setToday} className="record-calendar-today">今日</a>
                                    <a onClick={prevMonth}>
                                        {
                                            date.getMonth()==0?
                                            '12月'
                                            :
                                            date.getMonth().toString()+'月'
                                        }
                                    </a>
                                    <a onClick={nextMonth}>
                                        {
                                            date.getMonth()==11?
                                            '1月'
                                            :
                                            (date.getMonth() + 2).toString() + '月'
                                        }
                                    </a>
                                </div>
                            </div>
                            <div className="record-calendar-body">
                                <div className="record-calendar-week">
                                    <p>日</p>
                                    <p>月</p>
                                    <p>火</p>
                                    <p>水</p>
                                    <p>木</p>
                                    <p>金</p>
                                    <p>土</p>
                                </div>
                                <div className="record-calendar-main">
                                    {prevMonthDate.map(item=>(
                                        <div key={item}>
                                            <p className="notthis">{item}</p>
                                            
                                        </div>
                                    ))}
                                    {currentMonthDate.map((item, index)=>(
                                        <div key={index}>
                                            <p className={`${new Date(date.getFullYear(), date.getMonth(), item).setHours(0,0,0,0) ==new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(0,0,0,0) ? "today" : ""}`}>{item}</p>
                                            <div className="record-evaluation-img">
                                            {
                                                evaluation.length &&  evaluation.filter(evalu=>(new Date(evalu.date).getFullYear()===date.getFullYear())).length>0 && evaluation.filter(evalu=>(new Date(evalu.date).getMonth()===date.getMonth())).length>0 && evaluation.filter(evalu=>(new Date(evalu.date).getDate()===item)).length>0 ? 
                                                <img src={`/assets/img/eval${evaluation.filter(evalu=>(new Date(evalu.date).getDate()===item))[0].evaluation}.png`} alt="" /> 
                                                :
                                                <></>
                                            }
                                            </div>
                                        </div>
                                    ))}
                                    {nextMonthDate.map(item=>(
                                        <div key={item}>
                                            <p className="notthis">{item}</p>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default DataView