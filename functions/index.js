const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const path = require("path");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Declare secret
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

exports.sendOrderEmail = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: "asia-south1",
    secrets: [SENDGRID_API_KEY]
  },
  async (event) => {
    const order = event.data.data();

    // Read secret value
    const apiKey = SENDGRID_API_KEY.value();

    sgMail.setApiKey(apiKey);

    const msg = {
      to: order.email,
      from: "yourshop@gmail.com", // Must be verified sender
      subject: "Your Order Confirmation ✔",
      html: `
        <h2>Hello ${order.name}</h2>
        <p>Your order has been confirmed successfully!</p>
        <p><strong>Order ID:</strong> ${event.params.orderId}</p>
      `
    };

    try {
      await sgMail.send(msg);
      console.log("Order email sent ✔");
    } catch (err) {
      console.error("SendGrid Email Error:", err);
    }
  }
);

// Expose existing Express API as a Firebase HTTPS function
// We lazy-load the server app to avoid requiring heavy modules during other function executions.
exports.api = onRequest(async (req, res) => {
  try {
    // Use the app exported by server (CommonJS)
    const createApp = require(path.join(__dirname, 'server-src', 'app'));
    const app = createApp();

    // Let Express handle the request
    app(req, res);
  } catch (err) {
    console.error('Failed to handle request in function api:', err);
    res.status(500).send('Internal Server Error');
  }
});
