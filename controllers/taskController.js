const { Task } = require("../models");

exports.getTask = async (req, res) => {
  const { completed, sort } = req.query;

  const where = { user_id: req.user.id };

  if (completed === "true") where.completed = true;
  else if (completed === "false") where.completed = false;

  const order =
    sort === "deadline" ? [["deadline", "ASC"]] : [["createdAt", "DESC"]];

  try {
    const tasks = await Task.findAll({ where, order });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const newTask = await Task.create({
      user_id: req.user.id,
      title,
      description,
      deadline,
      priority,
      completed: false,
    });
    res.status(201).json({ task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority, completed } = req.body;
  try {
    await Task.update(
      { title, description, deadline, priority, completed },
      { where: { id, user_id: req.user.id } }
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.destroy({
      where: { id, user_id: req.user.id },
    });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllComplete = async (req, res) => {
  try {
    await Task.update({ completed: true }, { where: { user_id: req.user.id } });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
