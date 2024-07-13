import React,{useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import { songContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Main.css';
import Cookie from 'js-cookie';
const Main = () => {
const[shownav,setShowNav]=useState(false);
  return (
    <div>
      <Navigation shownav={shownav} setShowNav={setShowNav}/>
      <MainSideBar shownav={shownav}/>
      {/* <Carousel trends={{name:"ksdjjndnkjsdn"}}/> */}
      <ToastContainer />
    </div>
  )
}
function Navigation({shownav,setShowNav}){
    const navigate=useNavigate();
    const{login,setLogin,setSongs,setFavourites}=useContext(songContext);
    return (
        <nav className="navigation">
            <div className="navigation1">
            <i className="fa-solid fa-bars icon" onClick={()=>setShowNav(!shownav)}></i>
                <img src="logo.png" alt="Logo" className="logo"/>
                <i className="fa-solid fa-magnifying-glass icon"  onClick={()=>navigate('/search')}></i>
            </div>
           {(login==null)?<button className="button" onClick={()=>navigate('/login')}>Login</button>:<button className="button" onClick={()=>{setLogin(null);setSongs([]);setFavourites(null);Cookie.remove("auth")}}>Logout</button>}
        </nav>
    )
}
function MainSideBar({shownav}){
    const navigate=useNavigate();
    return(
        <div className={(shownav)?"sideBar":"sideBarHide"}>
            <h2 onClick={()=>navigate('/favourite')}><i className="fa-solid fa-heart" ></i>&nbsp;Favourite Songs</h2>
        </div>
    )
}
function Carousel({trends}){
    const{playStack}=useContext(songContext)
    return (
        <div style={{display:'flex',justifyContent:'center'}}>
            <div className="carousel" style={{}}>
                <div style={{position:'relative'}}>
                    <img src={playStack.imageUrl}  alt="Caraousel" title={`Carousel ${trends.id}`}/>
                </div>
            </div>
        </div>
    )
}
export default Main;
