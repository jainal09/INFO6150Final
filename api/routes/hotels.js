import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
  getBookings
} from "../controllers/hotel.js";
import Hotel from "../models/Hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET
router.get("/find/:id", getHotel);

//GET ALL
router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
router.get("/bookings", verifyAdmin, getBookings)

//GET HOTELS BY TYPE
router.get("/type/:type", async (req, res, next) => {
  const type = req.params.type;
  try {
    const hotels = await Hotel.find({ type: { $regex: new RegExp(`^${type}$`, 'i') } }); // Use $regex with 'i' option for case insensitivity
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
});

export default router;
