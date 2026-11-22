const express=require("express");
const router=express.Router();

router.get("/",async (req,res)=>{
    const all=await Listing.find({});
    res.render("./listingsrelated/index.ejs",{all});
       
});

// router.get("/testlisting",async (req,res)=>{
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

router.get("/listings", wrapAsync(async (req,res)=>{

    const all=await Listing.find({});
    res.render("./listingsrelated/index.ejs",{all});
       
}));

router.get("/new",wrapAsync(async (req,res)=>{
    
    res.render("./listingsrelated/new.ejs");
       
}));

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listingdata=await Listing.findById(id).populate("reviews");
    res.render("./listingsrelated/show.ejs",{listingdata});
       
}));

router.post("/listings",wrapAsync(async(req,res,next)=>{
    if(!req.body.l){
        throw new ExpressError(400,"Send valid data!")
    }
   
    const newListing=new Listing(req.body.l);
    await newListing.save();
    res.redirect("/listings");
   
   

}));
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const l=await Listing.findById(id);
    res.render("./listingsrelated/edit.ejs",{l});
       
}));

// router.put("/:id",async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.l});
//     res.redirect("/listings");
// });
router.put("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;

    req.body.l.image = {
        filename: "listingimage",
        url: req.body.l.image
    };

    await Listing.findByIdAndUpdate(id, req.body.l);

    res.redirect(`/${id}`);
}));

router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



router.post("/:id/reviews",async(req,res)=>{
    let listingdata=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    listingdata.reviews.push(newreview);
    await newreview.save();
    await listingdata.save();
  

    res.redirect(`/${listingdata._id}`);

});

router.delete("/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let{id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/${id}`);
}));

module.exports=router;