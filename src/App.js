import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';
import MainNavigation from './components/navigation/MainNavigation';
import { Component } from 'react';

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      /* this is one way to make a one page react app */
      <BrowserRouter>
        {/* user <React.Fragment /> here in tutorial */}
        {/* you have to intialize the context by setting prop value= 
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
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Redirect from="/auth" to="events" exact />}
              <Route path="/events" component={EventsPage} />
              {this.state.token && (
                <Route path="/bookings" component={BookingsPage} />
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
