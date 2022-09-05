import { Database } from "./Database";
import { Router, Request, Response } from "express";
import { doesExist, checkSession } from "./utils";
import { Product } from "./Models";

export const productApiRoutes = (router: Router, database: Database) => {
    router.post("/product/create", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        const title = req.body.title;
        const content = req.body.content;
        const image = req.body.image;

        if (!doesExist([title, content, image])) {
            return res.json({ msg: "Missing input" });
        }

        if (title.length < 1 || title.length > 100)
            return res.json({ msg: "Title invalid" });

        const product = new Product(title, content, image);

        await database.addProduct(product);

        return res.json({ msg: "Ok", data: product });
    });

    router.post("/product/remove/:id", async (req: Request, res: Response) => {
        const session = await checkSession(req, database);

        if (session === null) return res.json({ msg: "Unauthorized" });

        const user = await database.findUserById(session.userId);

        if (user === null || user.admin === false)
            return res.json({ msg: "Unauthorized" });

        const id = parseInt(req.params.id);
        const product = await database.findProductById(id);

        if (product === null) return res.json({ msg: "Invalid product" });

        database.removeProduct(product);

        return res.json({ msg: "Ok" });
    });

    router.get("/product/all", async (req: Request, res: Response) => {
        return res.json({ msg: "Ok", data: await database.getAllProducts() });
    });

    router.get("/product/one/:id", async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const product = await database.findProductById(id);

        if (product === null) return res.json({ msg: "Invalid product" });

        return res.json({ msg: "Ok", data: product });
    });
    return router;
};
