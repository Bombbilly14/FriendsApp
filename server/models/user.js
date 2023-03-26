import mongoose from "mongoose";
import Message from './message.js';

const { Schema } = mongoose;


const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64,
        },
        role: {
            type: String,
            default: "Subscriber",
        },
        sentRequests: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        friendRequests: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        friends: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        image: {
            public_id: String,
            url: String,
        },
        resetCode: {
            type: String,
            default: "",
        },
        sentMessages: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Message',
          },
        ],
        receivedMessages: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Message',
          },
        ],
      },
      { timestamps: true }
    );
export default mongoose.model("User", userSchema);
