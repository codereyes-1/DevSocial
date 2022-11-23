const { application } = require("express")
const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require("express-validator")
const gravatar = require('gravatar')

const User = require('../../models/User')

// @route  POST api/users
// @desc   Register user
// @access Public

// Options for post: [check name, email, password], 
// validate request, then name, email, pw = req.body
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
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
    const { name, email, password } = req.body 

    try {
      // try Check if user exists, identified by email. !exists, next block
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }]})
      }
      // Get users gravatar 
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      // Create user instance with validated payload
      user = new User({
        name,
        email,
        avatar,
        password
      })

      // Encrypt password object
      const salt = await bcrypt.genSalt(10)

      // take password frm user obj, await bcrypt.hash to salt pw(give password, apply salt)
      // bcrypt.hash result stored in user.password
       user.password = await bcrypt.hash(password, salt)

      //  save user to MDB after salting pw
       await user.save()

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
