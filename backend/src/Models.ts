import { randId } from "./utils";

export class User {
    public id: number;
    public username: string;
    public password: string;
    public admin: boolean;

    constructor(username: string, password: string) {
        this.id = randId(10000000, 99999999);
        this.username = username;
        this.password = password;
        this.admin = false;
    }
}

export class Session {
    public id: number;
    public token: string;
    public userId: number;

    constructor(token: string, userId: number) {
        this.id = randId(10000000, 99999999);
        this.token = token;
        this.userId = userId;
    }
}

export class Product {
    public id: number;
    public title: string;
    public content: string;
    public image: string;

    constructor(title: string, content: string, image: string) {
        this.id = randId(10000000, 99999999);
        this.title = title;
        this.content = content;
        this.image = image;
    }
}

export class Order {
    public id: number;
    public productId: number;
    public firstName: string;
    public lastName: string;
    public mail: string;
    public phone: string;
    public details: string;
    public date: Date;
    public archived: boolean;

    constructor(
        productId: number,
        firstName: string,
        lastName: string,
        mail: string,
        phone: string,
        details: string,
    ) {
        this.id = randId(10000000, 99999999);
        this.productId = productId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
        this.phone = phone;
        this.details = details;
        this.date = new Date();
        this.archived = false;
    }
}
