var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var authenticate = require("../authenticate");
var User = require("../models/user");

router.get("/", (req, res, next) => {
  Post.find({})
    .then(
      (data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyEmployer,
  (req, res, next) => {
    var data = req.body;
    data.postedBy = req.user._id;
    User.findById(req.user._id)
      .then(
        (usrdata) => {
          data.organization = usrdata.organization;
          Post.create(data)
            .then(
              (data) => {
                console.log("Post Created ");
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(data);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

router.delete("/", (req, res, next) => {
  Post.remove({});
});

router.put(
  "/:postId",
  authenticate.verifyUser,
  authenticate.verifyEmployer,
  (req, res, next) => {
    Post.findById(req.params.postId)
      .then(
        (data) => {
          if (data.postedBy.equals(req.user._id)) {
            data.title = req.body.title;
            data.description = req.body.description;
            data.salary = req.body.salary;
            data
              .save()
              .then(
                (data) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ success: true });
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            var err = new Error("you are not allowed to do thi soperation");
            next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

module.exports = router;