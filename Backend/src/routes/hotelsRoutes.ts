import express from 'express'
import { searchHotels } from "../Controllers/hotelsController";

const router = express.Router()
router.get('/search', searchHotels);

export default router;