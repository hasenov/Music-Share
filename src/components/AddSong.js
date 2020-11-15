import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Button, 
  DialogActions,
  Dialog, 
  DialogTitle, 
  DialogContent,
  makeStyles
} from '@material-ui/core';
import { Link, AddBoxOutlined } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import SoundcloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';

import { useMutation } from '@apollo/client';
import { ADD_SONG } from '../graphql/mutations';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  urlInput: {
    margin: theme.spacing(1)
  },
  addSongButton: {
    margin: theme.spacing(1)
  },
  dialog: {
    textAlign: 'center',
  },
  thumbnail: {
    width: '90%'
  }
}));

const DEFAULT_SONG = {
  duration: 0,
  title: '',
  artist: '',
  thumbnail: ''
}

const AddSong = () => {

  const classes = useStyles();
  const [url, setUrl] = useState('');
  const [playable, setPlayable] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [song, setSong] = useState(DEFAULT_SONG);

  const [addSong, { error }] = useMutation(ADD_SONG);

  useEffect(() => {
    setPlayable(SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url));
  }, [url]);

  const handleCloseDialog = () => {
    setDialog(false);
  }

  const handleAddSong = async () => {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        }
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl('');
    } catch (err) {
      console.dir(err);
    }
  }

  const handleEditSong = async ({ player }) => {
    const nestedPlayer = player.player.player;
    let songData;
    if(nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if(nestedPlayer.getCurrentSound) {
      songData = await getSoundCloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  const getYoutubeInfo = (player) => {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail
    }
  }

  const getSoundCloudInfo = (player) => {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if(songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumnnail: songData.artwork_url.replace('-large', '-t500x500')
          });
        }
      });
    });
  }

  const handleSongChange = (e) => {
    setSong({
      ...song,
      [e.target.name]: e.target.value
    });
  }

  const handleError = (field) => {
    return error?.graphQLErrors[0]?.extensions?.path?.includes(field);
  }

  const {thumbnail, title, artist} = song;

  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Редактировать музыку</DialogTitle>
        <DialogContent>
          <img className={classes.thumbnail} src={thumbnail} alt={title} />
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={title}
            onChange={handleSongChange}
            error={handleError('title')}
            helperText={handleError('title') && 'Fill out the field'}
          />
          <TextField
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
            value={artist}
            onChange={handleSongChange}
            error={handleError('artist')}
            helperText={handleError('tiartisttle') && 'Fill out the field'}
          />
          <TextField
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            value={thumbnail}
            onChange={handleSongChange}
            error={handleError('thumbnail')}
            helperText={handleError('thumbnail') && 'Fill out the field'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Отмена</Button>
          <Button onClick={handleAddSong} variant="outlined" color="primary">Добавить музыку</Button>
        </DialogActions>
      </Dialog>
      <TextField
        onChange={(e) => setUrl(e.target.value)}
        value={url}
        className={classes.urlInput}
        placeholder="Добавьте URL-адрес Youtube или Soundcloud"
        fullWidth
        margin="normal"
        type="url"
        inputProps={{
          startAdornment: (
            <InputAdornment>
              <Link />
            </InputAdornment>
          )
        }}
      />

      <Button
        className={classes.addSongButton}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
        onClick={() => setDialog(true)}
        disabled={!playable}
      >
        Добавить
      </Button>
      <ReactPlayer 
        url={url} 
        hidden
        onReady={handleEditSong}
      />
    </div>
  )
}

export default AddSong;
