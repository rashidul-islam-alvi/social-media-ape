/** @format */

const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .get()
    .then((docs) => {
      let screamData = [];

      docs.forEach((doc) => {
        screamData.push({
          screamId: doc.id,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
        });
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postOneScream = (req, res) => {
  if (req.body.body.trim() == "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newScream = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    userHandle: req.user.handle,
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getOneScream = (req, res) => {
  let screamData = {};

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;

      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    likeCount: 0,
    commentCount: 0,
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
//like a scream

exports.likeOnScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;

        return likeDocument.get();
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            userHandle: req.user.handle,
            screamId: req.params.screamId,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({ error: "Scream already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// //unlike a scream

// exports.unlikeScream = (req, res) => {
//   const likeDocument = db
//     .collection("likes")
//     .where("userHandle", "==", req.user.handle)
//     .where("screamId", "==", req.params.screamId)
//     .limit(1);

//   const screamDocument = db.doc(`/screams/${req.params.screamId}`);

//   let screamData;

//   screamDocument
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         screamData = doc.data();
//         screamData.screamId = doc.id;
//         return likeDocument.get();
//       } else {
//         return res.status(404).json({ error: "Scream not found" });
//       }
//     })
//     .then((data) => {
//       if (data.empty) {
//         return res.status(400).json({ error: "Scream not liked" });
//       } else {
//         return db
//           .doc(`/likes/${data.docs[0].id}`)
//           .delete()
//           .then(() => {
//             screamData.likeCount--;
//             return screamDocument.update({ likeCount: screamData.likeCount });
//           })
//           .then(() => {
//             res.json(screamData);
//           });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ error: err.code });
//     });
// };

// // Delete a scream

// exports.deleteScream = (req, res) => {
//   const document = db.doc(`/screams/${req.params.screamId}`);
//   document
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         return res.status(404).json({ error: "Scream not found" });
//       }
//       if (doc.data().userHandle !== req.user.handle) {
//         return res.status(403).json({ error: "Unauthorized" });
//       } else {
//         return document.delete();
//       }
//     })
//     .then(() => {
//       res.json({ message: "Scream deleted successfully" });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).json({ error: err.code });
//     });
// };
