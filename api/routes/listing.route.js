import express from 'express';
import {verifyToken} from '../utils/verifyToken.js'
import { createListing,deleteListing,updateListing,getListing,getAllListing } from '../controller/listing.controller.js';
const router=express.Router();


router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/get/:id',verifyToken,getListing)
router.get('/get/',getAllListing)

export default router;