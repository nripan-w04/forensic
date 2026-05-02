const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const database=require("./config/database");

const forensicRouter=require("./routes/forensicrouter");

const http = require('http');
const socketConfig = require('./config/socket');

const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

database();

app.use("/api",forensicRouter);

const server = http.createServer(app);
socketConfig.init(server);

server.listen(process.env.PORT,()=>{
    console.log("Server started on port 4000");
});
