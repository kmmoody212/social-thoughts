import { Schema, Document, Types } from "mongoose";

// Define the interface for a Reaction document, extending Mongoose's Document interface
interface IReaction extends Document {
  reactionId: Schema.Types.ObjectId; // Unique ID for the reaction
  reactionBody: string;
  username: string;
  createdAt: Date; // Timestamp
}

// Define the Reaction schema
const Reaction = new Schema<IReaction>(
  {
    // Unique identifier for each reaction, defaulting to a new ObjectId
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    // The content of the reaction with a max length of 280 characters
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default to the current date and time
      get: (value: Date) => new Date(value.toLocaleString()), // Use a getter to format the date
    },
  },
  {
    // Configuration options for the schema
    toJSON: {
      getters: true, // Enable the use of getters when converting the document to JSON
    },
    _id: false, // Exclude the automatic _id field
  }
);

export default Reaction;
