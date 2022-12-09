import { Order, Product, Session, User } from "./Models";
import { Database } from "./Database";
import { readFile, writeFile } from "fs/promises";

export class MemoryDb extends Database {
    private users: User[];
    private sessions: Session[];
    private products: Product[];
    private orders: Order[];

    constructor() {
        super();
        this.users = [];
        this.sessions = [];
        this.products = [];
        this.orders = [];
    }

    public initialize = async () => {
        this.users = [
            { username: "test", password: "test", id: 1, admin: true },
        ];
    };

    public findUserByUsername = async (username: string) => {
        for (let i in this.users)
            if (this.users[i].username === username) return this.users[i];
        return null;
    };

    public addUser = async (user: User) => {
        this.users.push(user);
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
        return (
            this.products.splice(this.products.indexOf(product), 1)[0] || null
        );
    };

    public getAllOrders = async () => {
        return this.orders;
    };

    public addOrder = async (order: Order) => {
        this.orders.push(order);
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
        return removedOrder;
    };

    public archiveOrder = async (id: number) => {
        for (let i in this.orders)
            if (this.orders[i].id === id) {
                this.orders[i].archived = true;
                return this.orders[i];
            }
        return null;
    };
    public unarchiveOrder = async (id: number) => {
        for (let i in this.orders)
            if (this.orders[i].id === id) {
                this.orders[i].archived = false;
                return this.orders[i];
            }
        return null;
    };
}
