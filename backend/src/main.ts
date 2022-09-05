import path from "path";
import cors from "cors";
import express, { Request, Response } from "express";
import { api } from "./api";
import cookieParser from "cookie-parser";
import { FileDb } from "./FileDb";
import { PORT } from "./config";

const main = async () => {
    const app = express(); // create express app

    const database = new FileDb();
    await database.initialize();

    app.use(cors()); // enables cors
    app.use(express.json({ limit: "2mb" })); // enables use of json in requests
    app.use(cookieParser()); // enables use of cookies

    app.use("/api", api(database));
    app.use("/", express.static("../frontend/public"));

    app.get("/product/:_id", (req: Request, res: Response) => {
        const newPath = path.resolve(
            __dirname + "/../../frontend/public/product/index.html",
        );
        res.sendFile(newPath);
    });

    app.listen(PORT, () => console.log("express hosted on port:", PORT)); // starts the express app with port PORT
};
main();
