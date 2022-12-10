// parent component to the rest. bring in state, profile data, call getProfileById action, get id from the route 
import React, { Fragment, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfileById } from '../../actions/profile'
// import ProfileTop from './ProfileTop'



const Profile = ({ 
    getProfileById, 
    profile: { profile, loading }, 
    auth 
    }) => {
      const { id } = useParams()
    useEffect(() => {
      getProfileById(id) 
      }, [ getProfileById, id])
  return (
    <section className='container'>
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          </h1>
          {auth.isAuthenticated && auth.loading === false 
          && auth.user._id === profile.user._id
          (<Link to='/edit-profile' className='btn btn-dark'>
            Edit Profile
          </Link>)}
        </Fragment>
      )}
    </Fragment>
    </section>
  )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile)