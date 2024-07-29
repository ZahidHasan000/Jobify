// import React, { useState, useReducer, useContext } from "react";

import React, { useReducer, useContext } from "react";
import reducer from "./reducers";

//register user complete
import axios from "axios";

import {
    DISPLAY_ALERT,
    CLEAR_ALERT,

    //register user setup
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,

    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,

    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR,

    TOGGLE_SIDEBAR,

    LOGOUT_USER,

    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR
} from "./actions";

//Persist User in Local Storage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

const initialState = {

    isLoading: false,
    // isLoading: true,
    showAlert: false,
    alertText: '',
    alertType: '',

    // //register user setup
    // user: null,
    // token: null,
    // userLocation: "",

    // //register user complete
    // jobLocation: "",

    //Persist User in Local Storage
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || "",
    jobLocation: userLocation || "",

    showSidebar: false
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    // const [state, setState] = useState(initialState);

    const [state, dispatch] = useReducer(reducer, initialState);

    //Axios Global setup
    // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

    //Axios Custom setup
    const authFetch = axios.create({
        baseURL: "/api/v1",
        // baseURL: 'http://localhost:3000/api/v1'
        // headers: {
        //     Authorization: `Bearer ${state.token}`
        // }
    });

    //Axios request interceptors
    authFetch.interceptors.request.use(
        (config) => {
            // config.headers.common['Authorization'] = `Bearer ${state.token}`
            config.headers.Authorization = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    //Axios response interceptors
    authFetch.interceptors.response.use(
        (response) => {
            console.log('Response data:', response.data);
            return response
        },
        (error) => {
            // console.log(error.response)
            if (error.response.status === 401) {
                // console.log("AUTH ERROR")
                logoutUser()
            }
            console.error('An error occurred:', error);
            return Promise.reject(error)
        }
    )


    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT });

        clearAlert();
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)
    }

    //Persist User in Local Storage
    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
        localStorage.setItem("location", location)
    }

    //Persist User in Local Storage
    const removeUserFromLocalStorage = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("location")
    }

    //register user setup
    const registerUser = async (currentUser) => {
        // console.log(currentUser)

        //register user complete
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post("/api/v1/auth/register", currentUser);
            // console.log(response)
            const { user, token, location } = response.data;
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } })

            //Persist User in Local Storage
            addUserToLocalStorage({ user, token, location })

        } catch (error) {
            // console.log(error.response)
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }

    //login user
    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post("/api/v1/auth/login", currentUser);

            const { user, token, location } = data;
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location } })

            //Persist User in Local Storage
            addUserToLocalStorage({ user, token, location })

        } catch (error) {
            dispatch({ type: LOGIN_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }

    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);

            const { user, token, location } = data;
            dispatch({ type: SETUP_USER_SUCCESS, payload: { user, token, location, alertText } })

            //Persist User in Local Storage
            addUserToLocalStorage({ user, token, location })

        } catch (error) {
            dispatch({ type: SETUP_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage();
    }

    const updateUser = async (currentUser) => {
        // console.log(currentUser)
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            //Axios Custom setup
            const { data } = await authFetch.patch("/auth/updateUser", currentUser

            // const { data } = await axios.patch("api/v1/auth/updateUser", currentUser,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${state.token}`
            //         }
            //     }
            )

            const { user, location, token } = data
            console.log(data);

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, location, token }
            })
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: error.response.data.msg }
                })
            }
        }
        clearAlert()
    }



    return (
        // <AppContext.Provider value={{...state}}>
        <AppContext.Provider value={{
            ...state,
            displayAlert,

            //register user setup
            registerUser,

            loginUser,

            setupUser,

            toggleSidebar,

            logoutUser,

            updateUser
        }}>

            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }