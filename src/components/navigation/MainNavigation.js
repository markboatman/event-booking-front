import React from 'react';
import { NavLink } from 'react-router-dom';
// my imports
import AuthContext from '../context/auth-context';
import './MainNavigation.css';

// this is a functional component, we do not
// need to have a state
/* 
  set up the imported AuthContext element as a parent to deliver
    AuthContext state and methods to decendants
*/
const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          {/* react used className instead of class */}
          <div className="main-navigation__logo">
            <h1>Organize and Attend Events</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              <li>
                <NavLink to="/events">All Events</NavLink>
              </li>

              {/* NavLink is a react component */}
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}

              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/create-event">Create Event</NavLink>
                  </li>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                  <li>
                    <strong>User: {context.email.split('@')[0]}</strong>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
