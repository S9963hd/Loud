import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import axios from 'axios';
import { songContext } from '../App';
const Login = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {favourites, setFavourites,setLogin,login } = useContext(songContext);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    async function notify(status) {
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
        } else if (status === 302) {
            toast.warning("Technical Error at frontend please try again");
            setLoader(false);
        } else {
            toast.error("Server Error/TimeOut/Initializing Please wait 1 min..");
            setLoader(false);
        }
    }

    async function fetchFavourites(data) {
        await axios({
            method: "POST",
            url: "https://loudbackendfavourites.onrender.com/getfavourites",
            data: { email: data },
            timeout:9000
        }).then(res => {
            setFavourites(res.data);
            console.log(res.data);
            notify(200);
        }).catch(err => {
            if (err.response !== undefined) {
                notify(err.response.status);
            } else {
                notify(505);
            }
        });
        setLoader(false);
    }

    async function loggingIn() {
        await axios({
            method: "POST",
            url: "https://loudbackendlogin.onrender.com/login",
            data: { email: email, password: password },
            timeout:9000
        }).then( res => {
            localStorage.setItem('auth', JSON.stringify({ value: res.data, expiry: new Date().getTime() + (60 * 1000 + 30) }));
            if (localStorage.getItem('auth')!=null) {
                setLogin(JSON.parse(localStorage.getItem('auth')).value);
                notify(200);
            } else {
                notify(302);
            }
        }).catch(err => {
            if (err.response === undefined) {
                notify(505);
            } else {
                notify(err.response.status);
            }
        });
    }

    async function forgotPassword() {
        await axios({
            method: "POST",
            url: "https://loudbackendlogin.onrender.com/forgot",
            data: { email: email }
        }).then(res => {
            notify(res.status);
        }).catch(err => {
            if (err.response !== undefined) {
                notify(err.response.status);
            } else {
                notify(500);
            }
        });
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
                    <input type={showPassword ? "password" : "text"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <p onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>Show Password</p>
                    <p style={{ cursor: 'pointer' }} onClick={forgotPassword}>Forgot Password?</p>
                </div>
                <div>
                    <button type="submit" className="button" onClick={() => setLoader(true)}>Login&nbsp;<i className={loader ? "fa-solid fa-spinner loader" : "hide"}></i></button>
                    <button type="button" onClick={() => navigate('/signup')} className="button">SignUp</button>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default Login;
