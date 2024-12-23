import { User } from "../models/index.js"; // Import the User model
import { Request, Response } from "express"; // Import Request and Response types from Express

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    // Send the list of users as JSON response
    res.json(users);
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }
};

// Get a single user by ID
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    // Find the user by ID, excluding the "__v" field
    const user = await User.findOne({ _id: req.params.userId })
      .populate("friends")
      .populate("thoughts")
      .select("-__v");

    // If the user is not found, return a 404 error
    if (!user) {
      res.status(404).json({ message: "User not found by ID" });
    } else {
      // Send the found user as a JSON response
      res.json(user);
    }
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // Create a new user with the data from the request body
    const dbUserData = await User.create(req.body);
    // Send the created user's data as a JSON response
    res.json(dbUserData);
  } catch (err) {
    // Handle server error
    console.error(err);
    res.status(500).json(err);
  }
};

// Update an existing user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Find the user by ID and update their data with the request body
    const user = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true }
    );

    // If the user is not found, return a 404 error
    if (!user) {
      res.status(404).json({ message: "User not found by ID" });
    } else {
      // Send the updated user as a JSON response
      res.status(200).json(user);
    }
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete({ _id: req.params.userId });

    // If the user is not found, return a 404 error
    if (!user) {
      res.status(404).json({ message: "User not found by ID" });
    } else {
      // Send a success message
      res.status(200).json("Successfully deleted user");
    }
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }
};

// Add a friend to a user's friend list
export const createFriend = async (req: Request, res: Response) => {
  try {
    // the friend's user and email that will be entered in the req.body
    const person2 = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body
    );
    // the person adding the friend
    // their id will be in the req params
    // this person shows an increased friendCount
    const person1 = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { friends: person2 } },
      { new: true }
    );

    // successful response if added correctly
    res.status(200).json(person1);
    // Handle error
  } catch (err) {
    res.status(500).json(err);
  }
};

// Remove a friend from a user's friend list
// [person 2's id will need to be in req.params]
export const deleteFriend = async (req: Request, res: Response) => {
  try {
    // Find the friend to remove by their ID
    const friend = await User.findById(req.params.userId);

    // If the friend is not found, return a 404 error
    if (!friend) {
      return res.status(404).json({ message: "User not found by ID" });
    }

    // Remove the friend from all users' friend lists
    await User.updateMany(
      { friends: friend._id },
      { $pull: { friends: friend._id } },
      { new: true }
    );

    // Send a success message
    return res.status(200).json({ message: "Friend successfully deleted" });
  } catch (err) {
    // Handle server error
    return res.status(500).json(err);
  }
};
