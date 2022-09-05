import nodemailer from "nodemailer";

import { Order } from "./Models";

import { SITE_URL } from "./config";

function collectLines(...messages: string[]) {
    return messages.reduce(function (previous, currentValue) {
        return previous + "\n\n" + currentValue;
    });
}

function formatTextMessage(order: Order, productTitle: string) {
    return collectLines(
        `Hej ${order.firstName},`,
        `Vi har modtaget din bestilling af produktet ${productTitle} (${SITE_URL}/product/${order.productId}), og den vil nu blive behandlet.`,
        `Dit bestillingsnummer er #${order.id}.`,
        "Bemærk venligst, at denne besked er sendt automatisk, og burde ikke besvares.",
    );
}

function formatHtmlMessage(order: Order, productTitle: string) {
    return collectLines(
        `<p>Hej ${order.firstName},</p>`,
        `<p>Vi har modtaget din bestilling af produktet <a href="${SITE_URL}/product/${order.productId}" target="_blank">${productTitle} (#${order.productId})</a>, og den vil nu blive behandlet.</p>`,
        `<p>Dit bestillingsnummer er #${order.id}.<p>`,
        "<p><b>Bemærk venligst, at denne besked er sendt automatisk, og burde ikke besvares.</b></p>",
    );
}

export async function mailSend(order: Order, productTitle: string) {
    const username = '"Mercantec Datacenter" datacenter@mercantec.dk';

    const transporter = nodemailer.createTransport({
        host: "185.22.74.33",
        port: 25,
    });
    await transporter.sendMail({
        from: username,
        to: order.mail,
        subject: `Din bestilling (#${order.id}) er blevet modtaget`,
        text: formatTextMessage(order, productTitle),
        html: formatHtmlMessage(order, productTitle),
    });
}
