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
import { AuthenticationProvider } from './services/useAuthentication';

function App({ history }: { history: BrowserHistory }) {
  return (
    <>
      <ThemeProvider theme={DefaultTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <AuthenticationProvider>
            {/*
// @ts-ignore */}
            <Router history={history}>
              <AppRoutes />
            </Router>
          </AuthenticationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
