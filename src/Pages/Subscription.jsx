import axios from 'axios';
import { CardNumberElement, CardCvcElement, CardElement, useStripe, useElements, } from '@stripe/react-stripe-js';
import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';

const baseurl = import.meta.env.EY_BASE_URL;

function SubscriptionView () {
    const now = new Date()
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [agree, setAgree] = useState(false);
    const [email, setEmail] = useState(userData.email)
    const [name, setName] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [error, setError] = useState('');
    const [alertModal, setAlertModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [date, setDate] = useState(now)
    const [expiry, setExpiry] = useState(now)
    const stripe = useStripe();
    const elements = useElements();
    const inputStyle = {
        iconColor: 'white',
        color: 'white',
        fontWeight: '300',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        ':-webkit-autofill': {
          color: 'white',
        },
        '::placeholder': {
          color: 'rgba(255, 255, 255, .8)',
        },
    }

    useEffect(()=>{
        document.title = "無料切替 | Eiyoo"
        createSubscription()
    },[email])
    
    const createSubscription = async () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var data = JSON.stringify({'email': email})
        var config = {
            method: 'post',
            url: `${baseurl}/api/user_create_subscription`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data: data
        };
        await axios(config)
            .then((response)=>{
                setClientSecret(response.data.clientSecret)
            })
            .catch((error)=>{

            })
    }

    const handlePayment = (e) => {
        e.preventDefault();
        var card = elements.getElement(CardElement)
        if (agree == false) {
            setError('プライバシーポリシーに同意する必要があります。')
            setAlertModal(true)
            return;
        }
        if (name == '') {
            setError('お名前を入力してください。')
            setAlertModal(true)
            return;
        }
        stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: name,
                    },
                }
            }
        ).then((result)=>{
            if (result.error) {
                setSuccess(false)
                setSuccessModal(true)
            }
            else {
                var refresh = userData.refresh
                var token = userData.token
                localStorage.setItem('userData', JSON.stringify({'status code': 200, 'token': token, 'refresh': refresh, 'email': email, 'userstatus': 2}))
                var now = new Date()
                var expiry = new Date(now.getFullYear(), now.getMonth()+1, now.getDate())
                setDate(now)
                setExpiry(expiry)
                setSuccess(true)
                setSuccessModal(true)
            }
        })
    }

    return(
        <>
            <div className="home">
                <div className="subscription">
                    <h4>月額プラン<br />月々のお支払い<br /><br />¥3,300円 (税込)<br /><br />決済方法はクレジットカード / デビットカードのみとなります。<br /><br />お申し込みに際しては、必ず利用規約をご確認ください。</h4>
                    <div className="top-input-checkbox">
                        <label htmlFor="agree">
                            <input type="checkbox" id="agree" checked={agree} onChange={()=>setAgree(!agree)} />
                            <span></span>
                            利用規約に同意する
                        </label>
                    </div>
                    <div className="subscription-main">
                        <div className="subscription-email">
                            <h4>メールアドレス</h4>
                            <h4>{userData.email}</h4>
                        </div>
                        <div className='subscription-input'>
                            <h4>カード所有者名</h4>
                            <div>
                                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                            </div>
                        </div>
                        <div className='subscription-input'>
                            <h4>カード情報</h4>
                            <div>
                                <CardElement options={{style: {base: inputStyle}}} />
                            </div>
                        </div>
                            <button onClick={handlePayment}>支払う</button>
                    </div>
                </div>
            </div>
            <div className={`modal ${alertModal? "modal-show" : ""}`} onClick={()=>setAlertModal(false)}>
                <div className="modal-body" onClick={(e)=>e.stopPropagation()}>
                    <p>{error}</p>
                </div>
            </div>
            <div className={`modal subscription-modal ${successModal? "modal-show" : ""}`} onClick={()=>setSuccessModal(false)}>
                <div className="modal-body" onClick={(e)=>e.stopPropagation()}>
                    <h4>
                        {
                            success?
                            '決済に成功しました。'
                            :
                            '決済に失敗しました。'
                        }
                    </h4>
                    <p>
                        {
                            success?
                            <>
                                有料会員期間は<br />
                                {date.getFullYear().toString()}年{(date.getMonth() + 1).toString()}月{date.getDate().toString()}日から{expiry.getFullYear().toString()}年{(expiry.getMonth() + 1).toString()}月{expiry.getDate().toString()}日までです。<br />
                                （自動更新）
                            </>
                            :
                            ''
                        }
                    </p>
                    <a href="/dashboard/home">ホームに戻る</a>
                </div>
            </div>
        </>
    )
}

export default SubscriptionView