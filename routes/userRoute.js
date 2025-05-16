const express = require('express')
const router = express.Router() 
const { validateToken , verifyUserToken } = require('../helper/index.js')

// user auth routes starts here
    router.post('/register', require('../controller/User/authController').registerUser);
    router.post('/login'  , require('../controller/User/authController').loginUser);
// user auth routes end here


// order routes starts here
    router.post('/order' , validateToken , verifyUserToken , require('../controller/User/orderController').createOrder);
// order routes end here


module.exports = router;