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
    time: String,
    like: { type: Number, default:'0' },
    dislike: { type: Number, default:'0' }
    
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


//usable variables
let likeRecord = []


// Define routes for handling news operations
app.get("/upload" , (req,res) =>{
    res.sendFile(path.join(__dirname,"secret.html"))
})
// Example route for retrieving news
app.get('/', async (req, res) => {
   likeRecord=[]
   let rec = await News.find()
   rec.forEach(article=>{
    likeRecord.push({id:JSON.stringify(article._id).slice(1,JSON.stringify(article._id).length-1),like:article.like,dislike:article.dislike})
   })
   console.log("LIKEREC",likeRecord)
   res.sendFile(path.join(__dirname,"news.html"))
});
// get pussy put delete

app.get("/api/upload", async (req,res) => {
    const newsList = await News.find();
    // console.log(newsList)
    res.json(newsList);
})



//------------------------------------------------post----------------------------------------------------

// Example route for uploading news
app.post('/api/upload', async (req, res) => {
    const { title, content, image} = req.body;   
    let time = new Date().toLocaleString();
    try {
        let newsItem = new News({ title, content, image, time });
        console.log(typeof newsItem,"\n",newsItem)
        await newsItem.save();
        res.redirect("/")
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//----------------STATIC POSTS ONE TIME---------------------
     function dyn(){
    //each static thingy
    let staticTitles = ["Sports!", "2nd year's Internships!","TAM VX (Group discussion)",
   "Successfully Conducted Nirvana Fest by Street Cause", "St martin's New Creation",
   "Website Launching Soon!!!"] 
    staticTitles.forEach(async post=>{

        let time = new Date().toLocaleString();
        let check = await News.find({title:post})
        if (check.length==0){    
            let newsItem = new News({ title:post});
            await newsItem.save();
        }
    }) 

}

dyn()


app.post("/like",(req,res)=>{
    console.log(req.body) 
    
    // let updateRecord = []
    // let halfKeys = []
    // Object.keys(req.body).forEach(thumb=>{   //getting ids of all posts, called half because like+dislike made it double
    //     // console.log(thumb.slice(3))
    //     if (thumb.startsWith('lik')){
    //         halfKeys.push(thumb.slice(3))
    //     }
    // })

    // halfKeys.forEach(post=>{     //creating a similar obj to store likes and dislike as in get('/') to compare and then update db
    //     updateRecord.push({id:post,like:parseInt(req.body["lik"+post]),dislike:parseInt(req.body["dis"+post])})
    // })
    // console.log("UpdatedLikes:",updateRecord)

    //comparing each object, if we find difference we update db
    


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

