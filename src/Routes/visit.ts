import { Router } from "express";
import { authenticate } from "../Middleware/Auth.ts";
import { admin } from "../Middleware/Role.ts";
import VisitController from "../Controller/VisitController.ts";

const router = Router();
const controller = new VisitController();

router.get('/shopping/:id', authenticate, controller.getVisitByShoppingId);
router.get("/details/:id", authenticate, controller.getVisitDetails);
router.get("/", authenticate, controller.getAllVisits);
router.get('/:visit_id/:compare_id', authenticate, controller.compare);
router.post('/', authenticate, controller.create);
router.delete('/:id', authenticate, admin, controller.delete);
export default router;