import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/1077/1077012.png"
    },
    availableListing: {
        type: Number,
        default: 1
    },
    contactOwner: {
        remainingContact: {
            type: Number,
            default: 3,
        },
        contactedOwner: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Listing",
            },
        ],
    },




}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;