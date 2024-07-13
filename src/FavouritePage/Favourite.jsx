import React, { useContext, useEffect } from 'react';
import { Card } from '../SearchPage/Search';
import './Favourite.css';
import axios from 'axios'; 
import { songContext } from '../App';

const Favourite = () => {
  const { favourites, setFavourites, setSongs,login } = useContext(songContext);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.post(
          "https://loudbackendfavourites.onrender.com/getfavourites",login
        );
        setFavourites(response.data);
        console.log("Favourites fetched successfully", response.data);
      } catch (err) {
        console.error(err.response ? err.response.data : "Server Error");
      }
    };

    fetchFavourites();
  }, [setFavourites]);

  return (
    <div className="favContent">
      <h1 className="favTitle">Favourite Songs</h1>
      {favourites.length > 0 ? (
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
