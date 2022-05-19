const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set("view engine", "ejs");
//for body parser
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
//connection
mongoose.connect('mongodb+srv://Raxmice_98:Raxmice1998@noderax.tkfup.mongodb.net/tasks',{ useNewUrlParser: true }, ()=>{
      console.log("connected");
  },
  e => console.error(e)
  );

  const documents = new mongoose.Schema({
      title: String,
      description: String,
      radio: String
  });
  const Task = mongoose.model("Task", documents);
  

//page req and res
app.get("/", function(req, res){
    res.render("index");
});
app.post("/", function(req, res){
    if(req.body.title=="" || req.body.description=="" || req.body.radio==""){
        console.log("one of input is empty");
    }else{
    const title = req.body.title;
    const description = req.body.description;
    const radio = req.body.radio;
    const d1=new Task({
        title: title,
        description: description,
        radio: radio
    });
    d1.save(function(err){
        if(!err){
            res.redirect("tasks");
        }
    });
}
});

app.get("/tasks", function(req, res){
    Task.find(function(err, data){
        if(err){console.log(err);}
        else{res.render("tasks",{data:data});}
        
    });
});
app.post("/tasks", function(req, res){
    if(req.body.id!=="" && req.body.delete=="delete"){
        Task.deleteOne({_id:req.body.id},
            function(err){
                if(err){console.log(err);}else{console.log("delete success"); res.redirect("tasks");}
            });
    }else{
    const description = req.body.description;
    const radio = req.body.radio;
    Task.updateMany({_id:req.body.id},{description:description , radio:radio},
        function(err){
            if(err){console.log(err);}else{console.log("success"); res.redirect("tasks");}
        });
}
});

//404
app.get('*', function(req, res){
    res.status(404).send("<h1>404</h1><br><h3><a href='/'>Go back to home page</a></h3>");
  });
//calling a server
let port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}
app.listen(port, function(){
    console.log('server is started on port 3000');
});
