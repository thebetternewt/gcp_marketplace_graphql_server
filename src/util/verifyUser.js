// Returns true if user is verified
const verifyUser = ({
  user,
  testUserId,
  current = false,
  admin = false,
} = {}) => {
  // console.log('currentUser: ', user);
  // console.log('testUserId: ', testUserId);
  // console.log('current: ', current);
  // console.log('admin: ', admin);
  // console.log('verifying user...');
  let valid = false;

  if (current) {
    // Check if user id belongs to current user
    if (testUserId === user.id) {
      return true;
    }
  }

  if (admin) {
    // Check if current user is admin
    if (user.admin) {
      return true;
    }
  }

  // Check if current user is undefined
  if (user && !current && !admin) {
    valid = true;
  }

  if (!valid) {
    throw new Error('Not authorized!');
  }

  return true;
};

module.exports = verifyUser;
