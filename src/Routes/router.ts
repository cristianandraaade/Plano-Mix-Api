import { Router } from "express";
import userRoutes from "./users.js";
import storeRoutes from "./store.js"
import shoppingRoutes from "./shopping.js"
import classificationRoutes from "./classification.ts"
import visitRoutes from "./visit.ts"

const routes = Router();

routes.use('/users', userRoutes);
routes.use("/shopping", shoppingRoutes);
routes.use("/store" , storeRoutes);
routes.use("/classification", classificationRoutes);
routes.use("/visit", visitRoutes);

export default routes;