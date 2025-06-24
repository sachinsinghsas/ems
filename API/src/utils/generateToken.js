import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//generate toke that expires in 12 hours
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "12h"});
};

export default generateToken;