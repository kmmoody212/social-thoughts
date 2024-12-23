import { Router } from "express";
const router = Router();
import thoughtRoutes from "./thoughtRoutes.js";
// NEED TO CREATE /////////////////////////// import userRoutes from "./userRoutes.js";

router.use("/thoughts", thoughtRoutes);
// NEED TO CREATE   ///////////////////////// router.use("/users", userRoutes);

export default router; // Export thoughtRoutes and userRoutes to main app
