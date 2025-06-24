import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    
        return false;
    } else {
        // Extract the token by removing 'Bearer ' prefix
        const token = authHeader.split(' ')[1];
        // Verify the token
       const isValid =  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    
            if (err) {
                console.log('Failed to authenticate token')
                return false;
                // return res.status(403).json({
                //     "status": 403,
                //     "message": "Failed to authenticate token",
                //     "data": [],
                // });

            } else {
                return true;
            }
        });

        return isValid;
    }
};

export default verifyToken;