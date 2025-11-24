import { Router } from "express";
import { authenticate } from "../Middleware/Auth.ts";
import ClassificationController from "../Controller/ClassificationController.ts";


const router = Router()
const controller = new ClassificationController();

//get do mix
router.get("/mix", authenticate, controller.getAllMix);
router.get('/mix/:id', authenticate, controller.getMixById);

//rotas da classificação
router.post("/", authenticate, controller.createClassification);
router.post("/many", authenticate, controller.createManyClassifications);
router.put("/:id", authenticate, controller.updateClassification);
router.delete('/:id', authenticate, controller.deleteClassification);

//rotas do segmento
router.post('/segment', authenticate, controller.createSegment);
router.post('/segment/many', authenticate, controller.createManySegments);
router.put("/segment/:id", authenticate, controller.updateSegment);
router.delete("/segment/:id", authenticate, controller.deleteSegment);

//rotas das atividades

router.post("/segment/activity", authenticate, controller.createActivity);
router.post("/segment/activity/many", authenticate, controller.createManyActivity);
router.put("/segment/activity/:id", authenticate, controller.updateActivity);
router.delete("/segment/activity/:id", authenticate, controller.deleteActivity);



export default router;