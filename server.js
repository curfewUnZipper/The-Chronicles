const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path")
require("dotenv").config()

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();





// Connect to MongoDB
mongoose.connect("mongodb+srv://BhargavPattanayak:bhargav00007@cluster0.npaegrt.mongodb.net/chronicles", { useNewUrlParser: true, useUnifiedTopology: true });
// Define MongoDB Schema and Model for News
const newsSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    time: String
    
});
const News = mongoose.model('News', newsSchema);

const likeSchema = new mongoose.Schema({
    like: Number     
});
const Like = mongoose.model('likes', likeSchema);

// Set up middleware for parsing JSON
app.use(express.json());
app.use(express.static(__dirname))

app.use(express.urlencoded({ extended:true
}))


// Define routes for handling news operations
app.get("/upload" , (req,res) =>{
    res.sendFile(path.join(__dirname,"secret.html"))
})
// Example route for retrieving news
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname,"news.html"))
});
// get pussy put delete
// Example route for uploading news
app.post('/api/upload', async (req, res) => {
    const { title, content, image} = req.body;   
    let time = new Date().toLocaleString();
    try {
        const newsItem = new News({ title, content, image, time });
        await newsItem.save();
        res.redirect("/")
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/upload", async (req,res) => {
    const newsList = await News.find();
    res.json(newsList);
})


app.post("/delete", async (req,res) => {   
    
    if (typeof req.body.article == "string") {
            let response = await News.deleteOne({_id:req.body.article})
    }
    else {
        req.body.article.forEach( async art  => {            
            let response = await News.deleteOne({_id:art})
        
        })
    }
    res.redirect("/delete.html");
})


app.post("/like",(req,res)=>{

})

app.post("/pass",(req,res)=>{
    let pass = "undercook" 

    if (req.body.passkey==pass){
        res.sendFile(path.join(__dirname,"upload.html"))
    }
    else {
        res.status(401).send("Wrong Password!  &nbsp &nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp  Ip Adress:198.02.40.7");

    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

