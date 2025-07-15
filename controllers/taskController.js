const db = require("../config/db");

exports.getTask = async (req, res) => {
  const { completed, sort } = req.query;

  let query = "SELECT * FROM tasks WHERE user_id = ?";
  const params = [req.user.id];

  if (completed === "true") {
    query += " AND completed = true";
  } else if (completed === "false") {
    query += " AND completed = false";
  }

  if (sort === "deadline") {
    query += " ORDER BY deadline ASC";
  } else {
    query += " ORDER BY created_at DESC";
  }

  try {
    const [tasks] = await db.query(query, params);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (user_id, title, description, deadline, priority, completed) VALUES (?, ?, ?, ?, ?, false)",
      [req.user.id, title, description, deadline, priority]
    );

    const insertedTask = {
      id: result.insertId,
      user_id: req.user.id,
      title,
      description,
      deadline,
      priority,
      completed: false,
    };

    res.status(201).json({ task: insertedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority, completed } = req.body;
  try {
    await db.query(
      "UPDATE tasks SET title = ?, description = ?, deadline = ?, priority = ?, completed = ? WHERE id = ? AND user_id = ?",
      [title, description, deadline, priority, completed, id, req.user.id]
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllComplete = async (req, res) => {
  try {
    await db.query(
      "UPDATE tasks SET completed = true WHERE user_id = ?",
      [req.user.id]
    );    
    res.json({ updated: true });    
  } catch (err) {
    res.status(500).json({ error: err.message });    
  }
};