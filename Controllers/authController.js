const User = require("../Models/user-model")
const Provider = require("../Models/provider-model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


// Profile of the provider 
const providerProfile = async (req, res) => {
  const providerId = req.provider._id; 
  
  const providerData = await Provider.findById(providerId)

  if(!providerData){
     res.status(400).send({ msg : "Login to get the details"})
  }

  res.status(200).send({msg : providerData})
}

// Profile of the User/Student
const userProfile = async (req, res) => {
  const userId = req.user._id; 

  const userData = await User.findById(userId)

  if(!userData){
     res.status(400).send({ msg : "Login to get the details"})
  }

  res.status(200).send({msg : userData})
}

// Registration of Student/Provider / Admin 
const register = async (req, res) => {
    try {
      const { username, email, password, mobile, role } = req.body;

      console.log(req.body)
      // Validate role
      if (role !== "student" && role !== "provider") {
        return res.status(400).json({ message: "Invalid role provided" });
    }
  
      // Check if email exists in both collections to prevent duplication
      const studentExist = await User.findOne({ email });
      const providerExist = await Provider.findOne({ email });
  
      if (studentExist || providerExist) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // Hash the password securely
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create user based on role
      let newUser;
      if (role === "student") {
        newUser = await User.create({ username, email, password: hashedPassword, mobile });
      } else {
        newUser = await Provider.create({ username, email, password: hashedPassword, mobile });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
  
      return res.status(201).json({
        msg: "Registration Successful",
        token: token,
        userId: newUser._id.toString(),
        role: role
      });
  
    } catch (error) {
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  };

// Login of Student/Provider / Admin 
const login = async (req, res) => {
        try {
          const { email, password } = req.body;
      
          const studentExist = await User.findOne({ email });
         const providerExist = !studentExist ? await Provider.findOne({ email }) : null;
      
          if (!studentExist && !providerExist) {
            return res.status(400).json({ msg: "Invalid Email" });
          }
      
          let isPasswordValid;
          let userData;
      
          if (studentExist) {
            isPasswordValid = await bcrypt.compare(password, studentExist.password);
            userData = studentExist;
          } 
          else if (providerExist) {
            isPasswordValid = await bcrypt.compare(password, providerExist.password);
            userData = providerExist;
          }
      
          if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid Credentials" });
          }
      
          const token = jwt.sign(
            { id: userData._id, email: userData.email, role: userData.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
          );
      
          return res.status(200).json({
            msg: "Login Successful",
            token: token,
            userId: userData._id.toString(),
            role: userData.role,
          });
      
        } catch (error) {
          console.error("Error during login:", error);
          res.status(500).json({ msg: "Internal server error", error: error.message });
        }
  };
      
module.exports = {register, login, providerProfile, userProfile}