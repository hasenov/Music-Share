import React from 'react'
import { Typography, Avatar, IconButton, makeStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { useMutation } from '@apollo/client';
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const QueuedSongList = ({ queuedSongs }) => {
  console.log({queuedSongs});
  return (
    <div style={{margin: '10px 0'}}>
      <Typography color="textSecondary" variant="button">
        Мои аудиозаписи ({queuedSongs.length})
      </Typography>
      {
        queuedSongs.map((song, i) => (
          <QueuedSong key={i} song={song} />
        ))
      }
    </div>
  )
}

const useStyles = makeStyles({
  avatar: {
    width: 44,
    height: 44,
    marginRight: 15
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },
  songInfoContainer: {
    flex: '1 1 auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
});

function QueuedSong({song}) {
  const classes = useStyles();
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: data => {
      localStorage.setItem('queuedSongs', JSON.stringify(data.addOrRemoveFromQueue));
    }
  });
  const { title, artist, thumbnail } = song; 

  const handleAddOrRemoveFromQueue = () => {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: 'Song' }
      }
    });
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar} src={thumbnail} alt="Song thumbnail" />
      <div className={classes.songInfoContainer}>
        <Typography className={classes.text} variant="subtitle2">
          {title}
        </Typography>
        <Typography className={classes.text} color="textSecondary" variant="body2">
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList
