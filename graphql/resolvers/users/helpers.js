const { dateToString } = require('../../utils/date');

const formatUser = async user => {
  try {
    return {
      ...user._doc,
      _id: user.id,
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt),
    };
  } catch (err) {
    throw err;
  }
};

exports.formatUser = formatUser;
