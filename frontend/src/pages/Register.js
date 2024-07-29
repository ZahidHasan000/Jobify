import { useState, useEffect } from "react"
import { Logo, FormRow, Alert } from "../components"
import Wrapper from "../assets/wrappers/RegisterPage"
import { useAppContext } from "../context/appContext"

//Programatically Navigate to dashboard
import { useNavigate } from "react-router-dom";

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
    // showAlert: true
    // showAlert: false
}

const Register = () => {
    //Programatically Navigate to dashboard
    const navigate = useNavigate();

    const [values, setValues] = useState(initialState);

    //global state and useNavigate
    const {
        //Programatically Navigate to dashboard
        user,

        isLoading,
        showAlert,
        displayAlert,

        //register user setup
        registerUser,

        loginUser,

        setupUser
    } = useAppContext()

    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    const handleChange = (e) => {
        // console.log(e.target)

        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // console.log(e.target)

        const { name, email, password, isMember } = values;
        if (!email || !password || (!isMember && !name)) {
            displayAlert()
            return
        }

        //register user setup
        const currentUser = { name, email, password }
        // if (isMember) {
        //     // console.log("Already a member")
        //     loginUser(currentUser)
        // }
        // else {
        //     registerUser(currentUser)
        // }

        if (isMember) {
            setupUser({
                currentUser,
                endPoint: "login",
                alertText: "Login successful! Redirecting..."
            })
        }
        else {
            setupUser({
                currentUser,
                endPoint: "register",
                alertText: "User created! Redirecting..."
            })
        }

        // console.log(values)
    }

    //Programatically Navigate to dashboard
    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate("/")
            }, 3000)
        }
    }, [user, navigate])

    return (
        <Wrapper className="full-page">
            <form className="form" onSubmit={onSubmit}>
                <Logo />
                {/* <h3>Login</h3> */}

                <h3>{values.isMember ? "Login" : "Register"}</h3>
                {/* {values.showAlert && <Alert />} */}
                {showAlert && <Alert />}

                {/* name input */}
                {!values.isMember && (
                    <FormRow
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                    />
                )}

                {/* email input */}
                <FormRow
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                />

                {/* password input */}
                <FormRow
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                />

                {/* <button type="submit" className="btn btn-block">
                    submit
                </button> */}

                {/* //register user setup */}
                <button type="submit" className="btn btn-block" disabled={isLoading} >
                    submit
                </button>

                <p>
                    {values.isMember ? "Not a member yet?" : "Already a member?"}

                    <button type="button" onClick={toggleMember} className="member-btn">
                        {values.isMember ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </Wrapper>
    )
}

export default Register
