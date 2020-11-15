import React, { Fragment, useContext, useState, useRef, useEffect } from 'react'
import { 
  CardContent,
  Card,
  Typography,
  IconButton,
  Slider,
  CardMedia,
  makeStyles,
  useMediaQuery
} from '@material-ui/core'
import {
  SkipPrevious,
  PlayArrow,
  SkipNext,
  Pause
} from '@material-ui/icons'
import { SongContext } from '../App';
import { useQuery } from '@apollo/client';
import { GET_QUEUED_SONGS } from '../graphql/queries';
import QueuedSongList from './QueuedSongList';
import ReactPlayer from 'react-player';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 15px',
  },
  content: {
    flex: '1 0 auto'
  },
  thumbnail: {
    width: 150
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    width: 38,
    height: 38
  }
}));

const SongPlayer = () => {

  const { data } = useQuery(GET_QUEUED_SONGS);
  const reactPlayerRef = useRef();
  const {state, dispatch} = useContext(SongContext);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [positionInQueue, setPositionInQueue] = useState(0);
  const classes = useStyles();

  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    const songIndex = data.queuedSongs.findIndex((song) => {
      return song.id === state.song.id
    });
    setPositionInQueue(songIndex);
  }, [data.queuedSongs, state.song.id]);

  useEffect(() => {
    const nextSong = data.queuedSongs[positionInQueue + 1];
    if(played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queuedSongs, played, dispatch, positionInQueue]);

  const handleTogglePlay = () => {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  const handleSeekMouseDown = () => {
    setSeeking(true);
  }
  const handleSeekMouseUp = () => {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  const handleProgressChange = (e, newValue) => {
    setPlayed(newValue);
  }

  const formatDuration = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
  
  const handlePlayNextSong = () => {
    const nextSong = data.queuedSongs[positionInQueue + 1];
    if(nextSong) {
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }

  const handlePlayPrevSong = () => {
    const prevSong = data.queuedSongs[positionInQueue - 1];
    if(prevSong) {
      dispatch({ type: "SET_SONG", payload: { song: prevSong } });
    }
  }

  return (
    <Fragment>
      <Card className={classes.container} variant="outlined">
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
            {state.song.artist}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton onClick={handlePlayPrevSong}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {state.isPlaying ? (
                <Pause className={classes.playIcon} />
              ) : (
                <PlayArrow className={classes.playIcon} />
              )}
            </IconButton>
            <IconButton onClick={handlePlayNextSong}>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}
            </Typography>
          </div>
          <Slider 
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={played}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            onChange={handleProgressChange}
          />
        </div>
        <ReactPlayer
        ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if(!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }} 
          url={state.song.url} 
          playing={state.isPlaying} 
          hidden 
        />
        <CardMedia
          className={classes.thumbnail }
          image={state.song.thumbnail}
        />
      </Card>
      {
        greaterThanMd && (
          <QueuedSongList queuedSongs={data.queuedSongs} />
        )
      }
    </Fragment>
  )
}

export default SongPlayer
