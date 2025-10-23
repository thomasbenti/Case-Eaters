const User = require('../models/User');

describe('User Model', () => {
  test('is invalid if username or password missing', () => {
    const user = new User();
    const err = user.validateSync();
    expect(err.errors).toHaveProperty('username');
    expect(err.errors).toHaveProperty('password');
  });
});  