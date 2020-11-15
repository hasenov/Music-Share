import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
