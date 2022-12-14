const express = require('express')
const request = require('request')
const config = require('config')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
// const { request, response } = require('express')

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).
        populate('user', ['name', 'avatar'])
        // Here user pertains to user field in Profile model user...objectId
        // and using populate method from Profile .populate('schema name', [array attributes from schema])
        // check if no profile
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'})
        }
        // if profile, send it 
        res.json(profile)

    } catch (err) {
        console.err(err.message)
        res.status(500).send('Server Error')
    }
})

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private

// Check for errors in body
router.post('/', [auth, 
    [
        check('status', 'Status is required')
        .not()
        .isEmpty(),
        check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req)
        if  ( !errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        
        // destructure fields from req.body
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            twitter,
            facebook,
            youtube,
            linkedin,
            instagram,
            skills
        } = req.body

        // Build profile object
        const profileFields = {}
        // get user.destructuredField from req.user.id. 
        // If item exists, set profileFields.XXXX = item
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.website = website
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername
        // if(twitter) profileFields.twitter = twitter
        // if(facebook) profileFields.facebook = facebook
        // if(youtube) profileFields.youtube = youtube
        // if(linkedin) profileFields.linkedin = linkedin
        // if(instagram) profileFields.instagram = instagram
        if (skills) {
            // turn comma skills list to array by map thru with skill.trim, 
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        //Build social object
        // get user.destructuredField from req.user.id. 
        // If item exists, set profileFields.XXXX = item
        profileFields.social = {}
        if (twitter) profileFields.social.twitter = twitter
        if (facebook) profileFields.social.facebook = facebook
        if (youtube) profileFields.social.youtube = youtube
        if (linkedin) profileFields.social.linkedin = linkedin
        if (instagram) profileFields.social.instagram = instagram

        // Search for profile by user
        try {
            let profile = await Profile.findOne({ user: req.user.id})
            if  (profile) {
                // If found, Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields },
                    { new: true })

                return res.json(profile)
            }

            // If !found, Create
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)
        } catch (err) {
            console.err(err.message)
            res.status(500).send('Server Error')
        }
})

// @route    GET api/profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})


// @route    GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
// mod for single user: const profile, await Profile.findOne({user: req.params.user_id}), res.json(profiles)
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: 'Profile not found'})

        res.json(profile)
    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/profile
// @route   Get all profiles
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {
        // @todo - remove users posts
        await Post.deleteMany({ user: req.user.id })
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: 'User deleted'})
    } catch (err) {
        console.err(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/profile/experience
// @route   Add profile experience
// @access  Private

router.put('/experience', [
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ]
],
    // here in function body check for errors
    async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // destructuring for experience req.body  
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    // create object with data user submits
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne( {user: req.user.id })
        // unshift pushes to beginning instead of end
        // how to add array to the document
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    }   catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}
)



// @route   Delete api/profile/experience/:exp_id
// @route   Delete experience from profile
// @access  Private


router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        // get profile
        const profile = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id)

        // splice out that index
        profile.experience.splice(removeIndex, 1)

        // save and return profile
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).sendStatus('Server Error')
    }
})

// @route   PUT api/profile/education
// @route   Add profile education
// @access  Private

router.put('/education', [
    auth,
    [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ]
],
    // here in function body check for errors
    async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // destructuring for experience req.body  
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    // create object with data user submits
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne( {user: req.user.id })
        // unshift pushes to beginning instead of end
        // how to add array to the document
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    }   catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}
)



// @route   Delete api/profile/education/:edu_id
// @route   Delete education from profile
// @access  Private


router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        // get profile
        const profile = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id)

        // splice out that index
        profile.education.splice(removeIndex, 1)

        // save and return profile
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).sendStatus('Server Error')
    }
})

// @route   Delete api/profile/github/:username
// @route   Get user repos from Github
// @access  Public


router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,method: 'GET',headers: { 'user-agent': 'node.js'}
        }

        request(options, (error, response, body) => {
            if(error) console.error(error)

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found'})
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


module.exports = router