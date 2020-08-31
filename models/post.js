var mongoose = require("mongoose");
var Scheme = mongoose.Schema;

var Post = new Scheme(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    requirements: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", Post);
