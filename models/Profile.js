const mongoose = require('mongoose')
// create profile schema with new mongoose.schema({pass in object with all fields})
const ProfileSchema = new mongoose.Schema({
    // create reference to user model(every profile associated with a user)
    // with user: type: mongoose.Schema.Types.ObjectId, and ref: reference to model
    // these will all show in the as fields or dropdowns on the front end
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    // array
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            },
        }
    ],
        // object
        social: {
            twitter: {
                type: String
            },
            facebook: {
                type: String
            },
            youtube: {
                type: String
            },
            linkedin: {
                type: String
            },
            instagram: {
                type: String
            }
        },
    // array
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

// exports = set var 'Profile' = to mongoose.model(modelName:'profile' schema:'ProfileSchema')
module.exports = Profile = mongoose.model('profile', ProfileSchema)

// now can bring this profile model into profile routes and query db 