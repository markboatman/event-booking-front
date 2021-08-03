import React from 'react';
import { NavLink } from 'react-router-dom';
// my imports
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

// this is a functional component, we do not
// need to have a state
const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          {/* react used className instead of class */}
          <div className="main-navigation__logo">
            <h1>Events are Us</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {/* NavLink is a react component */}
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
