const express=require("express");
const app=express();
const path=require("path");

const ejsMate=require("ejs-mate");

const mongoose=require("mongoose");

const Listing = require("./models/listing.js");

const methodOverride=require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
    .then(()=>{
        console.log("connected to databse");
    })
    .catch((err)=>{
        console.log(err);
    })



app.listen(8080,()=>{
    console.log("Server listening...");

});

// app.get("/",(req,res)=>{
//     res.send("Working!");
// });

app.get("/",async (req,res)=>{
    const all=await Listing.find({});
    res.render("./listingsrelated/index.ejs",{all});
       
});

// app.get("/testlisting",async (req,res)=>{
//    let sample=new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     image:"https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/bltea57b2eea49b1ca0/686f68cb1e063116c08e1053/alexey-turenkov-bWJiSZjIgTM-unsplash-HEADERMOBILE.jpg?format=webp&auto=avif&quality=60&crop=1%3A1&width=1440",
//     price:1200,
//     location:"Goa",
//     country:"India"
//    });
//    await sample.save();
//    console.log("sample was saved");
//    res.send("success");

// });

app.get("/listings",async (req,res)=>{
    const all=await Listing.find({});
    res.render("./listingsrelated/index.ejs",{all});
       
});

app.get("/listings/new",async (req,res)=>{
    
    res.render("./listingsrelated/new.ejs");
       
});

app.get("/listings/:id",async (req,res)=>{
    let {id} =req.params;
    const listingdata=await Listing.findById(id);
    res.render("./listingsrelated/show.ejs",{listingdata});
       
});

app.post("/listings",async(req,res)=>{
   // let l=req.body.l;
    const newListing=new Listing(req.body.l);
    await newListing.save();
    res.redirect("/listings");
    console.log(l);

});
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} =req.params;
    const l=await Listing.findById(id);
    res.render("./listingsrelated/edit.ejs",{l});
       
});

// app.put("/listings/:id",async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.l});
//     res.redirect("/listings");
// });
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;

    req.body.l.image = {
        filename: "listingimage",
        url: req.body.l.image
    };

    await Listing.findByIdAndUpdate(id, req.body.l);

    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



