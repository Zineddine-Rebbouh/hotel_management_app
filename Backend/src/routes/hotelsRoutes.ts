import express from 'express'
import { getHotelById, searchHotels } from "../Controllers/hotelsController";
import { param } from 'express-validator';

const router = express.Router()
router.get('/search', searchHotels);
router.get('/:id', param("id").notEmpty().withMessage("Params is required "), getHotelById)


export default router;