// parent component to the rest. bring in state, profile data, call getProfileById action, get id from the route 
import React, { Fragment, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfileById } from '../../actions/profile'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileTop from './ProfileTop'



const Profile = ({ 
    getProfileById, 
    profile: { profile }, 
    auth
    }) => {
      const { id } = useParams()
    useEffect(() => {
      getProfileById(id) 
      }, [ getProfileById, id])
      console.log(profile)
  return (
    <section className='container'>
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          </h1>
          {auth.isAuthenticated && auth.loading === false 
          && auth.user._id === profile.user._id &&
          (<Link to='/edit-profile' className='btn btn-dark'>
            Edit Profile
          </Link>)}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (<Fragment>
                {profile.experience.map(experience => (
                  <ProfileExperience key={experience._id} experience={experience} />
                ))}
              </Fragment>
              ) : (
              <h4>No experience credentials</h4>
              )}
            </div>

            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (<Fragment>
                {profile.education.map(education => (
                  <ProfileEducation key={education._id} education={education} />
                ))}
              </Fragment>
              ) : (
              <h4>No education credentials</h4>
              )}
            </div>            
          </div>
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