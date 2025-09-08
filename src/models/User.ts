import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export const User = model("User", userSchema);

/* Flow Diagram:

Client POST /api/v1/users
       │
       ▼
Express Router (user.routes.ts)
       │
       ▼
Controller (user.controller.ts)
       │
       ▼
Mongoose Model (User)
       │
       ▼
MongoDB Database
       │
       ▼
Controller sends JSON response
       │
       ▼
Client receives created user

*/