/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// This is a temporary function for testing, the functions are mainly generated by AI

const UserHandler = require('./userhandler');
const { hashPassword } = require('./utils');

async function testUserFunctions() {

    // Assume we have logged in as a user

    // const user = {
    //   userID: 4,
    //   username: 'Kalun',
    //   salt: 'dd391c003d8b186712a9ee26c9f2bb2a',
    //   password: 'ee0227a538176d65ec33d7eacf2f34c05dbffa90ee0750bf696aab3fdf5c7268bd22dc816a20aaf5bf026b1b01ecf08684058a1a76d13656d8caa7c46dbaed0b',
    //   secureqans: '123',
    //   privacy: 'public',
    //   description: null,
    //   active: true,
    //   usertype: 'user'
    // }

    // const user = {
    //   userID: 3,
    //   username: 'test3',
    //   salt: '47bcbe97174c37b83ccdef3ead4a27d1',
    //   password: 'fdf73f3f4f030663085dcd4513d4d34ac26d16845929ceeddb4a83867c0f9d9265e49ebacda4d1e90884ad0ffa1581fc9197628819de8f012b54077ec79ebef4',
    //   secureqans: '123',
    //   privacy: 'public',
    //   description: null,
    //   active: true,
    //   usertype: 'user'
    // }

    // Create a new user
    // const User = new UserHandler(user.userID, user.username, user.salt, user.password, user.usertype, user.privacy, user.active);
    const User = new UserHandler(2);

    console.log('now start testing!');

    // Test get username
    const username = await User.getUsername(1);
    console.log(username);
    const state = await User.checkRepost(1);
    console.log(state);
    // Test view own profile
    // const profile = await User.viewOwnProfile();
    // console.log(profile)

    // Test update own profile - ["username", "description", "privacy"]
    // const updatedProfile = await User.editProfile(['hehehe123', 'this is a test description', 'private']);
    // console.log(updatedProfile)

    // Test view own profile
    // const profile = await User.viewOwnProfile();
    // console.log(profile)

    // Test view other user's profile
    // const otherUser = await User.viewProfile(7);
    // console.log(otherUser)

    // Test follow user
    // const followResult = await User.followUser(4);
    // console.log(followResult)

    // Show all following
    // const following = await User.getFollowing();
    // console.log(following)

    // Test unfollow user
    // const unfollowResult = await User.unfollowUser(7);
    // console.log(unfollowResult)

    // const following2 = await User.getFollowing();
    // console.log(following2)

    // Test accept follow request
    // const acceptResult = await User.acceptFollowRequest(6);
    // console.log(acceptResult)

    // Test secure question
    // const secureResult = await User.checkSecurityAnswer('123');
    // console.log(secureResult)

    // Test reset password
    // const resetResult = await User.resetPassword('sdasdacsdasd');
    // console.log(resetResult)

    // Test send messages
    // const messageResult = await User.sendMessage(5, 'Hello33!');
    // console.log(messageResult)

    // Test receive messages
    // const messageResult = await User.getMessagesWithUser(5);
    // console.log(messageResult)

    // Test noti
    // const notiResult = await User.getNotifications();
    // console.log(notiResult)

    // Test create post
    // const postResult = await User.createPost('Hello2! #test');
    // console.log(postResult)

    // Test edit post
    // const editPostResult = await User.editPost(1, 'Hello2!2');
    // console.log(editPostResult)

    // Test get all own posts
    // const allPosts = await User.getOwnPosts();
    // console.log(allPosts)

    // Test get all following posts
    // const followingPosts = await User.getFollowingPosts();
    // console.log(followingPosts)

    // Test delete post
    // const deletePostResult = await User.deletePost(6);
    // console.log(deletePostResult)

    // Test like and unlike post
    // const likePostResult = await User.unlikePost(5);
    // console.log(likePostResult)

    // Test repost
    // const repostResult = await User.repostPost(5);
    // console.log(repostResult)

    // Test comment on a post
    // const commentResult = await User.commentPost(5, 'hehehe');
    // console.log(commentResult)

    // Test get all comments
    // const allComments = await User.getComment(5);
    // console.log(allComments)

    // Test like comment
    // const likeCommentResult = await User.likeComment(2);
    // console.log(likeCommentResult)

    // Test unlike comment
    // const unlikeCommentResult = await User.unlikeComment(1);
    // console.log(unlikeCommentResult)

    // Test edit comment
    // const editCommentResult = await User.editComment(4, 'Kalun is the best!');
    // console.log(editCommentResult)

    // Test delete comment
    // const deleteCommentResult = await User.deleteComment(1);
    // console.log(deleteCommentResult)

    // Test search by tags
    // const tagsSearchResult = await User.searchByMessageTags(["#test", "#hehe"]);
    // console.log(tagsSearchResult);

    // Test general test
    // const generalSearchResult = await User.generalSearch("hehe");
    // console.log(generalSearchResult);

    // Test check pending requests
    const pendingRequests = await User.hasPendingFollowRequest(1);
    console.log(pendingRequests);

    console.log('Test ended.')
}

testUserFunctions();