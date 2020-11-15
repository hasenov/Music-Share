import { 
  CardContent, 
  CircularProgress, 
  IconButton,
  Card,
  CardMedia,
  Typography,
  CardActions,
  makeStyles
} from '@material-ui/core';
import { 
  PlayArrow,
  Save,
  Pause
} from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useSubscription, useMutation } from '@apollo/client';
import { GET_SONGS } from '../graphql/subscriptions';
import { SongContext } from '../App';
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const SongList = () => {
  const { loading, error, data } = useSubscription(GET_SONGS);

  if(loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50
      }}>
        <CircularProgress />
      </div>
    )
  }

  if(error) {
    return (
      <div>Error</div>
    );
  }

  return (
    <div>
      {data.music.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(3)
  },
  songInfoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  songInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  thumbnail: {
    width: 140,
    height: 140
  }
}));

const Song = ({song}) => {
  const classes = useStyles();
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: data => {
      localStorage.setItem('queuedSongs', JSON.stringify(data.addOrRemoveFromQueue));
    }
  });
  const { state, dispatch } = useContext(SongContext);
  const [currentSongPlaying, setCurrentSongPlaying] = useState(false);

  const {title, artist, thumbnail} = song;

  useEffect(() => {
    const isSongPlaying = state.isPlaying && song.id === state.song.id;

    setCurrentSongPlaying(isSongPlaying);
  }, [song.id, state.song.id, state.isPlaying]);

  const handleTogglePlay = () => {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  const handleAddOrRemoveFromQueue = () => {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: 'Song' }
      }
    });
  }

  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia className={classes.thumbnail} image={thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography 
              gutterBottom 
              variant="h5" 
              component="h2"
            >
              {title}
            </Typography>
            <Typography
              variant="body1" 
              component="p"
              color="textSecondary"
            >
              {artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton size="small" color="primary" onClick={handleTogglePlay}>
            {currentSongPlaying ? (
                <Pause />
              ) : (
                <PlayArrow />
              )}
            </IconButton>
            <IconButton size="small" color="secondary" onClick={handleAddOrRemoveFromQueue}>
              <Save />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  )
}

export default SongList
