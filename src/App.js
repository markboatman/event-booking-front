import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import EventsPage from './pages/EventsPage';
import MainNavigation from './components/navigation/MainNavigation';

// The tutorial makes this a class: class App extends Component { }
function App() {
  return (
    /* this is one way to make a one page react app */
    <BrowserRouter>
      {/* user <React.Fragment /> here in tutorial */}
      <MainNavigation />
      <main className="main-content"> {/* <main> is optional */}
      This is the main-content section
        {/* use Switch to jump directly to url match
          Don't go through the sequence
        */}
        <Switch>
          {/* need to use exact on "/ nothing"*/}
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/bookings" component={BookingsPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
