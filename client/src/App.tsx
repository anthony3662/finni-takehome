import React from 'react';
import logo from './logo.svg';
import './App.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { BrowserHistory } from 'history';
import { ThemeProvider } from '@mui/material';
import { DefaultTheme } from './theme/theme';

function App({ history }: { history: BrowserHistory }) {
  return (
    <>
      <ThemeProvider theme={DefaultTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {/*
// @ts-ignore */}
          <Router history={history}>
            <AppRoutes />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
