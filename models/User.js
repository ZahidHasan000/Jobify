import mongoose from "mongoose";
import validator from "validator";

// Hash password
import bcrypt from "bcryptjs";

//JWT setup
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 8,

        // Remove password
        select: false
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "lastName",
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: "my city"
    },
})

// Mongoose middleware
UserSchema.pre("save", async function () {
    // console.log(this.password)

    // console.log(this.modifiedPaths());
    // console.log(this.isModified("name"))

    if(!this.isModified("password")) return

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

})

// create JWT - custom instance method
UserSchema.methods.createJWT = function () {
    // console.log(this)

    //JWT setup
    // return jwt.sign({ userId: this._id }, "jwtSecret", { expiresIn: "1d" })

    // Secret and Lifetime
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model("User", UserSchema);