const express = require('express');
const { createUser, loginUserCtrl, getallUser, getsingleuser, Deletesingleuser, updateUser, blockUser, UnblockUser, handleRefreshToken, logoutUserCntrl, updatePassword } = require('../Controllers/UserCntrl');
const {AuthMiddleware, isAdmin } = require('../Middlerware/authmiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/updatepassword', AuthMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.get('/logout', logoutUserCntrl);
router.get('/allusers',AuthMiddleware,isAdmin, getallUser);
router.get("/refresh", handleRefreshToken);
router.get('/single-user/:id',AuthMiddleware, isAdmin,getsingleuser);
router.delete('/delete-user/:id',AuthMiddleware,isAdmin, Deletesingleuser);
router.put('/update-user/:id',AuthMiddleware, isAdmin, updateUser);
router.put("/block-user/:id", AuthMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", AuthMiddleware, isAdmin, UnblockUser);
router.put("/refresh", handleRefreshToken);


module.exports = router
