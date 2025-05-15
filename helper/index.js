const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config();


exports.generateToken = (user) => {
    try {
      const token = jwt.sign(
        {
          _id: user._id,  
          email: user.email,
          role : user.role
          // name: user.name,
          // isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return token;
    } catch (error) {
      console.log("=========>",error)
    }
  };
  
  exports.validateToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.json(ApiResponse({}, { error: "Invalid Token" }, false));
    }
  };
  
  exports.verifyAdminToken =   (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async(err, authData) => {
      if (err) {
        //res.json(ApiResponse({}, { error: "Invalid Token" }, false));
        res.json({ message : "Token is Invalid"})
      } else {
        req.user = authData;
        const checkAdmin = await userModel.findOne({ role :  req.user.role  })
        if(checkAdmin.role === "ADMIN"){
          next();
        }
      }
    });
  };

  exports.verifyUserToken =   (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async(err, authData) => {
      if (err) {
        //res.json(ApiResponse({}, { error: "Invalid Token" }, false));
        res.json({ message : "Token is Invalid"})
      } else {
        req.user = authData;
        const checkAdmin = await userModel.findOne({ role :  req.user.role  })
        if(checkAdmin.role === "USER"){
          next();
        }
      }
    });
  };