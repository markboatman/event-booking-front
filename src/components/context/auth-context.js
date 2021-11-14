const React = require('react');

// can pass a number, string or object to createContext
export default React.createContext({
  // these are DUMMY PROPS and vals for editor code completion
  // Real values are set where myContext.Provider is declared
  // in App.js
  token: null,
  userId: null,
  tokenExpiration: null,
  email: null,
  // this is a dummy placeholder for code completion
  // login is defined in App.js
  login: (tokenString, userId, tokenExpiration, email) => {},
  logout: () => {},
});

// IMPORT this into the top off your component tree so all
// components can use this.
