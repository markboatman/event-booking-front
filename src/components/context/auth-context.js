const React = require('react');

// can pass a number, string or object to createContext
export default React.createContext({
  token: null,
  userId: null,
  login: (tokenString, userId, tokenExpiration) => {},
  logout: () => {}
});

// IMPORT this into the top off your component tree so all 
// components can use this.