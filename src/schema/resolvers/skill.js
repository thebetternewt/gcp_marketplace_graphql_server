const { Skill, Profile } = require('../../models');
const verifyUser = require('../../util/verifyUser');

module.exports = {
  Skill: {
    profiles: parent => Profile.where({ skills: parent.id }),
  },
  Query: {
    skill: async (parent, { id }) => Skill.findOne({ id }).exec(),
    skills: async () =>
      Skill.find()
        .limit(10)
        .exec(),
  },

  Mutation: {
    createSkill: async (parent, { name }, { user }) => {
      verifyUser({ user });

      return Skill.findOneAndUpdate(
        { name },
        {},
        { upsert: true, new: true }
      ).exec();
    },

    deleteSkill: async (parent, { id }, { user }) => {
      verifyUser({ user, admin: true });

      const removedSkill = await Skill.findOneAndRemove({ id }).exec();

      if (!removedSkill) {
        throw new Error('Skill not found.');
      }

      return removedSkill.id;
    },
  },
};
