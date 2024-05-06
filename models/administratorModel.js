const mongoose =require("mongoose");

const administratorSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Please add the user name"],
        },

         email:{
              type: String,
              required:[true,"Please add the user email address"],
              unique:[true,"Email address already taken"]
            },

            password:{
                type:String,
                required:[true,"Please add the user password"]
            },

            confirmPassword:{
                type:String,
                required:[true,"Please add the user   confirm password"]
            }
     
    },
    {
        timestamp:true
    }
);

module.exports = mongoose.model("administrator",administratorSchema);