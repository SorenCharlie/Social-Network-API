const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
     type: String,
     required: true,
     unique: true,
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

module.exports = model('User', userSchema);
