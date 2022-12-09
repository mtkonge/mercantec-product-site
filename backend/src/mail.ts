import nodemailer from "nodemailer";

import { SITE_URL } from "./config";
import { Order } from "./Models";

function collectLines(...messages: string[]) {
    return messages.reduce(function (previous, currentValue) {
        return previous + "\n\n" + currentValue;
    });
}

function formatCustomerTextMessage(order: Order, productTitle: string) {
    return collectLines(
        `Hej ${order.firstName},`,
        `Vi har modtaget din bestilling af produktet ${productTitle} (${SITE_URL}/product/${order.productId}), og den vil nu blive behandlet.`,
        `Dit bestillingsnummer er #${order.id}.`,
        "For mere information, kontakt venligst ved mail hotskp@mercantec.dk, eller på telefon ved 89 50 34 25",
        "Mandag-torsdag: 8:00 – 15:30",
        "Fredag: 8:00 – 12:30",
        "Bemærk venligst, at denne besked er sendt automatisk, og burde ikke besvares.",
    );
}

function formatCustomerHtmlMessage(order: Order, productTitle: string) {
    return collectLines(
        `<p>Hej ${order.firstName},</p>`,
        `<p>Vi har modtaget din bestilling af produktet <a href="${SITE_URL}/product/${order.productId}" target="_blank">${productTitle} (#${order.productId})</a>, og den vil nu blive behandlet.</p>`,
        `<p>Dit bestillingsnummer er #${order.id}.<p>`,
        `<p>For mere information, kontakt venligst ved mail <a href="mailto:hotskp@mercantec.dk" target="_blank"
        >hotskp@mercantec.dk</a>
        eller på telefon ved <a href="tel:+4589503425" target="_blank">89 50 34 25</a></p>`,
        `<p>Mandag-torsdag: 8:00 – 15:30</p>`,
        `<p>Fredag: 8:00 – 12:30</p>`,
        "<p><b>Bemærk venligst, at denne besked er sendt automatisk, og burde ikke besvares.</b></p>",
    );
}

function formatSupplierTextMessage(order: Order, productTitle: string) {
    return collectLines(
        `Bestilling indsendt for produkt ${productTitle} (${SITE_URL}/product/${order.productId}) af ${order.firstName} ${order.lastName}`,
        `Beskrivelse: ${order.details}`,
        `Telefon: ${order.phone}`,
        `Mail: ${order.mail}`,
        `Bestillingsnummer er #${order.id}.`,
        `Alle bestillinger kan ses ved ${SITE_URL}/orders/`,
        "Bemærk venligst, at denne besked er sendt automatisk, og burde ikke besvares.",
    );
}

function formatSupplierHtmlMessage(order: Order, productTitle: string) {
    return collectLines(
        `<p>Bestilling indsendt for produkt 
        <a href="${SITE_URL}/product/${order.productId}" target="_blank">${productTitle}</a> 
        af ${order.firstName} ${order.lastName}</p>`,
        `<p>Beskrivelse: ${order.details}</p>`,
        `<p>Telefon: <a href="tel:${order.phone}" target="_blank">${order.phone}</a></p>`,
        `<p>Mail: <a href="mailto:${order.mail}" target="_blank">${order.mail}</a></p>`,
        `<p>Bestillingsnummer:  #${order.id}.<p>`,
        `<p>Alle bestillinger kan ses ved <a href="${SITE_URL}/orders/" target="_blank">${SITE_URL}/orders/</a><p>`,
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
        text: formatCustomerTextMessage(order, productTitle),
        html: formatCustomerHtmlMessage(order, productTitle),
    });

    await transporter.sendMail({
        from: username,
        to: "hotskp@mercantec.dk",
        subject: `Bestilling modtaget (#${order.id})`,
        text: formatSupplierTextMessage(order, productTitle),
        html: formatSupplierHtmlMessage(order, productTitle),
    });
}
