import express from "express"
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

//controllers

import { signup, signin, forgotPassword, resetPassword, getAllUsers, uploadImage, updatePassword, getUserById, sendRequest, acceptRequest, getFriendRequests } from '../controllers/auth.js';
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
router.post('/friend-request/:id', authenticate, sendRequest)
router.get('/friend-requests', authenticate, getFriendRequests);
router.put('/friend-request/:id/accept', authenticate, acceptRequest)
router.get('/:userId', getUserById);

export default router