import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import { DashboardActions } from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
import { Link } from 'react-router-dom'

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading} }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])

  return loading && profile == null ? (
  <Spinner />
  ) : (
    <Fragment>
      <h1 className='large landing-inner'>Dashboard</h1>
      <p className='large landing-outer'>
        <i className='fas fa-user'> Welcome { user && user.name  }</i>
      </p>
      {profile !== null ? (
      <Fragment>
        <DashboardActions />
        <Experience experience={profile.experience} />
        <Education education={profile.education} />

        <div className='my-2'>
          <button type="btn btn-danger" onClick={() => deleteAccount()}>
            <i className='fas fa-user-minus'>
              Delete My Account
            </i>
          </button>
        </div>
      </Fragment>
     ) : (
      <Fragment>
        <p>You have not setup a profile, please add some info</p>
        <Link to='/create-profile' className='btn btn-primary my-1'>
          Create Profile
        </Link>
      </Fragment>
      )}
  </Fragment>
  )
}


Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

// anything in the reducer state can get into this component
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
// export default (Dashboard)

