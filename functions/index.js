/** @format */

// //importing required things

const functions = require("firebase-functions");
const {
  getAllScreams,
  postOneScream,
  getOneScream,
  commentOnScream,
  likeOnScream,
} = require("./handlers/screams");
const {
  signUp,
  logIn,
  getUserDetails,
  uploadImage,
  getOwnUserDetails,
} = require("./handlers/users");
const FbAuth = require("./util/FbAuth");
const app = require("express")();

//scream Route

app.get("/screams", getAllScreams);
app.post("/scream", FbAuth, postOneScream);
app.get("/scream/:screamId", getOneScream);
app.post("/scream/:screamId/comment", FbAuth, commentOnScream);
app.post("/scream/:screamId/like", FbAuth, likeOnScream);

//user Route

app.post("/singUp", signUp);
app.post("/logIn", logIn);
app.get("/user/:handle", FbAuth, getUserDetails);
app.post("/user/image", FbAuth, uploadImage);
app.get("/user", FbAuth, getOwnUserDetails);

exports.api = functions.https.onRequest(app);
