const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }  
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
        }
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "err.message" });
    }
};