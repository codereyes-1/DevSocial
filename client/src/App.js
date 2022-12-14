import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert' // add w/in container above switch
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';

// Redux: provider to connect redux to react
// Wrap App that way all components can acces the state 
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth'

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => { 
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
    <Router>
    <Fragment>
      <Navbar/>
      <Alert />
      <Routes>
        <Route path='/' element={<Landing/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/profiles' element={<Profiles/>} />
            <Route path='/profile/:id' element={<Profile/>} />
            <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} ></Route>
            <Route path='/create-profile' element={<PrivateRoute component={CreateProfile} />} ></Route>
            <Route path='/edit-profile' element={<PrivateRoute component={EditProfile} />} ></Route>
            <Route path='/add-experience' element={<PrivateRoute component={AddExperience} />} ></Route>
            <Route path='/add-education' element={<PrivateRoute component={AddEducation} />} ></Route>
      </Routes>
    </Fragment>
  </Router>
  </Provider>
)}
export default App;




