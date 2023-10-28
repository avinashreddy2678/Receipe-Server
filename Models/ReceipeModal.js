import mongoose from "mongoose";


const ReceipeSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    type:{
        type:String,
        default:"veg"
    },
    imgurl: {
        type:String,
    },
    ingrediants: {
        type:Array
    },
    description: {
        type:String
    },
    time: {
        type:String,
    },
    creatorid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    creatorname:{
        type:String,
        ref:"user",
    }
    ,
    Liked:[
        {
          type: mongoose.Schema.Types.Mixed,
          ref: 'user', 
        },
      ],
    Saved:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', 
        },
      ],
    
})
export const ReceipeModal=mongoose.model("receipe",ReceipeSchema);