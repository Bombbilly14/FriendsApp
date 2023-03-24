import express from "express"

const router = express.Router();

//controllers

import { signup, signin, forgotPassword, resetPassword, getAllUsers, uploadImage, updatePassword, getUserById  } from '../controllers/auth.js';
import { sendPrivateMessage, getPrivateMessage } from '../controllers/message.js'


router.get("/", (req, res) => {
    return res.json({
        data: "hello world from API",
    })
})

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/users", getAllUsers)
router.post("/upload-image", uploadImage)
router.post("/update-password",updatePassword)
router.post('/messages', sendPrivateMessage)
router.get('/messages/:userId1/:userId2', getPrivateMessage)
router.get('/:userId', getUserById);

export default router