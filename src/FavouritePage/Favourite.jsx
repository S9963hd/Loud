import React, { useContext } from 'react'
import {Card} from '../SearchPage/Search';
import './Favourite.css';
import { songContext } from '../App';
const Favourite = () => {
    const{favourites,setSongs}=useContext(songContext);
  return (
    <div className="favContent">
      {console.log("Data ",favourites)}
      <h1 className="favTitle">Favourite Songs</h1>
      {(favourites.length!=0)?favourites.map(e=>(<span onClick={()=>setSongs(favourites)}><Card song={e}/></span>)):<h1>No Songs Found</h1>}
    </div>
  )
}

export default Favourite;