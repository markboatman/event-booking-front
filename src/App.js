// you are at video 17@19:45
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
import MainNavigation from './components/navigation/MainNavigation';

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
