const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todoListDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a list schema
const listSchema = new mongoose.Schema({
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

// Create a task schema
const taskSchema = new mongoose.Schema({
  name: String,
  dueDate: Date,
  checklist: [String],
  labels: [String],
});

// Create list and task models
const List = mongoose.model('List', listSchema);
const Task = mongoose.model('Task', taskSchema);

// Render the homepage
app.get('/', async function (req, res) {
  try {
    const lists = await List.find().exec();
    res.render('index', { lists });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new list
app.post('/lists', async function (req, res) {
  const listName = req.body.listName;

  try {
    const newList = new List({
      name: listName,
    });
    await newList.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a list
app.post('/lists/delete', async function (req, res) {
  const listId = req.body.listId;

  try {
    await List.findByIdAndRemove(listId);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new task to a list
app.post('/lists/:listId/tasks', async function (req, res) {
  const listId = req.params.listId;
  const taskName = req.body.taskName;

  try {
    const foundList = await List.findById(listId);
    const newTask = new Task({
      name: taskName,
    });
    await newTask.save();
    foundList.tasks.push(newTask);
    await foundList.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a task from a list
app.post('/lists/:listId/tasks/delete', async function (req, res) {
  const listId = req.params.listId;
  const taskId = req.body.taskId;

  try {
    await List.findByIdAndUpdate(listId, { $pull: { tasks: taskId } });
    await Task.findByIdAndRemove(taskId);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3012, function () {
  console.log('Server started on port 3012');
});
