import React,{useState,useContext} from 'react'
import './Search.css';
import axios from 'axios';
import {songContext} from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// searchBox
const Search = () => {

  const [songName,setSongName]=useState('');
  const {songs,setSongs,setIndex,songsFlag,setSongsFlag}=useContext(songContext);
  const[limit,setLimit]=useState(10);
  const[loading,setLoading]=useState(false);

        // tostify-Notify
        function notify(status){
    
          if(status==200){
              toast.success("Added in Successfully",{autoClose:1000});
          }
          else if(status==401){
              toast.warning("Songs Not Detected try Different",{autoClose:1000});
              setLoading(false);
          }
          else if(status==404){
            toast.warning("Please Login First",{autoClose:1000});
          }
          else{
              toast.error("Server Error try again after 1 min/Initial",{autoClose:1000});
              setLoading(false);
          }
        
        }

        // API call
    async function retriveSongs(songName,limit){
      await axios({
        method:"GET",
        url:'https://loudbackendsong.onrender.com/search',
        params:{query:songName,limit:limit},
        timeout:6000
      }).then(res=>{console.log("Fetching.....");setLoading(false);(res.data)?setSongsFlag([...res.data]):notify(res.status)}).catch(err=>{(err.response==undefined)?notify(500):notify(err.response.status)});
    }

  return (
    <div >
      <form style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10px'}} onSubmit={async(e)=>{e.preventDefault();setIndex(null);setLoading(true);retriveSongs(songName,limit)}}>
      <i class={(loading)?"fa-solid fa-spinner loader":"hide"} style={{color:'white'}}>&nbsp;</i><input type="text" placeholder="Search Songs" className="searching" onChange={(e)=>setSongName(e.target.value)}/>
          <button type="submit" className="fa-solid fa-magnifying-glass searchButton" style={{marginLeft:'10px',marginRight:'10px',color:'white',cursor:'pointer'}} onClick={()=>setLimit(10)}></button>
      </form>
        {/* Card */}
        {console.log(limit)}
        {console.log(songs)}
        {songsFlag.map(e=>(<Card song={e} songsFlag={songsFlag}/>))}
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',color:'white',cursor:'pointer'}}>
          {(songsFlag.length && songs.length<40)?<h3 onClick={()=>{setLimit(limit+10);retriveSongs(songName,limit);setLoading(true)}}>Show More&nbsp;<i class={(loading)?"fa-solid fa-spinner loader":"hide"}></i></h3>:""}
        </div>
        <ToastContainer />
    </div>
  )
}
// Card
export function Card({song,songsFlag}){
    const{setFavourites,favourites,setIndex,setSongs,setPlayStack,login}=useContext(songContext);
        async function settingFavourites(song){
          console.log("Invoked")
          await axios({
            method:"POST",
            url:"https://loudbackendfavourites.onrender.com/setfavourites",
            data:{email:login.email,songs:song}
          }).then(res=>{console.log("Done");setFavourites(res.data)}).catch(err=>{console.log("Server Error");notify(err.response.status)});
        }

        async function removeFavourites(song){
          console.log("Invoked")
          await axios({
            method:"POST",
            url:"https://loudbackendfavourites.onrender.com/deletefavourites",
            data:{email:login.email,songs:song}
          }).then(res=>{console.log(res.data);setFavourites(res.data);}).catch(err=>{console.log("Server Error");notify(err.response.status)});
        }
        // tostify-Notify
      async function notify(status){
    
        if(status==200){
            toast.success("Added in Successfully",{autoClose:1000});
        }
        else if(status==404){
          toast.warning("Please Login First",{autoClose:1000})
        }
        else{
            toast.error("Server Error",{autoClose:1000});
        }
      
      }

    return (
        <div className="card">
          <img src={song.imageUrl} alt="img" className="cardImg"/>
          <div className="cardContent">
            <h3>{song.name}</h3>
            <h5>{song.author}</h5>
            <p>{song.duration}</p>
            <div style={{display:'flex',columnGap:'40px'}}>
            <i className="fa-solid fa-play" onClick={()=>{setIndex(song.id);setSongs(songsFlag);setPlayStack(song);}}></i>
            <i className="fa-solid fa-heart" style={favourites.some(favSong => favSong.name === song.name) ? { color: 'red',textShadow:'0px 0px 5px red' } : {}}  onClick={()=>{(login)?(!favourites.some(favSong => favSong.name === song.name))?settingFavourites(song):removeFavourites(song):notify(404)}}></i>
            </div>
          </div>
          <ToastContainer />
        </div>
    )
}
export default Search;