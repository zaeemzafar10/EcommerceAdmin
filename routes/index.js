const express = require('express')
const router = express.Router() 

// admin
router.use('/admin', require('./adminroute.js'))
router.use('/user', require('./userRoute.js'))

module.exports = router;