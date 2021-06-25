/** @format */

// /** @format */

// //importing required things

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();

// const express = require("express");
// const app = express();

// const db = admin.firestore();

// //importing firebase

// const firebaseConfig = {
//   apiKey: "AIzaSyByOsLf9klY32wlMpQih-I_O3aACr6huTw",
//   authDomain: "alvi-aka.firebaseapp.com",
//   projectId: "alvi-aka",
//   storageBucket: "alvi-aka.appspot.com",
//   messagingSenderId: "293992344342",
//   appId: "1:293992344342:web:6052edf6350b5a45003e37",
//   measurementId: "G-NP1H3YN9C5",
// };
// const firebase = require("firebase");
// firebase.initializeApp(firebaseConfig);

// //Get and post data request

// //get data

// app.get("/screams", (req, res) => {
//   db.collection("screams")
//     .orderBy("createdAt", "desc")
//     .get()
//     .then((data) => {
//       let screams = [];

//       data.forEach((doc) => {
//         screams.push({
//           screamId: doc.id,
//           body: doc.data().body,
//           userHandle: doc.data().userHandle,
//           createdAt: doc.data().createdAt,
//         });
//       });

//       return res.json(screams);
//     })
//     .catch((err) => console.error(err));
// });

// //post one scream

// const FBauth = (req, res, next) => {
//   let idToken;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     idToken = req.headers.authorization.split("Bearer ")[1];
//   } else {
//     console.error("No token found");
//     return res.status(403).json({ error: "Unautorized" });
//   }

//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then((decodedToken) => {
//       req.user = decodedToken;
//       console.log(decodedToken);
//       return admin
//         .firestore()
//         .collection("users")
//         .where("userId", "==", req.user.uid)
//         .limit(1)
//         .get();
//     })
//     .then((data) => {
//       req.user.handle = data.docs[0].data().handle;
//       return next();
//     })
//     .catch((err) => {
//       console.error("Error while verifying token", err);
//       return res.status(403).json(err);
//     });
// };

// app.post("/scream", FBauth, (req, res) => {
//   if (req.body.body.trim() === "") {
//     return res.status(403).json({ body: "Body must not be empty" });
//   }
//   const newScream = {
//     body: req.body.body,
//     userHandle: req.user.handle,
//     createdAt: new Date().toISOString(),
//   };

//   db.collection("screams")
//     .add(newScream)
//     .then((doc) => {
//       res.json({ message: `Document ${doc.id} created successfully ` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Something went wrong" });
//       console.log(err);
//     });
// });

// //signUp route

// const isEmpty = (string) => {
//   if (string.trim() === "") {
//     return true;
//   } else return false;
// };

// const isEmail = (email) => {
//   const emailRegEx =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   if (email.match(emailRegEx)) {
//     return true;
//   } else return false;
// };

// app.post("/signUp", (req, res) => {
//   const newUser = {
//     email: req.body.email,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword,
//     handle: req.body.handle,
//   };

//   //todo Validation

//   const errors = {};

//   if (isEmpty(newUser.email)) {
//     errors.email = "Must not be empty";
//   } else if (!isEmail(newUser.email)) {
//     errors.email = "Must be a valid email adress";
//   }

//   if (isEmpty(newUser.password)) {
//     errors.password = "Must not be empty";
//   }
//   if (isEmpty(newUser.handle)) {
//     errors.handle = "Must not be empty";
//   }
//   if (isEmpty(newUser.confirmPassword)) {
//     errors.confirmPassword = "Must not be empty";
//   }

//   if (newUser.password !== newUser.confirmPassword) {
//     errors.confirmPassword = "Password must match";
//   }

//   if (Object.keys(errors).length > 0) {
//     return res.status(400).json(errors);
//   }

//   //singUp credentials

//   let token, userId;

//   db.doc(`/users/${newUser.handle}`)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         return res.status(400).json({ handle: "this handle is already taken" });
//       } else {
//         return firebase
//           .auth()
//           .createUserWithEmailAndPassword(newUser.email, newUser.password);
//       }
//     })
//     .then((data) => {
//       userId = data.user.uid;
//       return data.user.getIdToken();
//     })
//     .then((idtoken) => {
//       token = idtoken;
//       const userCredentials = {
//         handle: newUser.handle,
//         email: newUser.email,
//         createdAt: new Date().toISOString(),
//         userId,
//       };

//       return admin
//         .firestore()
//         .doc(`/users/${newUser.handle}`)
//         .set(userCredentials);
//     })
//     .then(() => {
//       return res.status(201).json({ token });
//     })
//     .catch((err) => {
//       console.error(err);

//       if (err.code == "auth/email-already-in-use") {
//         return res.status(400).json({ error: "Email is already in use" });
//       } else {
//         res.status(500).json({ error: err.code });
//       }
//     });
// });

// //login Route

// app.post("/logIn", (req, res) => {
//   const user = {
//     email: req.body.email,
//     password: req.body.password,
//   };
//   const errors = {};

//   if (isEmpty(user.email)) {
//     errors.email = "Must not be empty";
//   } else if (!isEmail(user.email)) {
//     errors.email = "Enter a valid email address";
//   }

//   if (isEmpty(user.password)) {
//     errors.password = "Must not be empty";
//   }

//   if (Object.keys(errors).length > 0) {
//     return res.status(400).json(errors);
//   }

//   firebase
//     .auth()
//     .signInWithEmailAndPassword(user.email, user.password)
//     .then((data) => {
//       return data.user.getIdToken();
//     })
//     .then((token) => {
//       return res.json({ token });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.code == "auth/wrong-password") {
//         return res.status(503).json({ general: "Wrong email or password" });
//       } else {
//         return res.status(500).json({ error: err.code });
//       }
//     });
// });

// exports.api = functions.https.onRequest(app);
