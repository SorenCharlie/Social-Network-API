const { User, Thought } = require('./models');
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');

mongoose
.connect('mongodb://localhost:27017/mongoTodosDb')
.then(async () => {
    console.log('Connected to MongoDB');
    try {
        const newUser = await User.create({
            firstName: "Harry",
            lastName:  "Doe",
            email: "dds@ddsdD.com",
            thoughts: [],
            friends: [],
        });

        console.log(newUser);
   
        const newThought = await  Thought.create({
           reactionId: Schema.Types.ObjectId,
           reactionBody: "Wow",
           username: newUser._id,
           thoughtText: "WowWow"
        })
        console.log(newThought);
    } catch (err) {
        console.log(err)
    }
})
.catch(err => console.log(err));