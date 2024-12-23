import { Thought, User } from "../models/index.js"; // Import Thought and User models
import { Request, Response } from "express"; // Import Request and Response types from Express

// Get all thoughts
export const getThoughts = async (_req: Request, res: Response) => {
  try {
    // Fetch all thoughts from the database
    const thoughts = await Thought.find();
    // Send the thoughts as JSON response
    res.json(thoughts);
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }
};

// Get a single thought by ID
export const getSingleThought = async (req: Request, res: Response) => {
  try {
    // Find a thought by its ID in the request parameters
    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    // If no thought is found, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }

    // Send the found thought as a JSON response
    res.json(thought);
    return;
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
  }

  return;
};

// Create a new thought and associate it with a user
export const createThought = async (req: Request, res: Response) => {
  try {
    // Find the user by the username provided in the request body
    const user = await User.findOne({ username: req.body.username });
    // Create a new thought with the data from the request body
    const thought = await Thought.create({
      thoughtText: req.body.thoughtText,
      username: user?._id,
    });

    // If the user doesn't exist, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found by username" });
    }

    // Add the thought's ID to the user's thoughts array
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    // Send a success message
    res.status(201).json("Thought successfully created");
  } catch (err) {
    res.status(500).json(err);
  }
  return;
};

// Update an existing thought by ID
export const updateThought = async (req: Request, res: Response) => {
  try {
    // Update the thought's data using the request body and validate changes
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Send the updated thought as a JSON response
    res.json(thought);
    return;
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
    return;
  }
};

// Delete a thought by ID and remove it from the associated user's thoughts array
export const deleteThought = async (req: Request, res: Response) => {
  try {
    // Find and delete the thought by its ID
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: "Thought not found by ID" });
    }

    // Remove the thought's ID from the associated user's thoughts array
    const user = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    // If the user doesn't exist, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found by ID" });
    }

    // Send a success message
    res.json({ message: "Thought successfully deleted" });
    return;
  } catch (err) {
    // Handle server error
    res.status(500).json(err);
    return;
  }
};

// Add a reaction to a thought
export const addThoughtReaction = async (req: Request, res: Response) => {
  try {
    // Find the thought by ID and add the reaction to its reactions array
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Send the updated thought as a JSON response
    res.json(thought);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};

// Remove a reaction from a thought
export const removeThoughtReaction = async (req: Request, res: Response) => {
  try {
    // Find the thought by ID and remove the reaction by reaction ID
    const thought = await Thought.findOneAndUpdate(
      { "reactions.reactionId": req.params.reactionId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Send the updated thought as a JSON response
    res.json(thought);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};
