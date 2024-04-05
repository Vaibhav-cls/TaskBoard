const express = require("express");
const User = require("./models/user.js");
const Task = require("./models/task.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();
const port = 1903;
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
let isValidated = false;
const MONGO_URL = "mongodb://127.0.0.1:27017/taskManagement";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/login", (req, res) => {
  isValidated = false;
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  let obj = await User.find({ username: username });
  if (!obj[0]) {
    res.send("Invalid User");
    console.log(obj);
  } else if (obj[0].username === username) {
    if (obj[0].password === password) {
      let id = obj[0]._id.valueOf();
      isValidated = true;
      if (obj[0].type_of_user === "admin") {
        res.redirect(`/admin/${id}`);
      } else if (obj[0].type_of_user === "normal") {
        res.redirect(`/user/${id}`);
      }
    } else {
      res.send("Please check your password");
    }
  }
});

/*       ADMIN ROUTE                  */
app.get("/admin/:id", async (req, res) => {
  if (!isValidated) {
    res.send("Illegal Access to the page, please login first");
  } else {
    let { id } = req.params;
    let allUsers = await User.find({});
    let totalTaskCount = await Task.countDocuments();
    let progressTask = await Task.countDocuments({ status: false });
    let userDetails = await User.findById(id);
    let usersCount = await User.countDocuments();
    let adminUsersCount = await User.countDocuments({ type_of_user: "admin" });
    res.render("admin.ejs", {
      info: userDetails,
      allUsers,
      totalTaskCount,
      progressTask,
      usersCount,
      adminUsersCount,
    });
  }
});
app.delete("/admin/:id/:id2", async (req, res) => {
  let { id, id2 } = req.params;
  await User.findByIdAndDelete(id2);
  res.redirect(`/admin/${id}`);
});
app.get("/admin/:id/new", (req, res) => {
  let { id } = req.params;
  if (!isValidated) {
    res.send("Illegal Access to the page, please login first");
  } else {
    res.render("new.ejs", { id });
  }
});
app.post("/admin/:id", async (req, res) => {
  let { id } = req.params;
  let newUser = new User(req.body);
  await newUser.save();
  res.redirect(`/admin/${id}`);
});

app.get("/admin/:id/:id2/edit", async (req, res) => {
  let { id, id2 } = req.params;
  let userDetails = await User.findById(id2);
  if (!isValidated) {
    res.send("Illegal Access to the page, please login first");
  } else {
    res.render("edit.ejs", { info: userDetails, id });
  }
});
app.put("/admin/:id/:id2/edit", async (req, res) => {
  let { id, id2 } = req.params;
  await User.findByIdAndUpdate(id2, { ...req.body });
  res.redirect(`/admin/${id}`);
});
app.get("/admin/:id/:id2/dashboard", async (req, res) => {
  let { id, id2 } = req.params;
  let userDetails = await User.findById(id2);
  let inProgressTask = 0;
  let usersCount = await User.countDocuments();
  let adminUsersCount = await User.countDocuments({ type_of_user: "admin" });
  let { task } = await User.findById(id2).populate("task");
  for(i of task){
    if(i.status === false)
      inProgressTask++;
  }
  let totalTaskCount = task.length;
  res.render("dashboard.ejs", {
    id,
    id2,
    task,
    info: userDetails,
    totalTaskCount,
    inProgressTask,
    usersCount,
    adminUsersCount,
  });
});
app.post("/admin/:id/:id2/dashboard", async (req, res) => {
  let { id, id2 } = req.params;
  let newTask = new Task(req.body);
  const task = await newTask.save();
  const user = await User.findById(id2);
  if (user) {
    user.task.push(task._id);
    await user.save();
    console.log("Task assigned to user:", user);
    res.redirect(`/admin/${id}`);
  } else {
    res.send("User not found");
  }
});
app.get("/admin/:id/:id2/assignTask", async (req, res) => {
  let { id, id2 } = req.params;
  let user = await User.findById(id2);
  res.render("assignTask.ejs", { id, user });
});
app.get("/admin/:id/:id2/:id3/editTask", async (req, res) => {
  let { id, id2, id3 } = req.params;
  let user = await User.findById(id);
  let taskInfo = await Task.findById(id3);
  res.render("editTask.ejs", { id, id2, id3, info: taskInfo ,user});
});
app.put("/admin/:id/:id2/:id3", async (req, res) => {
  let { id, id2, id3 } = req.params;
  await Task.findByIdAndUpdate(id3, { ...req.body });
  res.redirect(`/admin/${id}/${id2}/dashboard`);
});
/*            NORMAL USER ROUTE            */
app.get("/user/:id", async (req, res) => {
  if (!isValidated) {
    res.send("Illegal Access to the page, please login first");
  } else {
    let { id } = req.params;
    let { task } = await User.findById(id).populate("task");
    let userDetails = await User.findById(id).populate("task");
    let taskInfo = userDetails.task;
    let inProgressTask = 0;
    let usersCount = await User.countDocuments();
    let totalTaskCount = task.length;
    
  for(i of task){
    if(i.status === false)
      inProgressTask++;
  }
    res.render("user.ejs", { info: userDetails, task: taskInfo, id, totalTaskCount ,inProgressTask});
  }
});
app.get("/user/:id/:id2/editTask",async(req,res)=>{
  let {id,id2} = req.params;
  let userDetails = await User.findById(id);
  let taskInfo = await Task.findById(id2);
  res.render("editTask.ejs", { id, id2, info: taskInfo, user: userDetails });
});
app.put("/user/:id/:id2",async(req,res)=>{
  let {id,id2} = req.params;
  await Task.findByIdAndUpdate(id2, { ...req.body });
  res.redirect(`/user/${id}`);
})
app.get("/", (req, res) => {
  res.send("Root is working fine");
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
