// This is a temporary function for testing, the functions are mainly generated by AI

const UserHandler = require('./userhandler');
const { hashPassword } = require('./utils');

async function testUserFunctions() {

    // Assume we have logged in as a user

    const user = {
        userID: 5,
        username: 'testuser4',
        salt: '411c0f12c1afd75457fd0b8a5d8e8be3',
        password: 'bce45819669f93d652fdc1f80328eec914b8d1c28b9495dadfb9a295aadba71de477dd0cf31360002d032182efb9879c019c9606685add6769344f4ccf1d8ca9',
        secureqans: '123',
        privacy: 'public',
        description: null,
        active: true,
        usertype: 'user'
    }

    // Create a new user
    const User = new UserHandler(user.userID, user.username, user.salt, user.password, user.usertype, user.privacy, user.active);

    console.log('now start testing!');

    // Test view own profile
    // const profile = await User.viewOwnProfile();
    // console.log(profile)

    // Test update own profile - ["username", "description", "privacy"]
    // const updatedProfile = await User.editProfile(['hehehe', 'this is a test description', 'private']);
    // console.log(updatedProfile)

    // Test view own profile
    // const profile = await User.viewOwnProfile();
    // console.log(profile)

    // Test view other user's profile
    const otherUser = await User.viewProfile(7);
    console.log(otherUser)

    console.log('Test ended.')
}

testUserFunctions();