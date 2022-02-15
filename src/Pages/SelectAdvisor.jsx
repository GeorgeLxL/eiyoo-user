import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Swiper from 'react-id-swiper';
import axios from 'axios';
import 'swiper/css/swiper.css';

const baseurl = import.meta.env.EY_BASE_URL;

function SelectAdvisorView (props) {
    const Location = useLocation();

    const [advisorList, setAdvisorList] = useState([]);
    const [alertModal, setAlertModal] = useState(false);
    const [error, setError] = useState('')
    const [errorModal, setErrorModal] = useState(false);
    var confirmPK = '';

    useEffect(() => {
        document.title = "アドバイザー決定 | Eiyoo";

        getAdvisorList();
        document.addEventListener('click', function(){
            var modal = document.getElementsByClassName('modal')[0]
            if (modal.classList.contains('modal-show')) {
                modal.classList.remove('modal-show')
            }
        })
    },[])

    async function getAdvisorList() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var advisor_field = Location.state.advisor_field;
        var data = JSON.stringify({'advisor_field': advisor_field})
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_field_advisor_list`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : data
        }
        if (loginuserData.userstatus == 2) {
            await axios(config)
                .then((response)=>{
                    setAdvisorList(response.data.advisor)
                })
                .catch((error)=>{
                    if (error.response.data.userstatus) {
                        var refresh = loginuserData.refresh
                        var email = loginuserData.email
                        localStorage.setItem('userData', JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'email': email, 'userstatus': error.response.data.userstatus}))
                        window.location.reload()
                    }
                })
        }
    }

    const params = {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        centeredSlides: true,
        slidesPerView: 1,
        activeSlideKey: Location.state.pk,
        rebuildOnUpdate: true,
    }

    
    const modalClose = event => {
        var modal = document.getElementsByClassName('modal')[0]
        if (modal.classList.contains('modal-show')) {
            modal.classList.remove('modal-show')
        }
    }
    const modalClick = event => {
        event.stopPropagation()
    }

    const selectAdvisor = event => {
        event.stopPropagation()
        var advisor = document.getElementsByClassName('swiper-slide-active')[0]
        var modal = document.getElementsByClassName('modal-select')[0]
        confirmPK = advisor.firstChild.value
        modal.classList.add('modal-show')
    }

    async function selectAdvisorConfirm() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var data = JSON.stringify({'pk':confirmPK})
        var config = {
            method: 'post',
            url: `${baseurl}/api/select_advisor`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data : data
        }
        await axios(config)
            .then((response)=>{
                var refresh = loginuserData.refresh
                var email = loginuserData.email
                localStorage.setItem('userData', JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'userstatus': 3, 'email': email }))
                window.location.assign('/dashboard/home')
            })
            .catch((error)=>{
                var modal = document.getElementsByClassName('modal-select')[0]
                if (modal.classList.contains('modal-show')) {
                    modal.classList.add('modal-show')
                }
                setError('アドバイザーの決定中にエラーが発生しました。')
                setErrorModal(true)
            })
    }

    const errorModalClick = () => {
        window.location.assign('/dashboard/home')
    }

    return(
        <>
            <div className="select-advisor">
                <h2>
                    <span style={{display: `${Location.state.advisor_field==1?'block':'none'}`}}>楽しく食事管理をしたい</span>
                    <span style={{display: `${Location.state.advisor_field==2?'block':'none'}`}}>ストイックなダイエットをしたい</span>
                    <span style={{display: `${Location.state.advisor_field==3?'block':'none'}`}}>細かいカロリー制限をしたい</span>
                    <span style={{display: `${Location.state.advisor_field==4?'block':'none'}`}}>とにかく初心者</span>
                </h2>
                <div className="select-advisor-container">
                    <Swiper {...params}>
                        {advisorList.map((advisor)=>(
                            <div
                                className="select-advisor-slider"
                                key = {advisor.pk}
                            >
                                <input type="text" defaultValue={advisor.pk} hidden />
                                <img src={advisor.avatar? `${baseurl}/media/${advisor.avatar}`:'/assets/img/avatar.jpg'} alt="" />
                                <div className="select-advisor-slider-content">
                                    <h3>アドバイザープロフィール</h3>
                                    <h4>{advisor.name1} {advisor.name2}さん</h4>
                                    <p dangerouslySetInnerHTML={{__html: advisor.advisor_bio.replace(/(?:\r\n|\r|\n)/g, '<br />')}}></p>
                                    <h3>スケジュール</h3>
                                    <p>{advisor.advisor_skill}<br />対応が早い時間帯<br />{advisor.advisor_timezone}</p>
                                </div>
                                <a onClick={selectAdvisor}>この人にお願いする</a>
                            </div>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className={`modal ${errorModal?'modal-show':''}`} onClick={errorModalClick} >
                <div className="modal-body">
                    <p>{error}</p>
                </div>
            </div>
            <div className="modal modal-select">
                <div className="modal-body" onClick={modalClick}>
                    <h3>アドバイザーの決定</h3>
                    <p>この人で決定します。<br />よろしいですか？</p>
                    <div className="modal-confirm-box">
                        <a className="modal-btn-confirm" onClick={selectAdvisorConfirm}>お願いする</a>
                        <a className="modal-btn-cancel" onClick={modalClose}>キャンセル</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectAdvisorView