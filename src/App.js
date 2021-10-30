// you are at video 17@19:45
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './components/context/auth-context';
// import AuthPage from './pages/AuthPage';
// import BookingsPage from './pages/BookingsPage';
// import EventsPage from './pages/EventsPage';
import MainNavigation from './components/navigation/MainNavigation';
// wrap lazy loaded <Route>(s) in <Suspense>
import React, { Component, Suspense } from 'react';
// for code splitting, for each route you want to load lazily
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const BookingsPage = React.lazy(() => import('./pages/BookingsPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));

class App extends Component {
  state = {
    token: null,
    userId: null,
    tokenExpiration: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
    });
  };

  logout = () => {
    this.setState({ token: null, userId: null, tokenExpiration: null });
  };

  render() {
    return (
      /* this is one way to make a one page react app */
      <BrowserRouter>
        {/* user <React.Fragment /> here in tutorial */}
        {/* 
          You have to intialize the context by setting value={ ... }
          Context is defined and available to all decendants of the
          element AuthContext.
        */}
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          {/* this is the menu bar */}
          <MainNavigation />
          <main className="main-content">
            {' '}
            {/* <main> is optional */}
            {/* This is the main-content section */}
            {/* use Switch to jump directly to url match
            Don't go through the sequence
          */}
            <Switch>
              {/* need to use exact on "/ nothing"*/}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {!this.state.token && (
                <Redirect from="bookings" to="/auth" exact />
              )}
              {!this.state.token && (
                <Suspense
                  fallback={
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                  }
                >
                  <Route path="/auth" component={AuthPage} />
                </Suspense>
              )}
              {this.state.token && <Redirect from="/auth" to="events" exact />}
              <Suspense fallback={<div>Loading...</div>}>
                <Route path="/events" component={EventsPage} />
              </Suspense>
              {this.state.token && (
                <Suspense fallback={<div>Loading...</div>}>
                  <Route path="/bookings" component={BookingsPage} />
                </Suspense>
              )}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
