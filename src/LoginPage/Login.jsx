import React,{useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import axios from 'axios';
import { songContext } from '../App';



const Login = () => {
    const[showPassword,setShowPassword]=useState(true);
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const{login,setLogin,favourites,setFavourites}=useContext(songContext);
    const[loader,setLoader]=useState(false);
    const navigate=useNavigate();

    // tostify-Notify
async function notify(status){
    
    if(status==200){
        await setTimeout(()=>toast.success("Logged in Successfully"),100);
        navigate('/');
    }
    else if(status==201){
        toast.success("Check your Email");
    }
    else if(status==401){
        toast.warning("Invalid Email and Password");
    }
    else if(status==301){
        toast.warning("Please Wait.......");
    }
    else{
        toast.error("Server Error");
    }

}
    //fetch favourites when login
    async function fetchFavourites(data){
        await axios({
            method:"POST",
            url:"https://loudbackendfavourites.onrender.com/getfavourites",
            data:data
        }).then(res=>{setFavourites(res.data);console.log(res.data);notify(200)}).catch(err=>{(err.response!=undefined)?notify(505):notify(err.response.status)});
                setLoader(false);
    } 
    async function loggingIn(){
        await axios({
            method:"POST",
            url:"https://loudbackendlogin.onrender.com/login",
            data:{email:email,password:password}
        }).then(res=>{setLogin(res.data);console.log(res.data);fetchFavourites(res.data);}).catch(err=>{(err.response==undefined)?notify(505):notify(err.response.status)});
        notify(301);
    }
    async function forgotPassword(){
        await axios({
            method:"POST",
            url:"https://loudbackendlogin.onrender.com/forgot",
            data:{email:email}
        }).then(res=>{notify(res.status)}).catch(err=>{(err.response.status!=undefined)?notify(err.response.status):notify(500)});
    }
  return (
    <div className="LoginPage">
        <form className="LoginContent" onSubmit={e=>{e.preventDefault();loggingIn()}}>
            <img src="logo.png" style={{width:'100px',height:'35px'}}/>
            <div>
                <h2>Enter Email</h2>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter the Email" required/>
            </div>
            <div>
                <h2>Enter Password</h2>
                <input type={(showPassword)?"password":"text"} value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div>
                <p onClick={()=>setShowPassword(!showPassword)} style={{cursor:'pointer'}}>ShowPassword</p>
                <p style={{cursor:'pointer'}} onClick={()=>forgotPassword()}>forgot Password?</p>
            </div>
            <div>
                <button type="submit" className="button" onClick={()=>setLoader(true)}>Login&nbsp;<i className={(loader)?"fa-solid fa-spinner loader":"hide"}></i></button>
                <button type="button" onClick={()=>navigate('/signup')} className="button">SignUp</button>
            </div>
            <ToastContainer />
        </form>
    </div>
  )
}

export default Login
