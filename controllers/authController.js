import User from "../models/User.js";

import { StatusCodes } from "http-status-codes"

//Refactor errors
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js"

const register = async (req, res) => {

    // // reason for express-async-errors. Here we can not use try-catch
    // const user = await User.create(req.body);
    // // res.status(201).json({ user })
    // res.status(StatusCodes.OK).json({ user })

    //Check for Empty Values in controller
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        // throw new Error("Please provide all values")

        // CustomAPIError
        // throw new CustomAPIError("Please provide all values")

        //BadRequestError and NotFoundError
        throw new BadRequestError("Please provide all values")
    }

    //Check for duplicate email in controller
    const UserAlreadyExists = await User.findOne({ email });
    if (UserAlreadyExists) {
        throw new BadRequestError("Email already in use")
    }

    const user = await User.create({ name, email, password });

    // create JWT - custom instance method
    // user.createJWT()

    //JWT setup
    const token = user.createJWT()
    // res.status(StatusCodes.OK).json({ user, token})

    // Remove password
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name
        },
        token,
        location: user.location
    })

    // res.status(StatusCodes.OK).json({ user })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide all values")
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    // console.log(user);

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }

    const token = user.createJWT();

    // ekhn r password show hobe na response e
    user.password = undefined

    res.status(StatusCodes.OK).json({
        user,
        token,
        location: user.location
    })

    // res.send("Login user")
};

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({ _id: req.user.userId })

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user,
        token,
        location: user.location
    })

    // console.log(req.user)

    // res.send("Update user")
};

export { register, login, updateUser }