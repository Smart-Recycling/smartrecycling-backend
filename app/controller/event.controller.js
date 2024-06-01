import dbPool from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const getEvent = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    // Your existing code to fetch events goes here
    const events = await dbPool.query("SELECT * FROM Event");

    res.json({
      status: 200,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, path_image, user_id } = req.body;

    const [userResult] = await dbPool.query("SELECT * FROM User WHERE id = ?", [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const [createdEvent] = await dbPool.query("INSERT INTO Event (title, description, path_image, user_id) VALUES (?, ?, ?, ?)", [title, description, path_image, user_id]);

    res.status(201).json({
      status: 201,
      data: createdEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id; // Assuming you have a route parameter for the event ID
    const { title, description, path_image, user_id } = req.body;

    // Check if the event exists
    const [existingEvent] = await dbPool.query("SELECT * FROM Event WHERE id = ?", [eventId]);

    if (existingEvent.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Event not found",
      });
    }

    // Check if the user exists
    const [userResult] = await dbPool.query("SELECT * FROM User WHERE id = ?", [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Update the event
    await dbPool.query("UPDATE Event SET title = ?, description = ?, path_image = ?, user_id = ? WHERE id = ?", [title, description, path_image, user_id, eventId]);

    res.json({
      status: 200,
      message: "Event updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
