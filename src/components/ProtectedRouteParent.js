// import { useContext } from 'react';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from './context/auth-context';

const ProtectedRouteParent = ({ children }) => {
  // get the token off the authContext value
  const { authUser } = useContext(AuthContext);
  // gets current active route.
  // What route is the user currently on
  // before we redirect them with Navigate
  const location = useLocation();
  // console.log('In ProtectedRouteParent, token is: ', authUser?.token);
  console.log('In ProtectedRouteParent, location is: ', location);
  if (!authUser?.token) {
    // redirect to /home if not logged in, or if they logout
    return <Navigate to="/events" replace state={{ from: location }} />;
  }
  // ELSE make our children available as Route(s) / links
  return children;
};

export default ProtectedRouteParent;
