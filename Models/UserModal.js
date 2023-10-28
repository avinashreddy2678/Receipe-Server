import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true
    }
    ,
    password:{
        type:String,
        require:true,
    },
    Saved: [
        {
          type: mongoose.Schema.Types.Mixed,
          ref: 'receipe', 
        },
      ],
      Liked: [
        {
          type: mongoose.Schema.Types.Mixed,
          ref: 'receipe', 
        },
      ],
      Myreceipes:[
        {
          type: mongoose.Schema.Types.Mixed,
          ref: 'receipe', 
        },
      ]

})
export const UserModal=mongoose.model("user",UserSchema);