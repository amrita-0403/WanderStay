const express=require("express");
const app=express();
const path=require("path");

const ejsMate=require("ejs-mate");

const mongoose=require("mongoose");
const session = require("express-session");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");



const methodOverride=require("method-override");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const flash = require("connect-flash");
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

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


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






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

app.get("/listings", wrapAsync(async (req,res)=>{

    const all=await Listing.find({});
    res.render("./listingsrelated/index.ejs",{all});
       
}));

app.get("/listings/new",wrapAsync(async (req,res)=>{
    
    res.render("./listingsrelated/new.ejs");
       
}));

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listingdata=await Listing.findById(id).populate("reviews");
    res.render("./listingsrelated/show.ejs",{listingdata});
       
}));

app.post("/listings",wrapAsync(async(req,res,next)=>{
    if(!req.body.l){
        throw new ExpressError(400,"Send valid data!")
    }
   
    const newListing=new Listing(req.body.l);
    await newListing.save();
    res.redirect("/listings");
   
   

}));
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const l=await Listing.findById(id);
    res.render("./listingsrelated/edit.ejs",{l});
       
}));

// app.put("/listings/:id",async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.l});
//     res.redirect("/listings");
// });
app.put("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;

    req.body.l.image = {
        filename: "listingimage",
        url: req.body.l.image
    };

    await Listing.findByIdAndUpdate(id, req.body.l);

    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



app.post("/listings/:id/reviews",async(req,res)=>{
    let listingdata=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    listingdata.reviews.push(newreview);
    await newreview.save();
    await listingdata.save();
  

    res.redirect(`/listings/${listingdata._id}`);

});

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let{id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));



app.get("/signup",(req,res)=>{
    res.send("form");
});




app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message);
});




