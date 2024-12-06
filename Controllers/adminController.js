const User = require("../Models/user-model")
const Provider = require("../Models/provider-model")


// Fetching all the users that has an account. 
const fetchUsers = async (req, res) => {
    try{
        const { page = 1, limit = 10, courseName } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const userList = await User.find({}, "username mobile email controll").skip(skip).limit(limitNumber)
        if(!userList){
            return  res.status(400).send({msg : null})
        }
        
        return res.status(200).send({msg : userList})
    }catch(eror){
        return  res.status(500).send({msg : "Error"})
    }
}

// Deleting the user 
const deleteUser = async (req, res) => {
    try{
         
        const userId = "674be6a529f025251b882b45"; 
        const deleteUser = await User.findByIdAndDelete(userId)
        if(!deleteUser){
            res.status(400).send({msg : "No user found"})
        }
        
        return res.status(200).send({msg : "User deleted Successfully"})
    }catch(eror){
        return res.status(500).send({msg : "Error"})
    }
}

// Fetching all the provider that has an account. 
const fetchProviders = async (req, res) => {
    try{
        const { page = 1, limit = 10, courseName } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const providerList = await Provider.find({}, "username mobile email courses").skip(skip).limit(limitNumber)
        if(!providerList){
            return  res.status(400).send({msg : null})
        }
        
        return res.status(200).send({msg : providerList})
    }catch(error){
        console.log(error)
        return  res.status(500).send({msg : "Error"})
    }
}

// Deleting the provider that has an account. 
const deleteProvider = async (req, res) => {
    try{
         
        const providerId = req.params; 
        const deleteProvider = await User.findByIdAndDelete(providerId)
        if(!deleteProvider){
            res.status(400).send({msg : "No provider found"})
        }
        
        return res.status(200).send({msg : "Provider deleted Successfully"})
    }catch(eror){
        return res.status(500).send({msg : "Error"})
    }
}


module.exports = { fetchUsers, deleteUser, fetchProviders, deleteProvider}