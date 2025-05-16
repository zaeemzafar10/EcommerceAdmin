const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config();


exports.generateToken = (user) => {
    try {
      const token = jwt.sign(
        {
          id: user.id,  
          email: user.email,
          role : user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
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
      return res.status(400).json({ error: 'Invalid Token' });
    }
  };
  
  exports.verifyAdminToken =   (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async(err, authData) => {
      if (err) {
        console.log(err);
        res.json({ message : "Token is Invalid"})
      } else {
        req.user = authData;
        const checkAdmin = await prisma.user.findFirst({ where : { role :  req.user.role  }})  
        if(checkAdmin.role === "ADMIN"){
          next();
        }else{
            res.json({ message : "You are not ADMIN"})
          }
      }
    });
  };

  exports.verifyUserToken =   (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async(err, authData) => {
        if (err) {
          console.log(err);
          
          res.json({ message : "Token is Invalid"})
        } else {
          req.user = authData;
          const checkAdmin = await prisma.user.findFirst({ where : { role :  req.user.role  }})  
          if(checkAdmin.role === "USER"){
            next();
          }else{
              res.json({ message : "You are not USER"})
            }
        }
      });
  };