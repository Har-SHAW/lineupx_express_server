var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../authenticate");

router.get("/", (req, res, next) => {
  User.find({})
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// router.delete("/", (req, res, next) => {
//   User.remove({})
//     .then(
//       (user) => {
//         res.statusCode = 200;
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// });

router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.accepted = [];
        user.rejected = [];
        if (req.body.organization) user.organization = req.body.organization;
        if (req.body.candidate) user.candidate = req.body.candidate;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

router.put("/accept/:postId", authenticate.verifyUser,authenticate.verifyCandidate, (req, res, next) => {
  User.findById(req.user._id)
    .then(
      (data) => {
        let acc = data.accepted;
        let rej = data.rejected;
        for (let i = 0; rej.length; i++) {
          if (rej[i].equals(req.params.postId)) {
            rej.splice(i, 1);
          }
        }
        if (!acc.includes(req.params.postId)) {
          acc.push(req.params.postId);
        }
        data.accepted = acc;
        data.rejected = rej;
        data.save().then((data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ sucess: true });
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.put("/reject/:postId", authenticate.verifyUser,authenticate.verifyCandidate, (req, res, next) => {
  User.findById(req.user._id)
    .then(
      (data) => {
        let rej = data.rejected;
        let acc = data.accepted;
        for (let i = 0; i < acc.length; i++) {
          if (acc[i].equals(req.params.postId)) {
            acc.splice(i, 1);
          }
        }
        if (!rej.includes(req.params.postId)) {
          rej.push(req.params.postId);
        }
        data.rejected = rej;
        data.accepted = acc;
        data.save().then((data) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ sucess: true });
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = router;
