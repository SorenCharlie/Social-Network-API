const router = require('express').Router();
const { User, Thought} = require('../models');
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

// User routes
router.route('/api/users')
    .get(async (req, res) => {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .post(async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    });

router.route('/api/users/:userId')
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (user) {
                await Thought.deleteMany({ _id: { $in: user.thoughts } });
            }
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json(err);
        }
    });

// Friend routes
router.route('/api/users/:userId/friends/:friendId')
    .post(async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    });

// Thought routes
router.route('/api/thoughts')
    .get(async (req, res) => {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .post(async (req, res) => {
        try {
            const thought = await Thought.create(req.body);
            await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    });

router.route('/api/thoughts/:thoughtId')
    .get(async (req, res) => {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        try {
            const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        try {
            await Thought.findByIdAndDelete(req.params.thoughtId);
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json(err);
        }
    });