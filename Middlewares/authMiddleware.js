const jwt = require("jsonwebtoken");
const User = require("../Models/user-model");
const Provider = require("../Models/provider-model");

const authUserMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    // Remove 'Bearer' from token
    const jwtToken = token.replace('Bearer', "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (isVerified) {
            const userData = await User.findOne({ email: isVerified.email });
            console.log(userData)
            if (!userData) {
                return res.status(404).json({ msg: "User not found" });
            }

            // Attach the user data to the request object to be used in the next middleware/route
            req.user = userData;
            next();  // Continue to     the next middleware or route
        } else {
            return res.status(500).json({ msg: "Token verification failed" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Token verification error", error: err.message });
    }
};

const authProviderMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    // Remove 'Bearer' from token
    const jwtToken = token.replace('Bearer', "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (isVerified) {
            const providerData = await Provider.findOne({ email: isVerified.email });
            if (!providerData) {
                return res.status(401).json({ msg: "User not found" });
            }
             
            if(providerData.role === "provider"){
                 req.provider = providerData;
                next();  // Continue to the next middleware or route
                }
        } else {
            return res.status(401).json({ msg: "Token verification failed" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Token verification error", error: err.message });
    }
};

const courseAccessMiddleware = async(req, res, next) => {
    const courseId = "674c33e69f445a3f969f461e"
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    // Remove 'Bearer' from token
    const jwtToken = token.replace('Bearer', "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (isVerified) {
            const providerData = await Provider.findOne({ email: isVerified.email });
            const userData = await User.findOne({ email: isVerified.email});
            if (!providerData && !userData) {
                return res.status(401).json({ msg: "User not found" });
            }
             if(providerData){
                if(providerData.role === "provider"){
                     const providerVerify = providerData.courses.some(data => data === courseId)
                     req.provider = providerData;
                     next();  // Continue to the next middleware or route
                    }else{
                        res.status(400).send({msg : "Aunauthorized Access"})
                    }
              }
                else if(userData){
                    const isCoursePurchased = userData.purchaseCourse.some(data => data.course === courseId)
                    
                    if(isCoursePurchased){
                        req.user = userData
                        next();
                    } else{
                        res.status(400).send({msg : "Course not purchased"})
                    }
                }else{
                    res.status(400).send({msg : "Aunauthorized Access"})
                }                    
                }}

                catch (err) {
        return res.status(500).json({ msg: "Token verification error", error: err.message });
    }
}
const courseModifyMiddleware = async(req, res, next) => {
    const courseId = "674c33e69f445a3f969f461e"
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    // Remove 'Bearer' from token
    const jwtToken = token.replace('Bearer', "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (isVerified) {
            const providerData = await Provider.findOne({ email: isVerified.email });
            console.log(providerData)
            if (!providerData) {
                return res.status(401).json({ msg: "User not found" });
            }
                if(providerData.role === "provider"){
                     const providerVerify = providerData.courses.some(data => data.equals(courseId))
                     if(providerVerify){
                         req.provider = providerData;
                         next();  // Continue to the next middleware or route
                        }else{
                            res.status(400).send({msg : "Aunauthorized Access course not found"})
                        }
                    }else{
                        res.status(400).send({msg : "Aunauthorized Access"})
                    }
              }
            }

        catch (err) {
        return res.status(500).json({ msg: "Token verification error", error: err.message });
    }
}
module.exports = {authUserMiddleware, authProviderMiddleware, courseAccessMiddleware, courseModifyMiddleware};
