const bcrypt = require('bcryptjs');
const User = require('../../../models/user');
const errors = require('../../../errors/index');
const { formatUser } = require('./helpers');

module.exports = {
  user: async (args) => {
    try {
      const user = await User.findOne({ _id: args.id });
      return formatUser(user);
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const user = await User.findOne({ $or: [{ username: args.userInput.username }, { email: args.userInput.email }] });
      if (user) {
        throw errors.userAlreadyExists;
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        username: args.userInput.username,
        password: hashedPassword,
        contact: args.userInput.contact,
        email: args.userInput.email,
      });
      const result = await newUser.save();
      return formatUser(result);
    } catch (err) {
      throw err;
    }
  },
};
