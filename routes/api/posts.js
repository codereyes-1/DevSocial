const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  POST api/posts
// @desc   Creaet a post
// @access Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')

            // need to instantiate a new post from the model with 'new Post' after the =
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save()

            res.json(post)
        
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')

        }
    }
)

// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route  GET api/posts/:id
// @desc   Get post by ID
// @access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post)
    } catch (err) {
        console.error(err.message)
        if(err.kind  === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('Server Error')
    }
})


// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        // Check user. turn objectId to string for match with req.uesr.id string type
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove()
        
        res.json({ msg: 'Post removed' })
    } catch (err) {
        console.error(err.message)
        if(err.kind  === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route  PUT api/posts/like:id
// @desc   Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if post has already been liked by this user
        // compare current user to the user that's logged in
        // convert toString to match the user id that's in req.user.id
        // will only return something if filter finds a match on this condition 
        // if length of matches is > 0 then user has already liked this
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked'})
        }

        // adds like
        post.likes.unshift({ user: req.user.id })

        // save like to the db
        await post.save()

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


// @route  PUT api/posts/unlike:id
// @desc   Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if post has already been lik ed by this user
        // compare current user to the user that's logged in
        // convert toString to match the user id that's in req.user.id
        // will only return something if filter finds a match on this condition 
        // if length of matches is === 0 then user has already liked this
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post not yet liked'})
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        // Take like out of the array
        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private

router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)

            // create new comment object, sourcing name and avatar from user, text and user from req.body and req.user
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)

            await post.save()

            res.json(post.comments)
        
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')

        }
    }
)


// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete a comment
// @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Get the comment by id 
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // verify comment_id given at url exists
        if(!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' })
        }

        // verify user id req'ing to delete comment matches user id for creator of the comment
        if(comment.user.toString() !== req.user.id ) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        // Get comment index 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        // Take comment out of the array
        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router