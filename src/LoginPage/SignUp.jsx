import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import axios from 'axios';
const SignUp = () => {
    const[showPassword,setShowPassword]=useState(true);
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
     const[loader,setLoader]=useState(false);
    const navigate=useNavigate();
    // tostify-Notify
async function notify(status){
    
    if(status==200){
        setTimeout(function() {
            toast.success("Sign Up in Successfully");
        }, 100);
        setLoader(false);
        navigate('/login');
    }
    else if(status==403){
        toast.warning("Data Already present");
        setLoader(false);
    }
    else{
        toast.error("Server Error/Timeout Please Try Again");
        setLoader(false);
    }

}
    function signingUp(){
        axios({
            method:"POST",
            url:"https://loudbackendlogin.onrender.com/signup",
            data:{email:email,password:password},
        }).then(res=>{notify(res.status)}).catch(err=>{(err.response==undefined)?notify(505):notify(err.response.status)});
    }
  return (
    <div className="LoginPage">
        <form className="LoginContent" onSubmit={e=>{e.preventDefault();signingUp()}}>
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
                <p style={{cursor:'pointer'}}>forgot Password?</p>
            </div>
            <div>
                <button type="submit" className="button" onClick={()=>setLoader(true)}</button>>SignUp&nbsp;<i className={(loader)?"fa-solid fa-spinner loader":"hide"}></i></button>
            </div>
            <ToastContainer />
        </form>
    </div>
  )
}

export default SignUp;
