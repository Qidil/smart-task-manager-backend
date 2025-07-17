const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define("task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Task;
};
