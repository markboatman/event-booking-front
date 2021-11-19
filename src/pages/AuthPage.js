import React, { Component } from 'react';
import AuthContext from '../components/context/auth-context';
import Spinner from '../components/spinner/Spinner';
import './AuthPage.css';

class AuthPage extends Component {
  state = {
    // page is in loginMode or createUser mode
    loginMode: true,
    feedback: '',
    working: false,
  };
  /*
    from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
    STATIC PROPERTIES are useful for caches, fixed-configuration, 
    or any other data you don't need to be replicated across instances
  */
  // this declaration, using AuthContext will make the var "this.context"
  // available in this scope
  static contextType = AuthContext;
  /* 
    AuthContext looks like this in context/auth-context, 
    Properties are actually set in App.js when we instanciate
    the myContext.Provider
    {
      // these are set for code completion in the editor
      token: null,
      userId: null,
      login: () => {},
      logout: () => {}
    }
  */
  constructor(props) {
    super(props);
    // using React reference api methods for accessing/watching elements
    // in form, could use state, bind to elements and
    // listen for change events
    // create an instance var that is a reference element (El)
    // Bind these vars to the Elements in the JSX with React ref prop
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { loginMode: !prevState.loginMode, feedback: '' };
    });
  };

  // class method def
  // this will be called when onSubmit event happens
  submitHandler = (event) => {
    // Because this is an ARROW FUNCTION, 'this' will be bound correctly
    // preventDefault will prevent a req for the same page (url).

    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    // should do better valildation of inputs
    if (email.trim().length === 0 || password.trim().length === 0) {
      return; // don't do anything
    }
    // console.log(
    //   'AuthPage.submitHandler, email: ',
    //   email,
    //   ' password: ',
    //   password118
    // );

    // default req will be login config
    let reqBody = {
      query: `
        mutation Login( $email: String!, $password: String! ) {
          login(email: $email, password: $password) {
            userId
            tokenString
            tokenExpiration
            email
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };
    // if in create user mode
    if (!this.state.loginMode) {
      // set up create user
      reqBody = {
        query: `
        mutation CreateUser( $email: String!, $password: String! ) {
          createUser(userInput: { email: $email, password: $password } ) {
            _id
            email
          }
        }
      `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    /*
      On modern browsers, if you make a request to a different server ( i.e. a server
      not running at localhost:3000) then the this server, localhost:3000, will check
      the response to the fetch and look for response headers coming from localhost:4000
      stating that cross-origin requests are okay. Need to set this up on the graphql server

      To see response to this request, use dev-tools network tab and open response
      use preview tab to view the graphql data
    */
    let gqlError = false;
    // using standard fetch
    this.setState({ working: true });
    fetch(process.env.REACT_APP_BACKEND_URL + '/graphql', {
      // I think everything has to be a POST to graphql server
      // this post will either do a login or create user, depends
      // on body contents
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('res.status: ', res.status);
        console.log('res is: ', res);
        // status is 500 if you attempt to login with a user that does not exist
        // need to tell the front end, it is logged in the backend, need to put
        // error message on the res from the backend, 500 is a graphql error
        if (res.status !== 200 && res.status !== 201 && res.status !== 500) {
          throw new Error('Request to server failed!');
        } else if (res.status === 500 /* && res.okay === false */) {
          // mutation or query error condition
          gqlError = true;
        }
        // else
        // this will return a promise so we can "then" it
        return res.json();
      })
      .then((resJson) => {
        // console.log('In then resJson', resJson);
        if (gqlError) {
          this.setState({
            feedback: resJson.errors[0].message,
            working: false,
          });
        } else if (
          this.state.loginMode &&
          // if we were in login mode and we got back a token
          resJson.data.login.tokenString
        ) {
          console.log('AuthPage login returned: ', resJson.data.login);
          // login is put on the context in App.js
          // this call sets App.js's state
          this.context.login(
            // this data is from the backend
            resJson.data.login.tokenString,
            resJson.data.login.userId,
            // this is from the Auth middleware
            resJson.data.login.tokenExpiration,
            resJson.data.login.email
          );
          // set up feedback to the u.i. logged in
          // console.log(
          //   'User logged in, token is: ',
          //   this.context.login.tokenString
          // );
          console.log('User logged in: ', resJson.data.login);
          this.setState({ working: false });
        } else {
          // we tried to create a user
          // createUser will genererate a status of 200 on failure so check
          // if createUser is null
          if (resJson.data.createUser) {
            console.log('User created: ', resJson.data.createUser);
            this.setState({
              feedback: 'User created. Please login.',
              working: false,
            });
            // this.setState({ working: false });
          } else {
            console.log(`Failed to create user: ${resJson.errors[0].message}`);
            // create user failed, get the error
            this.setState({
              feedback: `Failed to create user: ${resJson.errors[0].message}`,
              working: false,
            });
          }
          // this.setState({ working: false });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    //this.setState({ working: false });
  };

  render() {
    // return some jsx
    return (
      <div>
        {/* onSubmit will pass an event arg to submitHandler */}
        <form className="auth-form" onSubmit={this.submitHandler}>
          <p>Backend is: {process.env.REACT_APP_BACKEND_URL}</p>
          <h3>{this.state.loginMode ? 'Please Login:' : 'Create Account:'}</h3>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            {/* use ref to bind instance var */}
            <input
              type="email"
              id="email"
              ref={this.emailEl}
              placeholder={!this.state.loginMode && 'any@email.com'}
            ></input>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            {/* type="password" will hide the chars, use ref to bind */}
            <input
              type="password"
              id="password"
              ref={this.passwordEl}
              placeholder={!this.state.loginMode && 'any-password'}
            ></input>
          </div>
          <div className="form-actions">
            {/* type="submit" should submit the parent form */}
            <button type="submit">
              {this.state.loginMode ? 'Login' : 'Create'}
            </button>
            {/* make button type="button" so it does not submit the form */}
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.loginMode ? 'create account' : 'login'}
            </button>
            {this.state.feedback && <p>{this.state.feedback}</p>}
          </div>
        </form>
        {this.state.working && <Spinner />}
      </div>
    );
  }
}

export default AuthPage;
// res
// .json()
// .then((resJson) => {
//   console.log('In 500 condition, resJson is: ', resJson);
//   this.setState({ error: resJson.errors[0].message });
//   // jump out
//   return;
//   // throw new Error(resJson.errors[0].message);
// })
// .catch((error) => {
//   throw error;
// });
