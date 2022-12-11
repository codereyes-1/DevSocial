import React, { Fragment } from 'react'
import spinner from './spinner.gif'

const Spinner = () => (
    <Fragment>
        <img
            src={spinner}
            style={{ width: '100px', marginTop: 'auto', display: 'block' }}
            alt='Loading.....'
            />
    </Fragment>
)

export default Spinner