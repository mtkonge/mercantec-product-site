import { Order, Product, Session, User } from "./Models";
import { Database } from "./Database";
import { readFile, writeFile, mkdir } from "fs/promises";

export class FileDb extends Database {
    private users: User[];
    private sessions: Session[];
    private products: Product[];
    private orders: Order[];

    constructor() {
        super();
        this.users = [
            { username: "user", password: "test", id: 1, admin: true },
        ];
        this.sessions = [];
        this.products = [];
        this.orders = [];
    }

    private createFileIfDoesNotExist = async () => {
        try {
            await mkdir("./data");
        } catch {}
        try {
            await readFile("./data/products.json");
        } catch {
            await writeFile("./data/products.json", "[]");
        }
        try {
            await readFile("./data/users.json");
        } catch {
            await writeFile("./data/users.json", "[]");
        }
        try {
            await readFile("./data/orders.json");
        } catch {
            await writeFile("./data/orders.json", "[]");
        }
    };

    public initialize = async () => {
        await this.createFileIfDoesNotExist();
        const productsJSON = (
            await readFile("./data/products.json")
        ).toString();
        const products = JSON.parse(productsJSON);
        this.products = products;

        const usersJSON = (await readFile("./data/users.json")).toString();
        const users = JSON.parse(usersJSON);
        this.users = users;

        const ordersJSON = (await readFile("./data/orders.json")).toString();
        const orders = JSON.parse(ordersJSON);
        this.orders = orders;
    };

    private save = async () => {
        const usersJSON = JSON.stringify(this.users);
        await writeFile("./data/users.json", usersJSON);

        const productsJSON = JSON.stringify(this.products);
        await writeFile("./data/products.json", productsJSON);

        const ordersJSON = JSON.stringify(this.orders);
        await writeFile("./data/orders.json", ordersJSON);
    };

    public idExists = async (id: number) => {
        for (let i in this.users) if (this.users[i].id === id) return true;
        for (let i in this.sessions)
            if (this.sessions[i].id === id) return true;
        for (let i in this.products)
            if (this.products[i].id === id) return true;
        for (let i in this.orders) if (this.orders[i].id === id) return true;
        return false;
    };

    public findUserByUsername = async (username: string) => {
        for (let i in this.users)
            if (this.users[i].username === username) return this.users[i];
        return null;
    };

    public addUser = async (user: User) => {
        this.users.push(user);
        await this.save();
        return user;
    };

    public findUserById = async (id: number) => {
        for (let i in this.users)
            if (this.users[i].id === id) return this.users[i];
        return null;
    };

    public findSessionByToken = async (token: string) => {
        for (let i in this.sessions)
            if (this.sessions[i].token === token) return this.sessions[i];
        return null;
    };

    public addSession = async (session: Session) => {
        this.sessions.push(session);
        return session;
    };

    public removeSession = async (session: Session) => {
        return (
            this.sessions.splice(this.sessions.indexOf(session), 1)[0] || null
        );
    };

    public addProduct = async (product: Product) => {
        this.products.push(product);
        await this.save();
        return product;
    };

    public getAllProducts = async () => {
        return this.products;
    };

    public findProductById = async (id: number) => {
        for (let i in this.products)
            if (this.products[i].id === id) return this.products[i];
        return null;
    };

    public removeProduct = async (product: Product) => {
        const removedProduct =
            this.products.splice(this.products.indexOf(product), 1)[0] || null;
        await this.save();
        return removedProduct;
    };

    public getAllOrders = async () => {
        return this.orders;
    };
    public addOrder = async (order: Order) => {
        this.orders.push(order);
        await this.save();
        return order;
    };
    public findOrderById = async (id: number) => {
        for (let i in this.orders)
            if (this.orders[i].id === id) return this.orders[i];
        return null;
    };
    public removeOrder = async (order: Order) => {
        const removedOrder =
            this.orders.splice(this.orders.indexOf(order), 1)[0] || null;
        await this.save();
        return removedOrder;
    };
    public archiveOrder = async (id: number) => {
        for (let i in this.orders)
            if (this.orders[i].id === id) {
                this.orders[i].archived = true;
                this.save();
                return this.orders[i];
            }
        return null;
    };
    public unarchiveOrder = async (id: number) => {
        for (let i in this.orders)
            if (this.orders[i].id === id) {
                this.orders[i].archived = false;
                this.save();
                return this.orders[i];
            }
        return null;
    };
}
