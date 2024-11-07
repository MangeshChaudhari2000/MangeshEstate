import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {

    const { userName, email, password } = req.body;
    const hashedPassord = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, email, password: hashedPassord });
    try {
        await newUser.save();
        res.status(201).json("User Created succesfully!")
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"))
        }
        const token = jwt.sign({ id: validUser._id }, process.env.jwt_secret,{expiresIn:'1h'});
        //destructing & removing password
        const { password: passsss, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true,maxAge: 60 * 60 * 1000 }).status(200).json(rest);

    } catch (error) {
        console.log(error);

        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_cookie');
        res.status(200).json("User has been logged out!")
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const { email, name, photo } = req.body;
        console.log(email, " ", name, " ", photo);

        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.jwt_secret);
            const { password: pass, ...rest } = user._doc;
            //cookie(keyname, value, {httpOnly:true} for security)
            console.log("rest old user");
            console.log(rest);

            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)

        } else {
            //1. creating password as google does not provid password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassord = bcryptjs.hashSync(generatedPassword, 10);
            //2. creating Unique UserName as google does not provid userName by rmoing space & adding random digi at end
            const generatedUniqueUserName = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            //3. saving into database
            const newUser = new User({ userName: generatedUniqueUserName, email, password: hashedPassord, avatar: photo });
            await newUser.save();

            //4. creating token & saving ino cookie & sending response
            const token = jwt.sign({ id: newUser._id }, process.env.jwt_secret);
            const { password: randomdggd, ...rest } = newUser._doc;
            console.log("rest new user");
            console.log(rest);

            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        console.log(error);

        next(error)
    }
}