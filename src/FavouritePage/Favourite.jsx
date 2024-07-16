import React, { useContext, useEffect,useState } from 'react';
import { Card } from '../SearchPage/Search';
import './Favourite.css';
import axios from 'axios'; 
import { songContext } from '../App';

const Favourite = () => {
  const { favourites, login, setFavourites, setSongs } = useContext(songContext);
  const[loader,setLoader]=useState(login!=null);
  const fetchFavourites = async () => {
    try {
      const response = await axios.post("https://loudbackendfavourites.onrender.com/getfavourites", {
        email: login.email
      });
      setFavourites(response.data);
      console.log("Favourites fetched successfully", response.data);
    } catch (err) {
      console.error("Server Error", err);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="favContent">
      <h1 className="favTitle">Favourite Songs</h1>
      {(favourites && favourites.length > 0) ? (
        favourites.map((e) => (
          <span key={e._id} onClick={() => setSongs(favourites)}>
            <Card song={e} />
          </span>
        ))
      ) : (
        (login)?<h1 className={loader ? "fa-solid fa-spinner loader" : "hide"} style={{width:'99vw',textAlign:'center',fontSize:'xx-large',color:'white'}}></h1>:<h1>No Songs Found</h1>
      )}
    </div>
  );
};

export default Favourite;
