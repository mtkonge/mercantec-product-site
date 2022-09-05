import { Database } from "./Database";
import { Request, Response, Router } from "express";
import { doesExist, checkSession } from "./utils";
import { Order } from "./Models";
import { mailSend } from "./mail";

export const orderApiRoutes = (router: Router, database: Database) => {
    router.post("/order/create", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Not logged in" });

        const user = await database.findUserById(session.userId);

        if (user === null) return res.json({ msg: "Not logged in" });

        const productId = req.body.productId;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const mail = req.body.mail;
        const phone = req.body.phone;
        const details = req.body.details;

        if (
            !doesExist([productId, firstName, lastName, mail, phone, details])
        ) {
            return res.json({ msg: "Missing input" });
        }

        const product = await database.findProductById(productId);
        if (product === null) {
            return res.json({ msg: "Unknown product" });
        }

        if (details.length > 1000) {
            return res.json({ msg: "Details field too long" });
        }

        const order = new Order(
            productId,
            firstName,
            lastName,
            mail,
            phone,
            details,
        );

        await database.addOrder(order);

        mailSend(order, product.title);

        return res.json({ msg: "Ok" });
    });

    router.get("/order/all", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        return res.json({ msg: "Ok", data: await database.getAllOrders() });
    });
    router.post("/order/remove/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        const order = await database.findOrderById(id);

        if (order === null) return res.json({ msg: "Invalid order" });

        const removedOrder = await database.removeOrder(order);

        if (removedOrder === null) return res.json({ msg: "Invalid order" });

        return res.json({ msg: "Ok" });
    });
    router.post("/order/archive/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        const order = await database.findOrderById(id);

        if (order === null) return res.json({ msg: "Invalid order" });

        const archivedOrder = await database.archiveOrder(id);

        if (archivedOrder === null) return res.json({ msg: "Invalid order" });

        return res.json({ msg: "Ok" });
    });
    router.post("/order/unarchive/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        const order = await database.findOrderById(id);

        if (order === null) return res.json({ msg: "Invalid order" });

        const unarchivedOrder = await database.unarchiveOrder(id);

        if (unarchivedOrder === null) return res.json({ msg: "Invalid order" });

        return res.json({ msg: "Ok" });
    });
};
