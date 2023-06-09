const express = require('express');
const Task = require('../models/Task');
const List = require('../models/List');

const router = express.Router();

// Create a new task in a list
router.post('/lists/:listId/tasks', async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, dueDate, checklist, labels } = req.body;

    const newTask = await Task.create({ title, dueDate, checklist, labels });
    const list = await List.findById(listId);
    list.tasks.push(newTask);
    await list.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Delete a task from a list
router.delete('/lists/:listId/tasks/:taskId', async (req, res) => {
  try {
    const { listId, taskId } = req.params;

    const list = await List.findById(listId);
    list.tasks.pull(taskId);
    await list.save();

    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Update a task in a list
router.put('/lists/:listId/tasks/:taskId', async (req, res) => {
  try {
    const { listId, taskId } = req.params;
    const { title, dueDate, checklist, labels } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, dueDate, checklist, labels },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
