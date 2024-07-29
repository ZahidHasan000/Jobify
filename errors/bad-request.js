import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

//BadRequestError and NotFoundError
class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export default BadRequestError;