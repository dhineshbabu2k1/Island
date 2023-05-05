const jwtConfig = require("../config/jwt-config");
const JWT = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let userToken = req.headers["authorization"];
  var error;
  if (userToken) {
    //verify if client
    JWT.verify(userToken, jwtConfig.AdminSecret, (err, decoded) => {
      if (err) {
        error = err;
        let data = { msg: "token", err: error.message, status: false };
        return res.status(500).send(data);
      } else {
        req.user = decoded;
        console.log(req.user);
        next();
      }
    });
  } else {
    //we dont have token
    let data = {
      msg: "token",
      err: "Session expired, Please login again",
      status: false,
    };
    res.status(500).send(data);
  }
};
