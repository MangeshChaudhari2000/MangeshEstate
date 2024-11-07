import express from "express";
import { test, updateUser,deleteUser ,getUserListing,getUser} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
const router=express.Router();

router.get('/test',test)
router.post('/update/:id',verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listings/:id',verifyToken,getUserListing)
router.get('/getUser/:id',verifyToken,getUser)

export default router;