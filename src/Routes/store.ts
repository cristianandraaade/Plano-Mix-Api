import { Router } from "express";
import { authenticate } from "../Middleware/Auth.ts";
import StoreController from "../Controller/StoreController.ts";

const router = Router();
const controller = new StoreController();

router.get("/", authenticate, controller.getAllStore);
router.get("/:id", authenticate, controller.getStoreById);
router.get("/shopping/:id", authenticate, controller.getShoppingStores );
router.post("/",authenticate, controller.createStore);
router.post("/many", authenticate, controller.createManyStores);
router.put("/:id", authenticate, controller.updateStore);
router.delete("/:id", authenticate, controller.deleteStore);




export default router;