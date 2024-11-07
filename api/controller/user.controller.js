import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js"
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
    res.json(
        { message: "Test API called" }
    )
}

export const updateUser = async (req, res, next) => {
    console.log("updateUser route called");

    if (req.user.id !== req.params.id) {
        return next(errorHandler(400, "You can only update your own account"));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true }
            /*By default, findOneAndUpdate() returns the document as it was before update was applied.
             If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.*/
        )

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(400, "you can delete only your account"))
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted")
    } catch (error) {
        return next(errorHandler(500, error.message))
    }
}

export const getUserListing = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return next(errorHandler(400, "you can only view your listing"))
        } else {
            const listing = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listing);
        }
    } catch (error) {
        return next(errorHandler(500, error.message))

    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, "User Not found!"));
        }
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        return next(errorHandler(500, error.message));

    }
}