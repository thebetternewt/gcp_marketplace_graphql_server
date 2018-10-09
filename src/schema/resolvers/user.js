require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { User } = require('../../models');

module.exports = {
  Query: {
    me: async (parent, args, { user }) => {
      if (!user) {
        throw new Error('You are not authenticated!');
      }

      // user is authenticated
      return User.findOne({ _id: user.id }).exec();
    },
    user: async (parent, { id }, { user }) => {
      if (!user.id === id && !user.admin) {
        throw new Error('Not authorized');
      }
      return User.findOne({ id }).exec();
    },
    users: async (parent, args, { user }) => {
      if (!user.admin) {
        throw new Error('Not authorized');
      }
      return User.find().exec();
    },
  },

  Mutation: {
    signup: async (parent, { name, email, password }) => {
      // Check for user with that email address.
      const user = await User.findOne({ email }).exec();
      if (user) {
        throw new Error('User already exists.');
      }

      const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        avatar,
        email: email.toLowerCase(),
        password: hashedPass,
      });

      return newUser.save();
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        email: email.toLowerCase(),
      }).exec();

      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Invalid login credentials');
      }

      return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },
    updateUser: async (parent, args, { user }) => {
      const { id, admin, password, email, ...updatedProperties } = args;

      if (!user || (!user.id === id && !user.admin)) {
        throw new Error('Not authorized');
      }

      // Only allow update of admin if current user is admin and
      // only update admin if specified args
      if (user.admin && admin !== undefined) {
        updatedProperties.admin = admin;
      }

      if (email) {
        // Check for user with that email address.
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
          throw new Error('User already exists.');
        }

        // Generate new gravatar url from email
        const avatar = gravatar.url(email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm', // Default
        });

        updatedProperties.email = email;
        updatedProperties.avatar = avatar;
      }

      if (password) {
        // Hash new password
        const hashedPass = await bcrypt.hash(password, 10);
        updatedProperties.password = hashedPass;
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...updatedProperties } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    },
    removeUser: async (parent, { id }, { user }) => {
      if (!user.id === id && !user.admin) {
        throw new Error('Not authorized');
      }
      const removedUser = await User.findOneAndRemove({ _id: id }).exec();

      if (!removedUser) {
        throw new Error('User not found');
      }

      return removedUser.id;
    },
  },
};
