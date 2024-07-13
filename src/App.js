import './App.css';
import { useState, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// MainPage
import Main from './MainPage/Main';
// Search songs
import Search from './SearchPage/Search';
// Favourite Songs
import Favourite from './FavouritePage/Favourite';
// Login Page
import Login from './LoginPage/Login';
import SignUp from './LoginPage/SignUp';
// Song Context
export const songContext = createContext();

function App() {
  // songs
  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(null);
  const [playStack, setPlayStack] = useState({});
  const [login,setLogin]=useState(null);
  const[favourites,setFavourites]=useState([]);
  const[songsFlag,setSongsFlag]=useState([]);
  // next Song
  async function next() {
    if (index < songs.length - 1) {
      setIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        setPlayStack(songs[newIndex]);
        return newIndex;
      });
    }
  }

  // previous Song
  async function prev() {
    if (index > 0) {
      setIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        setPlayStack(songs[newIndex]);
        return newIndex;
      });
    }
  }

  return (
    <div>
      <songContext.Provider value={{ songs, setSongs, index, setIndex,playStack, setPlayStack,login,setLogin,favourites,setFavourites,songsFlag,setSongsFlag }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/favourite" element={(login)?<Favourite />:<Model />}/>
        </Routes>
      </songContext.Provider>
      {songs.length > 0 && (
        <div className="AudioSection" style={{ position: 'fixed', bottom: '0px' ,display:'flex'}}>
          <img src={playStack.imageUrl || ""} alt="Song Cover" />
          <AudioPlayer
            className='AudioPlayer'
            autoPlay
            src={playStack.songUrl}
            onEnded={next}
            onClickNext={next}
            onClickPrevious={prev}
            onPlay={(e) => console.log("onPlay")}
            showSkipControls
            hasDefaultKeyBindings={true}
          />
        </div>
      )}
    </div>
  );
}
function Model(){
  const navigate=useNavigate()
  return(
    <div  className="Model" style={{boxShadow:'0px 0px 5px #DC3F55'}}>
      <div >
          <h1>Login First</h1>
          <button onClick={()=>navigate('/')} className="button">Ok</button>
      </div>
    </div>
  )
}
export default App;
