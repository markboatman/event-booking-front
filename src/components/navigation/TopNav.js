import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import './TopNav.css';

const TopNav = (props) => {
  const appendClassToElement = (id, origClass, appendClass) => {
    let elem = document.getElementById(id);
    if (elem.className === origClass) {
      elem.className += ` ${appendClass}`;
    } else {
      elem.className = origClass;
    }
  };

  // function for the hamburger to/from
  // TODO change name to changeHamIcon
  const toggleClassInList = (elem, className) => {
    elem.classList.toggle(className);
  };

  // expand or collapse mobile menu
  // call this onmouseup for menu items when in mobile view
  const toggleMobileMenuDisplay = () => {
    let elem = document.getElementById('hamburger');
    toggleClassInList(elem, 'change');
    // changeNavToMobile();
    appendClassToElement('topnavId', 'topnav', 'responsive');
    appendClassToElement('nav-div-leftId', 'nav-div-left', 'responsive');
    appendClassToElement('nav-div-rightId', 'nav-div-right', 'responsive');
  };

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <nav className="topnav" id="topnavId">
            <div id="nav-div-leftId" className="nav-div-left">
              <div
                id="hamburger"
                className="hamburger"
                onClick={toggleMobileMenuDisplay}
              >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
              <h3>Schedule Events</h3>

              <NavLink to="/events">All Events</NavLink>

              {!context.authUser && <NavLink to="/auth">Login</NavLink>}
              {context.authUser && (
                <React.Fragment>
                  <NavLink to="/create-event">Create Event</NavLink>
                  <NavLink to="/bookings">Bookings</NavLink>
                </React.Fragment>
              )}
            </div>
            <div id="nav-div-rightId" className="nav-div-right">
              {context.authUser && (
                <React.Fragment>
                  <p id="user">User: {context.authUser.email.split('@')[0]}</p>
                  <button id="logout" onClick={context.logout}>
                    Logout
                  </button>
                </React.Fragment>
              )}
            </div>
          </nav>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default TopNav;
