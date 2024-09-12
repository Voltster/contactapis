require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { text, clientMail, fName, lName, number } = req.body;

  try {
    // Send notification email to yourself
    const notificationEmail = await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Enquiry Request",
      html: `
        <p>${text}</p>
        <h3>You got an Enquiry Request From:</h3>
        <ul>
          <li>Email: ${clientMail}</li>
          <li>Name: ${fName} ${lName}</li>
          <li>Phone: ${number}</li>
        </ul>
        <p>Thank you, MHJ</p>
      `,
    });

    // Send confirmation email to the client
    const confirmationEmail = await transporter.sendMail({
      from: process.env.EMAIL,
      to: clientMail,
      subject: "Confirmation of Your Enquiry",
      html: `
        <h2>Thank you for your enquiry, ${fName}!</h2>
        <h4>Dear ${fName},</h4>
        <p> Thank you for reaching out to us with your inquiry regarding [Product/Service]. We appreciate your interest in MHJ Pharmaconcepts Pvt Ltd and are excited to have the opportunity to discuss your requirements.<br /> We have received your inquiry and are processing it accordingly. Our team will review your request and respond to you within 24 hours.</p>
        <p>Best regards <br/> MHJ Pharmaconcepts Pvt Ltd</p>
      `,
    });

    if (
      notificationEmail.accepted.length > 0 &&
      confirmationEmail.accepted.length > 0
    ) {
      res.status(200).send("Emails sent successfully");
    } else {
      res.status(500).send("Error sending one or both emails");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
