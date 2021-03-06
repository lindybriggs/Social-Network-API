const { Users } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
        Users.find({})
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUsersData => res.json(dbUsersData))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user
    getSingleUser(req, res) {
        Users.findOne({ _id: req.params.userId })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err.message));
    },
    // Create a new user
    createUser(req, res) {
        Users.create(req.body)
            .then((newUser) => res.json(newUser))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Update a user
    updateUser(req, res) {
        Users.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((updatedUser) =>
                !updatedUser
                    ? res.status(404).json({ message: 'No user with this id!' })
                    : res.json(updatedUser)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user
    deleteUser(req, res) {
        Users.findOneAndDelete({ _id: req.params.userId })
            .then((deletedUser) =>
                !deletedUser
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(deletedUser)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Add a friend
    addFriend(req, res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId},
            {$push: { friends: req.params.friendId}},
            {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user with that ID!'});
                return;
            }
        res.json(data);
        })
        .catch(err => res.json(err));
    },
    // delete a friend
    deleteFriend(req, res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: { friends: req.params.friendId}},
            {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(data => {
            if(!data) {
                res.status(404).json({message: 'No user with that ID!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err.message));
    }
};