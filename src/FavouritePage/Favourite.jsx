import React, { useContext, useEffect } from 'react';
import { Card } from '../SearchPage/Search';
import './Favourite.css';
import axios from 'axios'; 
import { songContext } from '../App';
import {auth} from '../LoginPage/Login';
const Favourite = () => {
  const { favourites, setFavourites, setSongs,login } = useContext(songContext);
// setInterval(()=>fetchFavourites(),2000)
  useEffect(async() => {
    console.log(JSON.parse(localStorage.getItem('auth')).value.email);
    const fetchFavourites = async () => {
        await axios({
          method:"POST",
          url:"https://loudbackendfavourites.onrender.com/getfavourites",
          data:{email:login.email}
        }).then(res=>{console.log(favourites);setFavourites(res.data)}).catch(err=>{console.log(err,"Server Error")})
        console.log("Favourites fetched successfully", favourites)
    };
    console.log("Done",favourites);
  }, []);

  return (
    <div className="favContent">
      <h1>{login.email}</h1>
      <h1 className="favTitle">Favourite Songs</h1>
      {(favourites.length > 0 && favourites!=null) ? (
        favourites.map((e) => (
          <span key={e._id} onClick={() => setSongs(favourites)}>
            <Card song={e} />
          </span>
        ))
      ) : (
        <h1>No Songs Found</h1>
      )}
    </div>
  );
};

export default Favourite;
