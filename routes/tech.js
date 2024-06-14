import express from "express";
import {get, getById} from "../controllers/tech_controller.js";

const router = express.Router();

router.get('/', get)
router.get('/:id', getById);

export default router