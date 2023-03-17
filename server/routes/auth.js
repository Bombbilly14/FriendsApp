import express from "express"

const router = express.Router();

//controllers

import { signup, signin, forgotPassword, resetPassword, getAllUsers } from '../controllers/auth.js';


router.get("/", (req, res) => {
    return res.json({
        data: "hello world from API",
    })
})

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/users", getAllUsers);

export default router