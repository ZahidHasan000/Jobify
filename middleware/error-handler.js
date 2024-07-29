import { StatusCodes } from "http-status-codes"

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    // res.status(500).json({ msg: "There was an error" })

    //Check for Empty Values in controller
    // console.log(err.message);

    const defaultError = {
        // statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        // msg: "Something went wrong, try again later"

        // CustomAPIError
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,

        //Check for Empty Values in controller
        msg: err.message || "Something went wrong, try again later"
    }

    // missing field error
    if (err.name === "ValidationError") {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        // defaultError.msg = err.message

        defaultError.msg = Object.values(err.errors).map((item) => item.message).join(",")
    }

    //Unique field error
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }

    res.status(defaultError.statusCode).json({ msg: defaultError.msg })

    // res.status(defaultError.StatusCode).json({ msg: err })

    // res.status(500).json({ msg: err })
}
export default errorHandlerMiddleware;