/** @format */

// //importing required things

const functions = require("firebase-functions");
const app = require("express")();
const { getAllScreams } = require("./handler/screams");

//utilAndHandle

// const {
//   getAllScreams,
//   postOneScream,
//   getOneScream,
//   commentOnScream,
//   likeOnScream,
// } = require("./handler/screams");

// const {
//   signUp,
//   logIn,
//   uploadImage,
//   getUserDetails,
//   getOwnUserDetails,
// } = require("./handler/users");
// const FbAuth = require("./util/FbAuth");

app.get("/screams", getAllScreams);

// //signUp Route

// app.post("/signUp", signUp);
// app.post("/logIn", logIn);
// app.post("/user/image", FbAuth, uploadImage);
// app.get("/users/:handle", getUserDetails);
// app.get("/user", FbAuth, getOwnUserDetails);

// //screamroute

// app.post("/scream", FbAuth, postOneScream);
// app.get("/screams/:screamId", getOneScream);
// app.post("/scream/:screamId/comment", FbAuth, commentOnScream);
// app.get("/scream/:screamId/like", FbAuth, likeOnScream);
// app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
// app.delete("/scream/:screamId", FBAuth, deleteScream);

app.get("/", (req, res) => {
  res.send("hello");
});

exports.api = functions.https.onRequest(app);
