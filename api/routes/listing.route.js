import express from 'express';
import { verifyToken } from '../utils/verifyToken.js'
import { createListing, createPaymentIntent, deleteListing, updateListing, getListing, getAllListing, contactOwnerVerify } from '../controller/listing.controller.js';
const router = express.Router();


router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)
router.get('/contactOwnerVerify/:listId', verifyToken, contactOwnerVerify)
router.get('/get/:id', verifyToken, getListing)
router.get('/get/', getAllListing)
router.post("/create-payment-intent/:amount",verifyToken, createPaymentIntent)
export default router;