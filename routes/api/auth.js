const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require("express-validator")
// bring in auth, protection for this route
// to make a route protected add as 2nd arg to router.get
// router.get('/', auth, (req, res)...)
const auth = require('../../middleware/auth')
const User = require('../../models/User')

// @route  GET api/auth
// @desc   Test route
// @access Public
// router.get('/', auth, (req, res) => res.send('Auth route'))

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.messaage)
        res.status(500).send('Server Error')
    }
})
// At this block, can register user and get token but
// need a way to login with users already in DB


// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
// purpose of this route is get token for make requests to private routes

// Options for post: [check name, email, password], 
// validate request, then name, email, pw = req.body
router.post("/", [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists() 
    ],
    async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // To avoid doing req.body many times use destructuring
    // If errors above is empty execute below: 
    // check, stop if user exists & get avatar
    // else: create user instance, salt password, save + return jsonwebtoken
    const { email, password } = req.body 

    try {
      // try Check if user exist. if user !exists in DB, send error
      // let user gets user from DB by email. 
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]})
        
      }
      

      //  bcyrpt has method called compare, takes plain txt password that user enters
     //   compares plain text against password from let user object 
     //   if !isMatch, send error 'invalid creds'
      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]})
      }
      
      //  get payload (has user id)
       //promise returned is user from mdb which contains user.id
       const payload = {
        user: {
          id: user.id
        }
      }

        // sign payload w/jwtSecret, set expiration
        // inside the callback will get either error or token
        // creating JWT based on user.id from payload
      jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        // err callback
        (err, token) => {
          // check for err
          if(err) throw err
          // no error, send token in response
          res.json({ token })
        }
      )
    } catch(err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
);


module.exports = router;
