const express = require('express')
const router = express.Router() 
const {  validateToken , verifyAdminToken } = require('../helper/index.js')
// admin auth api starts here
     router.post('/register', require('../controller/Admin/authController').registerAdmin);
     router.post('/login', require('../controller/Admin/authController').loginAdmin);
// admin auth api end here


// category api starts here
     router.post('/category/create' ,  validateToken , verifyAdminToken , require('../controller/Admin/categoryController').createCategory);
     router.get('/category/get' , require('../controller/Admin/categoryController').getAllCategories);
// category api end here

// product api starts here
     router.post('/product' , validateToken , verifyAdminToken , require('../controller/Admin/productController').createProduct);
     router.get('/product/get' , require('../controller/Admin/productController').getAllProducts);
     router.put('/product/edit/:id' , validateToken , verifyAdminToken , require('../controller/Admin/productController').editProduct);
// product api end here


// sales api starts here
    // router.get('/sales');
    // router.get('/revenue');
// sales api end here


module.exports = router;