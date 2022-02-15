import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function RecordView() {
    const userstatus = JSON.parse(localStorage.getItem('userData')).userstatus

    const now = new Date()
    const [date, setDate] = useState(now);
    const [prevMonthDate, setPrevMonthDate] = useState([]);
    const [currentMonthDate, setCurrentMonthDate] = useState([]);
    const [nextMonthDate, setNextMonthDate] = useState([]);
    const [photoURL1, setPhotoURL1] = useState('')
    const [photoURL2, setPhotoURL2] = useState('')
    const [photoURL3, setPhotoURL3] = useState('')
    const [photoFile1, setPhotoFile1] = useState(null)
    const [photoFile2, setPhotoFile2] = useState(null)
    const [photoFile3, setPhotoFile3] = useState(null)
    const [content1, setContent1] = useState('')
    const [content2, setContent2] = useState('')
    const [content3, setContent3] = useState('')
    const [alertModal, setAlertModal] = useState(false)
    const [select, setSelect] = useState(1)
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState('')
    const upload1 = useRef()
    const upload2 = useRef()
    const upload3 = useRef()
    const capture1 = useRef()
    const capture2 = useRef()
    const capture3 = useRef()
    
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

    function selectPhoto(n) {
        setAlertModal(true);
        setSelect(n)
    }
    function updatePhoto(n) {
        let fileObj = event.target.files[0];
        let photo = URL.createObjectURL(fileObj);
        if (n==1) {
            setPhotoFile1(fileObj)
            setPhotoURL1(photo)
        }
        if (n==2) {
            setPhotoFile2(fileObj)
            setPhotoURL2(photo)
        }
        if (n==3) {
            setPhotoFile3(fileObj)
            setPhotoURL3(photo)
        }
    }

    function uploadClick(n) {
        if (n==1) {
            upload1.current.click()
            setAlertModal(false)
        }
        if (n==2) {
            upload2.current.click()
            setAlertModal(false)
        }
        if (n==3) {
            upload3.current.click()
            setAlertModal(false)
        }
    }
    function captureClick(n) {
        if (n==1) {
            capture1.current.click()
            setAlertModal(false)
        }
        if (n==2) {
            capture2.current.click()
            setAlertModal(false)
        }
        if (n==3) {
            capture3.current.click()
            setAlertModal(false)
        }
    }

    async function saveData(n) {
        var fd = new FormData()
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        if (n==1) {
            if (photoFile1==null) {
                setError('写真をアップロードしてください。')
                setErrorModal(true)
                return
            }
            if (content1=='') {
                setError('内容を入力してください。')
                setErrorModal(true)
                return
            }
        }
        if (n==2) {
            if (photoFile2==null) {
                setError('写真をアップロードしてください。')
                setErrorModal(true)
                return
            }
            if (content2=='') {
                setError('内容を入力してください。')
                setErrorModal(true)
                return
            }
        }
        if (n==3) {
            if (photoFile3==null) {
                setError('写真をアップロードしてください。')
                setErrorModal(true)
                return
            }
            if (content3=='') {
                setError('内容を入力してください。')
                setErrorModal(true)
                return
            }
        }
        var date1 = moment(date).format('YYYY-MM-DD HH:mm')
        switch(n){
            case 1:
                fd.append('date', date1)
                fd.append('meals', n)
                fd.append('photo', photoFile1)
                fd.append('content', content1)
                break
            case 2:
                fd.append('date', date1)
                fd.append('meals', n)
                fd.append('photo', photoFile2)
                fd.append('content', content2)
                break
            default:
                fd.append('date', date1)
                fd.append('meals', n)
                fd.append('photo', photoFile3)
                fd.append('content', content3)
                break
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/record_meal`,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            data: fd
        }
        if (userData.userstatus==3) {
            await axios(config)
                .then((response) => {
                    setError('食事が記録されました。')
                    setErrorModal(true)
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

    useEffect(()=>{
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
        getData()
    }, [date]);
    useEffect(()=>{
        document.title="食事記録 | Eiyoo"
    },[])

    async function getData() {
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        var date1 = moment(date).format('YYYY-MM-DD HH:mm')
        var data = JSON.stringify({'date': date1})
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_mealData`,
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        }
        if (userData.userstatus==3) {
            await axios(config)
                .then((response)=>{
                    if (response.data.meal.meal1.length==1) {
                        setPhotoURL1(`${baseurl}/media/${response.data.meal.meal1[0].photo}`)
                        setContent1(response.data.meal.meal1[0].content)
                    }
                    else {
                        setPhotoURL1('')
                        setContent1('')
                    }
                    if (response.data.meal.meal2.length==1) {
                        setPhotoURL2(`${baseurl}/media/${response.data.meal.meal2[0].photo}`)
                        setContent2(response.data.meal.meal2[0].content)
                    }
                    else {
                        setPhotoURL2('')
                        setContent2('')
                    }
                    if (response.data.meal.meal3.length==1) {
                        setPhotoURL3(`${baseurl}/media/${response.data.meal.meal3[0].photo}`)
                        setContent3(response.data.meal.meal3[0].content)
                    }
                    else {
                        setPhotoURL3('')
                        setContent3('')
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
                <>
                    <div className="home">
                        <h2>食事を記録する</h2>
                        <div className="record">
                            <div className="record-date">
                                <a onClick={prevDate}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(7.827 0) rotate(90)" fill="#fff"/></svg></a>
                                <p>
                                    {
                                        date.getFullYear().toString() + '年' + (date.getMonth() + 1).toString() + '月' + date.getDate().toString() + '日'
                                    }
                                </p>
                                <a onClick={nextDate}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(0 13.046) rotate(-90)" fill="#fff"/></svg></a>
                            </div>
                            <div className="record-main">
                                <div className="record-card">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>朝ご飯</td>
                                                <td>
                                                    <a onClick={()=>selectPhoto(1)}>写真をアップロード</a>
                                                </td>
                                                <td>
                                                    <a onClick={()=>saveData(1)}>メモ</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    {
                                                        photoURL1!=''?
                                                        <img src={photoURL1} alt="" />
                                                        :
                                                        <></>
                                                    }
                                                    <input type="file" onChange={() => updatePhoto(1)} ref={upload1} hidden multiple accept="image/*"/>
                                                    <input type="file" onChange={() => updatePhoto(1)} capture="camera" ref={capture1} hidden multiple accept="image/*" />
                                                </td>
                                                <td>
                                                    {
                                                        photoURL1!=''?
                                                        <textarea rows="5" autoFocus value={content1} onChange={(e) =>setContent1(e.target.value)}></textarea>
                                                        :
                                                        <></>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="record-card">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>昼ご飯</td>
                                                <td>
                                                    <a onClick={()=>selectPhoto(2)}>写真をアップロード</a>
                                                </td>
                                                <td>
                                                    <a onClick={()=>saveData(2)}>メモ</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    {
                                                        photoURL2!=''?
                                                        <img src={photoURL2} alt="" />
                                                        :
                                                        <></>
                                                    }
                                                    <input type="file" onChange={() => updatePhoto(2)} ref={upload2} hidden multiple accept="image/*" />
                                                    <input type="file" onChange={() => updatePhoto(2)} capture="camera" ref={capture2} hidden multiple accept="image/*" />
                                                </td>
                                                <td>
                                                    {
                                                        photoURL2!=''?
                                                        <textarea rows="5" autoFocus value={content2} onChange={(e) =>setContent2(e.target.value)}></textarea>
                                                        :
                                                        <></>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="record-card">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>夜ご飯</td>
                                                <td>
                                                    <a onClick={()=>selectPhoto(3)}>写真をアップロード</a>
                                                </td>
                                                <td>
                                                    <a onClick={()=>saveData(3)}>メモ</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    {
                                                        photoURL3!=''?
                                                        <img src={photoURL3} alt="" />
                                                        :
                                                        <></>
                                                    }
                                                    <input type="file" onChange={() => updatePhoto(3)} ref={upload3} hidden accept="image/*" />
                                                    <input type="file" onChange={() => updatePhoto(3)} capture="camera" ref={capture3} hidden multiple accept="image/*" />
                                                </td>
                                                <td>
                                                    {
                                                        photoURL3!=''?
                                                        <textarea rows="5" autoFocus value={content3} onChange={(e) =>setContent3(e.target.value)}></textarea>
                                                        :
                                                        <></>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                                            <div key={item}><a onClick={() => setPrevDate(item)} className="notthis">{item}</a></div>
                                        ))}
                                        {currentMonthDate.map(item=>(
                                            <div key={item}><a onClick={() =>setCurrentDate(item)} className={`${new Date(date.getFullYear(), date.getMonth(), item).setHours(0,0,0,0) ==new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(0,0,0,0) ? "today" : ""} ${item===date.getDate() ? "current" : ""}`}>{item}</a></div>
                                        ))}
                                        {nextMonthDate.map(item=>(
                                            <div key={item}><a onClick={() => setNextDate(item)} className="notthis">{item}</a></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`modal ${alertModal? 'modal-show':''}`} onClick={() => setAlertModal(false)}>
                        <div className="modal-body">
                            <p>写真を選択してください。</p>
                            <div className="modal-upload-btn">
                            {
                                select==1?
                                <>
                                <a onClick={() => uploadClick(1)}>写真を撮る</a>
                                <a onClick={() => captureClick(1)}>カメラロールから選ぶ</a>
                                </>
                                :
                                select==2?
                                <>
                                <a onClick={() => uploadClick(2)}>写真を撮る</a>
                                <a onClick={() => captureClick(2)}>カメラロールから選ぶ</a>
                                </>
                                :
                                <>
                                <a onClick={() => uploadClick(3)}>写真を撮る</a>
                                <a onClick={() => captureClick(3)}>カメラロールから選ぶ</a>
                                </>
                            }
                            </div>
                        </div>
                    </div>
                    <div className={`modal ${errorModal?'modal-show':''}`} onClick={()=>setErrorModal(false)}>
                        <div className="modal-body">
                            {error}
                        </div>
                    </div>
                </>
                
            }
        </>
    )
}

export default RecordView