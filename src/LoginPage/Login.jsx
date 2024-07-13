import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import axios from 'axios';
import { songContext } from '../App';
import Cookie from 'js-cookie';

export function auth() {
    const userCookie = Cookie.get('auth');
    if (userCookie) {
        try {
            const user = JSON.parse(userCookie);
            console.log("Cookie Gotcha :)");
            return user;
        } catch (e) {
            console.error("Error parsing cookie:", e);
            return null;
        }
    } else {
        console.log('No user cookie found');
        return null;
    }
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, setLogin, favourites, setFavourites } = useContext(songContext);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    async  function notify(status) {
        if (status === 200) {
            await setTimeout(() => toast.success("Logged in Successfully"), 100);
            navigate('/');
        } else if (status === 201) {
            toast.success("Check your Email");
            setLoader(false);
        } else if (status === 401) {
            toast.warning("Invalid Email and Password");
            setLoader(false);
        } else if (status === 301) {
            toast.warning("Please Wait.......", { autoClose: false });
            setLoader(false);
        } else {
            toast.error("Server Error");
            setLoader(false);
        }
    }

    async function fetchFavourites(data) {
        await axios({
            method: "POST",
            url: "https://loudbackendfavourites.onrender.com/getfavourites",
            data: data
        }).then(res => { setFavourites(res.data); console.log(res.data); notify(200) }).catch(err => { (err.response != undefined) ? notify(505) : notify(err.response.status) });
        setLoader(false);
    }

    async function loggingIn() {
        await axios({
            method: "POST",
            url: "http://localhost:8080/login",
            data: { email: email, password: password },
            withCredentials: true,
            timeout: 5000
        }).then(async res => {
            await setLogin(auth());
            if (res.status === 200 ) {
                fetchFavourites(login);
                notify(301);
            }
        }).catch(err => { (err.response === undefined) ? notify(505) : notify(err.response.status) });
        console.log(Cookie.get('auth'));
    }

    async function forgotPassword() {
        await axios({
            method: "POST",
            url: "https://loudbackendlogin.onrender.com/forgot",
            data: { email: email }
        }).then(res => { notify(res.status) }).catch(err => { (err.response.status !== undefined) ? notify(err.response.status) : notify(500) });
    }

    return (
        <div className="LoginPage">
            <form className="LoginContent" onSubmit={e => { e.preventDefault(); loggingIn() }}>
                <img src="logo.png" style={{ width: '100px', height: '35px' }} alt="logo" />
                <div>
                    <h2>Enter Email</h2>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter the Email" required />
                </div>
                <div>
                    <h2>Enter Password</h2>
                    <input type={(showPassword) ? "password" : "text"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <p onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>ShowPassword</p>
                    <p style={{ cursor: 'pointer' }} onClick={() => forgotPassword()}>forgot Password?</p>
                </div>
                <div>
                    <button type="submit" className="button" onClick={() => setLoader(true)}>Login&nbsp;<i className={(loader) ? "fa-solid fa-spinner loader" : "hide"}></i></button>
                    <button type="button" onClick={() => navigate('/signup')} className="button">SignUp</button>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default Login;
