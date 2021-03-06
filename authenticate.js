var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jst = require("jsonwebtoken");

var config = require("./config.js");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jst.sign(user, config.secretKey, { expiresIn: 3600 });
};

exports.verifyCandidate = (req, res, next) => {
    if(req.user.candidate === true){
        return next();
    }else{
        err = new Error(" your token cannot access non candidate information ");
        next(err);
    }
}

exports.verifyEmployer = (req, res, next) => {
    if(req.user.candidate === false){
        return next();
    }else{
        err = new Error(" your token cannot access non employers information ");
    }
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("payload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
