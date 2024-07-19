const { verifySign } = require("../jwt/jwt");
const User = require("../models/user.model");

const isAuth = async (req, res, next) => {
    // console.log(req.headers);
    const authorization = req.headers.authorization;
    console.log('autorizado',authorization);
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no provided" });
    }
    try {
      var tokenVerified = verifySign(token);
      const userLogged = await User.findById(tokenVerified.id).populate("pets favPets inProcessPets");
      userLogged.password = null;
      req.user = userLogged;
      next() 
  } catch (error) {
    return res.status(500).json(error);
  }
  next() 
};



module.exports = { isAuth };