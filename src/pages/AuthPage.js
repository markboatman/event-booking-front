import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './AuthPage.css';

class AuthPage extends Component {
  state = {
    // AuthPage is in login mode initially
    isLogin: true,
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
    AuthContext looks like this in context/auth-context
    {
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
      return { isLogin: !prevState.isLogin };
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
    //   password
    // );

    // default req will be login config
    let reqBody = {
      query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            userId
            tokenString
            tokenExpiration
          }
        }
      `,
    };

    if (!this.state.isLogin) {
      // set up create user
      reqBody = {
        query: `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" } ) {
            _id
            email
          }
        }
      `,
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

    // using standard fetch
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        // tell receiver what format we are sending
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('res.status: ', res.status);
        // add status === 500 check because graphql is acting unexpectedly on error
        // Graphql is generating a 500 on error. This is non standard behavior
        // Console will report 500 but will also console log graphql error
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Request to server failed!');
        }
        // else
        // this will return a promise so we can "then" it
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        if (
          this.state.isLogin &&
          resJson.data.login.tokenString /* && this.isLogin */
        ) {
          // set the App.state to logged in.
          this.context.login(
            // this data is from the backend
            resJson.data.login.tokenString,
            resJson.data.login.userId,
            // this is from the Auth middleware
            resJson.data.login.tokenExpiration
          );
          console.log('User logged in: ', resJson.data.login);
        } else {
          console.log('User created: ', resJson.data.createUser);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  render() {
    // return some jsx
    return (
      // onSubmit will pass an event arg to submitHandler
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          {/* use ref to bind instance var */}
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          {/* type="password" will hide the chars, use ref to bind */}
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          {/* type="submit" should submit the parent form */}
          <button type="submit">Submit</button>
          {/* make button type="button" so it does not submit the form */}
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'create user' : 'login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
