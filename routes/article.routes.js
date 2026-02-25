import express from "express";
import { ping } from "../controllers/articles.controller.js";

const router = express.Router();

router.get("/ping", ping);

export default router;
