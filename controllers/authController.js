const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM smart_task_manager_database WHERE email = ?", [email]);
    if (user.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO smart_task_manager_database (email, password) VALUES (?, ?)", [email, hashed]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "err.message" });
  }  
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const [user] = await db.query("SELECT * FROM smart_task_manager_database WHERE email = ?", [email]);

        if (user.length === 0) {
          return res.status(400).json({ message: "Invalid email or password" });
        }
        
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "err.message" });
    }
};