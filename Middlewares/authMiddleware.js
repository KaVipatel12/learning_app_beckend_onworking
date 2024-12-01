const jwt = require("jsonwebtoken");
const User = require("../Models/user-model");
const Provider = require("../Models/provider-model");

const authUserMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    // Remove 'Bearer' from token
    const jwtToken = token.replace('Bearer', "").trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (isVerified) {
            const userData = await User.findOne({ email: isVerified.email });

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

module.exports = {authUserMiddleware, authProviderMiddleware};
