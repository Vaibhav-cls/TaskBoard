const mongoose = require("mongoose");
const initAdmin = require("./data.js");
const User = require("../../models/user.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/taskManagement"

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}
const initDB = async()=>{
    await User.deleteMany({});
    await User.insertMany(initAdmin.data);
    console.log("Data was initialized");
}

initDB();