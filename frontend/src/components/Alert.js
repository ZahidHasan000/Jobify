import { useAppContext } from "../context/appContext"

const Alert = () => {
    const { alertType, alertText } = useAppContext()
    return (
        // <div className="alert alert-success"> //for green font
        // <div className="alert alert-danger">
        //     alert goes here
        // </div>

        // reason for dynamic alert
        <div className={`alert alert-${alertType}`}>
            {alertText}
        </div>
    )
}

export default Alert
