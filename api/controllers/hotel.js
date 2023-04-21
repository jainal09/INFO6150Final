import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Bookings from "../models/Bookings.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, city, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      city: { $regex: new RegExp(city, 'i') },
      ...others,
      // cheapestPrice: { $gt: min | 1, $lt: max || 9999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
export const getHotelsByType = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ type: req.params.type });
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: { $regex: new RegExp(city, "i") } });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartments" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villas" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};

// get all the bookings from the Booking model
export const getBookings = async (req, res, next) => {
  try {

    const bookings = await Bookings.find()
      .populate({
        path: "hotel",
        select: "name city country title photos",
      }
      ) // Populate the 'hotel' field with all its data
      .populate("user") // Populate the 'user' field with all its data
      // get room id from the current Bookings document
      .populate({
        path: "room", // Specify the 'room' field to populate
        select: "title price desc", // Specify the fields to include/exclude in the populated 'room' document
      }); // Populate the 'room' field with all its data});
    const response = {
      status: 200,
      count: bookings.length,
      data: bookings,
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}