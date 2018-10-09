const { Contribution, User } = require('../../models');
const verifyUser = require('../../util/verifyUser');

module.exports = {
  Contribution: {
    user: parent => User.findById(parent.user).exec(),
  },
  Query: {
    contribution: (parent, { id }) => Contribution.findById(id).exec(),
    contributions: async (parent, { userId, limit }) => {
      const searchParams = {};
      if (userId) {
        searchParams.user = userId;
      }

      return Contribution.where(searchParams)
        .sort('-updatedAt')
        .limit(limit || 10)
        .exec();
    },
  },

  Mutation: {
    createContribution: async (parent, args, { user }) => {
      verifyUser({ user });

      const newContribution = new Contribution({
        user: user.id,
        ...args,
      });

      return newContribution.save();
    },
    updateContribution: async (parent, args, { user }) => {
      const { id, ...updatedProperties } = args;

      // Restrict to logged in user
      // Restrict to contribution owner or admin user
      verifyUser({ user, testUserId: user.id, current: true, admin: true });

      const updatedContribution = await Contribution.findOneAndUpdate(
        { id },
        { $set: { ...updatedProperties } },
        { new: true }
      ).exec();

      if (!updatedContribution) {
        throw new Error('Contribution not found.');
      }

      return updatedContribution;
    },
    deleteContribution: async (parent, { id }, { user }) => {
      // Restrict to logged in user
      // Restrict to profile owner or admin user
      verifyUser({ user, testUserId: user.id, current: true, admin: true });

      const removedContribution = await Contribution.findByIdAndDelete(
        id
      ).exec();

      if (!removedContribution) {
        throw new Error('Contribution not found.');
      }

      return removedContribution.id;
    },
  },
};
