import { Database } from "./Database";
import { Router } from "express";
import { userApiRoutes } from "./users";
import { productApiRoutes } from "./products";
import { orderApiRoutes } from "./orders";

export const api = (database: Database) => {
    const router = Router();
    userApiRoutes(router, database);
    productApiRoutes(router, database);
    orderApiRoutes(router, database);
    return router;
};
