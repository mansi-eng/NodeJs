const app = require("./app");
const mongoose = require("mongoose");
const connectdb = require("./Db/connect");
//server banao banao , port
const port = process.env.port || 8000;

connectdb();
app.listen(port, () => {
  console.log("Good morning");
});
