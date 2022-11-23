import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Navigate } from 'react-router-dom'

// take from Component from component and get any other components passed in with
// using the rest operator ...
const PrivateRoute = ({ component: Component, 
    auth: { isAuthenticated, loading },
     ...rest
     }) => (
    // if not isAuth and not loading, redirect to login
    // else load component and props passed into that
        <Route 
        {...rest} render={props => 
        !isAuthenticated && !loading ? (
        <Navigate to='/login' />
        ) : (
        <Component {...props} />
        )} />
)


PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({ 
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)


// const PrivateRoute = ({
//     component: Component,
//     auth: { isAuthenticated, loading },
//   }) => {
//     if (loading) return <h1>Loading...</h1>;
//     if (isAuthenticated) return <Component />;

//     return <Navigate to="/login" />;
//   };