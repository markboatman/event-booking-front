// This app is running on heroku
// https://event-booking-front-new.web.app
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import AuthContext from './components/context/auth-context';
import ProtectedRouteParent from './components/ProtectedRouteParent';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';
import NoMatch from './pages/NoMatch';
import CreateEventPage from './pages/CreateEventPage';
// import MainNavigation from './components/navigation/MainNavigation';
import TopNav from './components/navigation/TopNav';

class App extends Component {
  // Top level app component prersists login state
  // authUser not null, user logged in, valid 'suedo session'
  state = {
    // get the eventAppUser session from window.sessionStorage
    // This is similar to localStorage but is destroyed when page
    // or the tab is closed.
    authUser: JSON.parse(sessionStorage.getItem('eventAppUser')),
  };

  // class arrow method that will be put on the context
  // passed and to children (AuthPage)
  login = (token, userId, tokenExpiration, email) => {
    // passing params like this so I can see the structure of authUser
    const authUser = {
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
      email: email,
    };
    // console.log(
    //   'return of JSON.parse(sessionStorage.getItem(eventAppUser)) is: ',
    //   JSON.parse(sessionStorage.getItem('eventAppUser'))
    // );
    console.log('authUser in App.login is: ', authUser);
    this.setState({
      authUser: authUser,
    });
    sessionStorage.setItem('eventAppUser', JSON.stringify(authUser));
    // TODO store the state to browser
    console.log('In App.js login, email is: ', this.state.authUser.email);
  };

  // TopNav will call this to put the frontend in a logged out state
  // TopNav also calls the backend to log out the user
  logout = () => {
    // TODO add logout call to the backend here
    this.setState({
      authUser: null,
    });
    sessionStorage.removeItem('eventAppUser');
    // put user in logged out state in the backend
  };

  componentWillUnmount() {
    this.setState({
      authUser: null,
    });
    // if you go to another site in the same tab
    // you will get logged out
    sessionStorage.removeItem('eventAppUser');
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          authUser: this.state.authUser,
          login: this.login,
          logout: this.logout,
        }}
      >
        {/* this is the menu bar */}
        <TopNav />
        <main className="main-content">
          {' '}
          {/* <main> is optional */}
          <Routes>
            {/* need to use exact on "/" */}
            <Route index element={<EventsPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route
              path="bookings"
              element={
                <ProtectedRouteParent>
                  <BookingsPage />
                </ProtectedRouteParent>
              }
            />
            <Route
              path="create-event"
              element={
                <ProtectedRouteParent>
                  <CreateEventPage />
                </ProtectedRouteParent>
              }
            />
            {/* This matches /(something) */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </main>
      </AuthContext.Provider>
    );
  }
}

export default App;
