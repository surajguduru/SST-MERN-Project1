const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).send("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send("User registered successfully");
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
        return res.status(400).send("User does not exist in our database. Kindly register first.");
    }

    const validPassword = await bcrypt.compare(req.body.password, userExists.password);
    if (!validPassword) {
        return res.status(400).send("Invalid password")
    }

    res.status(200).send(`Welcome ${userExists.name} to our website! You are now logged in.`);
});

module.exports = router;