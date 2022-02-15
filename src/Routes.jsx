import { Navigate } from 'react-router-dom'

import TopView from './Pages/Top';
import LoginView from './Pages/Login';
import SignupView from './Pages/Signup';
import PasswordResetView from './Pages/PasswordReset';
import PasswordResetVerifyView from './Pages/PasswordResetVerify';
import EmailVerifyView from './Pages/EmailVerify';
import TermsView from './Pages/Terms';
import PrivacyView from './Pages/Privacy';

import Dashboard from './Layout/Dashboard';
import HomeView from './Pages/Home';
import UpgradeView from './Pages/Upgrade';
import SubscriptionView from './Pages/Subscription';
import SelectAdvisorView from './Pages/SelectAdvisor';
import ProfileView from './Pages/Profile';
import ProfileUpdateView from './Pages/ProfileUpdate';
import ProfileEmailUpdateView from './Pages/ProfileEmailUpdate';
import ProfilePasswordUpdateView from './Pages/ProfilePasswordUpdate';
import RecordView from './Pages/Record';
import DataView from './Pages/Data';
import MessageView from './Pages/Message';

import NotFoundView from './Pages/NotFound';

var userData =  JSON.parse(localStorage.getItem("userData")) || null;

const routes = [
    {
        path: 'dashboard',
        element: userData && userData.userstatus!=0? <Dashboard /> : <Navigate to ="/login" />,
        children: [
            { path: '', element: userData && userData.userstatus!=0? <Navigate to="home" /> : <Navigate to="/login" /> },
            { path: 'home', element: userData && userData.userstatus!=0? <HomeView /> : <Navigate to="/login" /> },
            { path: 'home/select_advisor', element: userData && userData.userstatus==2? <SelectAdvisorView /> : userData && userData.userstatus==1? <Navigate to="/dashboard/home/upgrade" /> : <Navigate to="/login" /> },
            { path: 'home/upgrade', element: userData && userData.userstatus==1? <UpgradeView /> : userData && userData.userstatus>1? <Navigate to="/dashboard/home" /> : <Navigate to="/login" /> },
            { path: 'home/upgrade/subscription', element: userData && userData.userstatus==1? <SubscriptionView /> : userData && userData.userstatus>1? <Navigate to="/dashboard/home" /> : <Navigate to="/login" /> },
            { path: 'home/upgrade/*', element: userData && userData.userstatus==1? <SubscriptionView /> : userData && userData.userstatus>1? <Navigate to="/dashboard/home" /> : <Navigate to="/login" /> },
            { path: 'profile', element: userData && userData.userstatus!=0? <ProfileView /> : <Navigate to="/login" /> },
            { path: 'profile/profile_update', element: userData && userData.userstatus!=0? <ProfileUpdateView /> : <Navigate to="/login" /> },
            { path: 'profile/change_email', element: userData && userData.userstatus!=0? <ProfileEmailUpdateView /> : <Navigate to="/login" /> },
            { path: 'profile/change_password', element: userData && userData.userstatus!=0? <ProfilePasswordUpdateView /> : <Navigate to="/login" /> },
            { path: 'record', element: userData && userData.userstatus!=0? <RecordView /> : <Navigate to="/login" /> },
            { path: 'data', element: userData && userData.userstatus!=0? <DataView /> : <Navigate to="/login" /> },
            { path: 'message', element: userData && userData.userstatus!=0? <MessageView /> : <Navigate to="/login" /> },
            { path: 'inquiry', element: userData && userData.userstatus!=0? <ProfileView /> : <Navigate to="/login" /> },
            { path: '*', element: <Navigate to="/404" />}
        ]
    },
    {
        path: '/',
        children: [
            { path: '', element: <TopView />},
            { path: 'login', element: <LoginView />},
            { path: 'signup', element: <SignupView />},
            { path: 'password_reset', element: <PasswordResetView />},
            { path: 'password_reset/*', element: <PasswordResetVerifyView />},
            { path: 'email_verify', element: <EmailVerifyView />},
            { path: 'terms_service', element: <TermsView />},
            { path: 'privacy_policy', element: <PrivacyView />},
            { path: '404', element: <NotFoundView /> }, 
            { path: '*', element: <Navigate to="/404" /> }
        ]
    }
];
  
export default routes;