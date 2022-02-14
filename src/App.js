// you are at video 17@19:45
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Redirect, Routes } from 'react-router-dom';
import AuthContext from './components/context/auth-context';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import MainNavigation from './components/navigation/MainNavigation';
import { Component } from 'react';

class App extends Component {
  state = {
    authUser: JSON.parse(sessionStorage.getItem('eventUser')),
  };

  // TODO add username
  login = (token, userId, tokenExpiration, email) => {
    // passing params like this so I can see the structure of authUser
    const authUser = {
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
      email: email,
    };
    // console.log(
    //   'return of JSON.parse(sessionStorage.getItem(eventUser)) is: ',
    //   JSON.parse(sessionStorage.getItem('eventUser'))
    // );
    console.log('authUser in App.login is: ', authUser);
    this.setState({
      authUser: authUser,
    });
    sessionStorage.setItem('eventUser', JSON.stringify(authUser));
    // TODO store the state to browser
    console.log('In App.js login, email is: ', this.state.authUser.email);
  };

  logout = () => {
    this.setState({
      authUser: null,
    });
    sessionStorage.removeItem('eventUser');
  };

  componentWillUnmount() {
    this.setState({
      authUser: null,
    });
    // if you go to another site in the same tab
    // you will get logged out
    sessionStorage.removeItem('eventUser');
  }

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
            authUser: this.state.authUser,
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
            <Routes>
              {/* need to use exact on "/" */}
              {!this.state.authUser && <Redirect from="/" to="/events" exact />}
              {!this.state.authUser && (
                // this should be from="/bookings"
                <Redirect from="bookings" to="/auth" exact />
              )}
              {!this.state.authUser && (
                <Route path="/auth" component={AuthPage} />
              )}
              {this.state.authUser && (
                <Redirect from="/auth" to="/events" exact />
              )}
              <Route path="/events" component={EventsPage} />
              {this.state.authUser && (
                <Route path="/bookings" component={BookingsPage} />
              )}
              {this.state.authUser && (
                <Route path="/create-event" component={CreateEventPage} />
              )}
              {!this.state.authUser && <Redirect to="/auth" exact />}
            </Routes>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
//                   <Route path="/create-event" component={CreateEventPage} />
