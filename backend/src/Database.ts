import { Order, Product, Session, User } from "./Models";

export abstract class Database {
    public abstract initialize: () => Promise<void>;

    public abstract findUserByUsername: (
        username: string,
    ) => Promise<User | null>;
    public abstract addUser: (user: User) => Promise<User>;
    public abstract findUserById: (id: number) => Promise<User | null>;

    public abstract findSessionByToken: (
        token: string,
    ) => Promise<Session | null>;
    public abstract addSession: (session: Session) => Promise<Session>;
    public abstract removeSession: (
        session: Session,
    ) => Promise<Session | null>;

    public abstract addProduct: (product: Product) => Promise<Product>;
    public abstract getAllProducts: () => Promise<Product[]>;
    public abstract findProductById: (id: number) => Promise<Product | null>;
    public abstract removeProduct: (
        product: Product,
    ) => Promise<Product | null>;

    public abstract addOrder: (order: Order) => Promise<Order>;
    public abstract getAllOrders: () => Promise<Order[]>;
    public abstract findOrderById: (id: number) => Promise<Order | null>;
    public abstract removeOrder: (order: Order) => Promise<Order | null>;
    public abstract archiveOrder: (id: number) => Promise<Order | null>;
    public abstract unarchiveOrder: (id: number) => Promise<Order | null>;
}
