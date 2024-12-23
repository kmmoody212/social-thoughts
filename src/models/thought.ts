import { Schema, model, Document } from "mongoose";
import Reaction from "./reaction.js";

// Define the TypeScript interface for a Thought document, extending Mongoose's Document
interface IThought extends Document {
  thoughtText: String;
  createdAt: Date;
  username: Schema.Types.ObjectId; // Reference to the user who created the thought
  reactions: (typeof Reaction)[]; // An array of Reaction subdocuments
}

// Define the Thought schema
const thoughts = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought text required"],
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default to the current date and time
      get: (value: Date) => new Date(value.toLocaleString()), // Use a getter to format the date
    },
    username: {
      type: Schema.Types.ObjectId, // Reference to another document by ObjectId
      ref: "user", // Reference the User collection
      required: [true, "Username required"],
    },
    // Array of Reaction subdocuments
    reactions: [Reaction],
  },
  {
    toJSON: {
      virtuals: true, // Include virtual properties when the schema is converted to JSON
      getters: true, // Enable getters when converting to JSON
    },
    id: false, // Disable the creation of a duplicate `id` field
  }
);
// Define a virtual property 'reactionCount' to calculate the number of reactions
thoughts.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create a Mongoose model named 'thoughts' based on the Thought schema
const Thought = model("thoughts", thoughts);

export default Thought;
