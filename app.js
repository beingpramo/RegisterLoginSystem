//Eslint
const {MongoClient, Db} = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
console.log(process.env)

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: true
}));

//DB connection

async function main(){
   const uri = process.env.ATLAS_URI;
   const client =new MongoClient(uri, {useNewUrlParser:true});

   try{
    await client.connect();
    console.log("DB connected!");

   
//Routes

//Register Page

app.get("/", (req,res)=>{
    res.send(__dirname + "index.html")
});

app.post("/", (req,res)=>{
     
    var Name = req.body.fname;
    var Email = req.body.email;
    var Password = req.body.password;


    var data ={
        "name": Name,
        "email":Email,
        "password":Password
    }
   

    const database = client.db("details");
    const usersCollection = database.collection("users");
    const query = data;
    const user = usersCollection.insertOne(query).then(function(userdetails){
        console.log(userdetails);
        // callback(userdetails);
        res.send("SUCCESSFULLY REGISTERED!");
    })

})

//Login page

app.get("/login", (req,res)=>{
    res.send(__dirname + "login.html");
});

app.post("/login", (req,res)=>{
    
    var Email = req.body.email;
    var Password = req.body.password;

    var loginDetails ={
        "email": Email,
        "password":Password
    }

    const database = client.db("details");
    const usersCollection = database.collection("users");
    const query = loginDetails;
    const uservalidation = usersCollection.findOne(query).then(function(userdetails){
        // console.log(userdetails);
        res.send("Login Success!");
    })
})
 
   } 
   catch(err){
    console.log(err);
   } 
//    finally{
//     await client.close();
//    }

}

main().catch(console.error);



app.listen(3000, ()=>{
    console.log(`The server is running on port 3000`);
})