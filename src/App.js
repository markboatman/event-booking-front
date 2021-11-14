// you are at video 17@19:45
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './components/context/auth-context';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import MainNavigation from './components/navigation/MainNavigation';
import { Component } from 'react';

class App extends Component {
  state = {
    // TODO add username
    token: null,
    userId: null,
    tokenExpiration: null,
    email: null,
  };

  // TODO add username
  login = (token, userId, tokenExpiration, email) => {
    this.setState({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
      email: email,
    });
    console.log('In App.js login, email is: ', this.state.email);
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
      tokenExpiration: null,
      email: null,
    });
  };

  render() {
    return (
      /* this is one way to make a one page react app */
      <BrowserRouter>
        {/* user <React.Fragment /> here in tutorial */}
        {/* 
          You have to intialize the react global context by setting value={ ... }
          Context is defined and available to all decendants of the wrapper
          element AuthContext.
        */}
        <AuthContext.Provider
          value={{
            // don't think this line gets us anything
            token: this.state.token,
            // don't think this line gets us anything
            userId: this.state.userId,
            email: this.state.email,
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
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              <Route path="/events" component={EventsPage} />
              {this.state.token && (
                <Route path="/bookings" component={BookingsPage} />
              )}
              {this.state.token && (
                <Route path="/create-event" component={CreateEventPage} />
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
//                   <Route path="/create-event" component={CreateEventPage} />
