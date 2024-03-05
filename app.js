const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = express.Router();
const User = require("./model.js");

const nodemailer = require("nodemailer");

const port = 3000;

app.use(express.json());
app.use(cors());
let corsOptions = {
  origin: ["http://localhost:3000"],
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const uri = "mongodb://localhost:27017/forgotPassword";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.post("/user", cors(corsOptions), async (req, res) => {
  const newCustomer = await User(req.body);
  newCustomer.save();
  res.status(200).json(newCustomer);
});

app.post("/login", cors(corsOptions), async (req, res) => {
  const admin = await User.findOne(req.body);
  if (admin) {
    res.status(201).json(admin);
  } else {
    res.status(201).json("Wrong credentials");
  }
});

app.put('/password-reset/:id', async (req, res) => {
  try{
    const newCustomer = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.status(200).json(newCustomer);
  }catch(err){
    res.status(500).json({err:"internal server error"})
  } 
})


app.post("/forgot-password", cors(corsOptions), async (req, res) => {
  const { email } = req.body;

  try {
    // Send email to the provided email address
    const transporter = nodemailer.createTransport({
      service: "Gmail", 
      auth: {
        user: "srikanthyaswada.vita@gmail.com", 
        pass: "epit pzty chqi knfa", 
      },
    });

    const mailOptions = {
      from: "srikanthyaswada.vita@gmail.com", 
      to: email, 
      subject: "Password Reset",
      text: " http://localhost:4200/password-reset",
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
