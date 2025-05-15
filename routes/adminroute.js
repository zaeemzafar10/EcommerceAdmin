const express = require('express')
const router = express.Router() 

// admin auth api starts here
     router.post('/register', require('../controller/Admin/authController').registerAdmin);
     router.post('/login', require('../controller/Admin/authController').loginAdmin);
// admin auth api end here


// category api starts here
    // router.post('/category');
    // router.post('/category/get');
// category api end here

// product api starts here
    // router.post('/product');
    // router.post('/product/get');
    // router.put('/product/edit/:id');
// product api end here


// sales api starts here
    // router.get('/sales');
    // router.get('/revenue');
// sales api end here


module.exports = router;