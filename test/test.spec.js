const { expect } = require('chai');
const { describe, it } = require('mocha');

describe('Testing Test', () => {
  it('Test should pass', () => {
    expect({ isAuth: false }).which.is.an('object').has.a.property('isAuth');
    expect({ isAuth: false }).has.a.property('isAuth').which.is.a('boolean');
  });
});
