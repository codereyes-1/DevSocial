import axios from 'axios'
// import { setAlert } from './alert'


import {
    GET_PROFILE,
    PROFILE_ERROR
} from './types'


// Get current users profile
// here want to hit /api/profile/me
// knows which profile to load from a token which has the user id 
// handle these action types inside the reducer
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

