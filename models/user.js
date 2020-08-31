var passportLocalMongoose = require("passport-local-mongoose");
var mongoose = require("mongoose");
var Scheme = mongoose.Schema;

var User = new Scheme(
  {
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    candidate: {
      type: Boolean,
      default: false,
    },
    accepted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    organization: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
