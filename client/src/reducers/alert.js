// import { Action } from "@remix-run/router"
// import { initializeUseSelector } from "react-redux/es/hooks/useSelector"

import { SET_ALERT, REMOVE_ALERT } from "../actions/types"
const initialState = []

// starts with initial state, action will take action type and the data
// evaluate action type with switch statement (action.type) eval by cases
// case 'SET ALERT' as type
// separate folder for action types, with file types.js that holds all var, constants

export default function(state = initialState, action) {
    const { type, payload } = action
    
    switch(type) {
        case SET_ALERT:
            return [...state, payload]
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}