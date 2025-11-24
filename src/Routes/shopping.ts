import { Router } from "express";
import { authenticate } from "../Middleware/Auth.ts";
import ShoppingController from "../Controller/ShoppingController.ts";

const router = Router()
const controller = new ShoppingController();

router.get("/", authenticate, controller.getAllShopping);
router.get("/:id", authenticate, controller.getShoppingById);
router.post("/", authenticate, controller.createShopping);
router.put("/:id", authenticate, controller.updateShopping);
router.delete("/:id", authenticate, controller.deleteShopping);


export default router;