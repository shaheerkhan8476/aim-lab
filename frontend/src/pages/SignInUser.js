import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SignInUser()
{
    //Current User Data
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        isAdmin: null,
     });

     //For error stuff if login fail
     const [error, setError] = useState(""); //state for error msg
     const navigate = useNavigate();

     //Listen for user adjustment of html and apply to form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };
    //Handle submit button and make POST request to backend to run /login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch('http://localhost:8080/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) 
            {
                const data = await response.json();
                const token = data.access_token;
                localStorage.setItem("accessToken", token);
                localStorage.setItem("isAdmin", loginData.isAdmin);
                localStorage.setItem("userEmail", loginData.email);
                localStorage.setItem("userPassword", loginData.password);
                console.log('Login Successful', data);
                //compares if user is instructor or student
                if(loginData.isAdmin === 'True')
                {
                    navigate("/InstructorDashboard");
                }
                else{
                    navigate("/StudentDashboard")
                }
                
            }
            else
            {
                setError(response.statusText || "Login failed. Try again!")
                console.error('Failed to login', response.statusText);
            }
        }
        catch (error)
        {
            setError("Failed login!")
            console.error('Error logining user', error);
        }
        
    }

    //Render the HTML form so the user can interact
    return(
        <>
            <form onSubmit={handleSubmit}>
                <h1>Login:</h1>
                
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Enter email" 
                    required>
                </input>

                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter password" 
                    required>

                </input>

                <button type="submit">Login!</button>

            </form>
            <br></br>
            {error}
            <br></br>
            <br></br>
            <NavLink to="/">Click for account creation page</NavLink>
        </>


    )



}

export default SignInUser;