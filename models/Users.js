const { Schema, model } = require('mongoose');

// Schema to create User model
const usersSchema = new Schema(
  {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thoughts',
        },
    ],
    friends: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Users',
        },
    ]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
    },
);

usersSchema
.virtual('friendCount')
.get(function () {
    return this.friends.length;
  })

const Users = model('users', usersSchema);

module.exports = Users;
