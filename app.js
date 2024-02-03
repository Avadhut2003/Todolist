//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const today = require(__dirname+"/date.js")
const _ = require("lodash");

const app = express();
mongoose.connect("mongodb+srv://kingzoro2030:Zoro%404264@cluster0.kbhtwch.mongodb.net/todolistDB");
const ItemSchema = {
    name: String
};
const ListSchema = {
    name: String,
    items: [ItemSchema]
}
const Item = mongoose.model("item",ItemSchema);
const List = mongoose.model("list",ListSchema);
const day = "Today"

app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){ 
    Item.find({})
    .then(searchitems => res.render("list",{List_Title: "Today", new_Item: searchitems}))  
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName })
    .then(foundList => {
        if (!foundList) {
            //console.log("Doesn't Exist");
            const Demo = new Item({
                name: customListName + "  List"
            });
            const list = new List({
                name: customListName,
                items: Demo
            });
            list.save();
            res.redirect("/" + customListName);
        } else {
            res.render("list",{List_Title: foundList.name, new_Item: foundList.items})
        }
    });

});

app.post("/",function(req,res){
    let itemName =  _.capitalize(req.body.newtask);
    let listName = req.body.List;
    

    const item = new Item({
        name: itemName
    });

    if(listName === day){
        item.save()
        res.redirect("/");
    }else{
        List.findOne({name: listName})
        .then(foundList => {             
                    foundList.items.push(item);
                    foundList.save();
                    res.redirect("/" + listName);
        })
    }
});

app.post("/delete",function(req,res){
    const deleteItemId = req.body.checkbox;
    const listName = req.body.List;
    

    if(listName === day){
        Item.findByIdAndDelete(deleteItemId)
        .then(result => { console.log("Document Deleted successfully."); });
        res.redirect("/");
    }else{
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: deleteItemId } } })
        .then(result => {
        if (result) {
            console.log("Document Deleted successfully.");
        }});
        res.redirect("/"+ listName);
    }
});

app.get("/about",function(req,res){
    res.render("about");
});

app.get("/thank",function(req,res){
    res.render("thank");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("At 3000");
});