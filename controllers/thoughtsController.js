const { Users, Thoughts } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thoughts.find({})
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(thoughts => res.json(thoughts))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user
    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a new thought
    createThought(req, res) {
        Thoughts.create(req.body)
            .then((thought) => {
                return Users.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID',
                    })
                    : res.json('Created the thought 🎉')
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err.message);
            });
    },

    // Update a thought
    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .populate({ path: 'reactions', select: '-__v' })
            .select('-___v')
            .then((updatedUser) =>
                !updatedUser
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(updatedUser)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a thought
    deleteThought(req, res) {
        Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
            .then((deletedUser) =>
                !deletedUser
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(deletedUser)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Create a new reaction
    createReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        )
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(data => {
                if (!data) {
                    res.status(404).json({ message: 'No thought with that ID' });
                    return;
                }
                res.json(data);
            })
            .catch(err => res.status(400).json(err))

    },

    // Delete a reaction by ID
    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true })
            .then(data => {
                if (!data) {
                    res.status(404).json({ message: 'No thought with that ID' });
                    return;
                }
                res.json(data);
            })
            .catch(err => res.status(400).json(err));
    }

};
