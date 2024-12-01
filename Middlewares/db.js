const mongoose = require("mongoose"); 

const URI = process.env.MONGODB; 


const connectDb = async () =>{

    try{
       
        await mongoose.connect(URI)
    } catch(error){
        console.log(error)
        process.exit(0)
    }
}

module.exports = connectDb; 