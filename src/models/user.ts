import { Schema, Document, model } from "mongoose";

// Define TS interface
interface IUser extends Document {
  username: String;
  email: String;
  thoughts: Schema.Types.ObjectId[]; // Array references user's thoughts
  friends: Schema.Types.ObjectId[]; // Array references user's friends
}

// Define user schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true, // Removes extra whitespace from the input
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      match: [/.+@.+\..+/, 'Enter valid email'], //Regex; validates format
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thoughts", // Ref thoughts collection
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, // Include virtual properties when converting the schema to JSON
    },
    id: false, // Exclude the automatic id field
  }
);

// Define a virtual property 'friendCount' to calculate the number of friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create a Mongoose model named 'users' based on the User schema
const User = model("users", userSchema);

export default User;