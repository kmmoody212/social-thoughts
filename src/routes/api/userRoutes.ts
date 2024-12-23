import { Router } from "express";
const router = Router();
import {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend,
} from "../../controllers/userController.js"; // User controller functions

// Routes for base/ root URL
// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/friends/:userId
router.route("/friends/:userId").post(createFriend).delete(deleteFriend);

export default router;