const errors = {
  userAlreadyExists: new Error('User Already Exists'),
  unauthenticated: new Error('Unauthenticated'),
  userDoesNotExist: new Error('User Does not exist'),
  incorrectPassword: new Error('Password is Incorrect'),
};

module.exports = errors;
