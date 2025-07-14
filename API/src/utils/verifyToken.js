import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return false;
    }

    try {
        const isValid = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return false
            } else {
                return true;
            }
        });

        return isValid;

    } catch (err) {
        return false;
    }
}

export default verifyToken;