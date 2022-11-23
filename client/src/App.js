import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert' // add w/in container above switch
import Dashboard from './components/dashboard/Dashboard'
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
      <Routes>
        <Route path='/' element={<Landing/>} />
        {/* every page with the theme except landing page has a class or container to push everything to the middle */}
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} ></Route>
      </Routes>
      <Alert />
    </Fragment>
  </Router>
  </Provider>
)}
export default App;




