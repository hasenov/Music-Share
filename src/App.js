import React from 'react';
import Navbar from './components/Navbar';
import AddSong from './components/AddSong';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import { Grid, useMediaQuery } from '@material-ui/core';
import './App.css';
import songReducer from './reducer';

export const SongContext = React.createContext({
  song: {
    id: "adc1333d-a4ca-4a33-ac21-f0ee730b90b8",
    title: "Madcon",
    artist: "Beggin",
    thumbnail: "http://img.youtube.com/vi/zrFI2gJSuwA/0.jpg",
    url: "https://www.youtube.com/watch?v=zrFI2gJSuwA&ab_channel=oficialmadcon",
    duration: 224
  },
  isPlaying: false
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Navbar />
      <Grid container spacing={3} style={{marginTop: '80px'}}>
        <Grid item xs={12} md={7}>
          <AddSong />
          <SongList />
        </Grid>
        <Grid 
          style={
          greaterThanMd ?
            {
              position: 'fixed',
              width: '100%',
              right: '17px',
              top: '70px'
            } : {
              position: 'fixed',
              width: '100%',
              left: '0',
              bottom: '0'
            }
          } 
          item 
          xs={12} 
          md={5}
        >
          <SongPlayer />
          
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
