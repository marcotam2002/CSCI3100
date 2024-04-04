/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// This is a temporary function for testing, the functions are mainly generated by AI

const AccountHandler = require('./accounthandler');

// Function to test the createUser method
async function testCreateUser() {
    // Define test user data
    const username = 'testuser5';
    const password = 'testpassword';
    const userType = 'user'; // You can adjust this based on your requirements

    // Create an instance of AccountHandler
    const accountHandler = new AccountHandler();

    try {
        // Call the createUser method to create a new user
        const createUserResult = await accountHandler.createUser(username, password);

        // Check if user creation was successful
        if (createUserResult.success) {
            console.log('User created successfully');
            console.log('User ID:', accountHandler.userID); // Assuming the method returns the newly created user's ID
        } else {
            console.error('Fail Message', createUserResult.message);
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function testLogin() {
    // Create an instance of AccountHandler
    const accountHandler = new AccountHandler();

    const username = 'testuser5';
    const password = 'testpassword';
  
    const loginResult = await accountHandler.authenticateAccount(username, password);
  
    console.log(loginResult);
  }

// Call the test function
// testCreateUser();

testLogin();