import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const SignUp = ({ onClose, onSignUp, onSignIn }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [profilepic, setProfilepic] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("username", username);
            formData.append("password", password);
            formData.append("profilepic", profilepic);
    
            const res = await fetch("http://localhost:8000/signup", {
                method: "POST",
                body: formData,
            });
    
            const resData = await res.json();
            if (resData.message === "User signed up successfully") {
                const { userId } = resData;
                onClose();
                onSignUp({ userId, username, firstName, lastName, profilepic });
    
                const signInRes = await fetch("http://localhost:8000/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                const signInData = await signInRes.json();
                if (signInData.message === "User signed in successfully") {
                    const { userId } = signInData;
                    const userRes = await fetch(`http://localhost:8000/users/${userId}`);
                    const userData = await userRes.json();
                    localStorage.setItem("loggedInUser", JSON.stringify({ userId, ...userData }));
                    console.log("Sign in after sign up successful");
                    window.location.reload(true);
                } else {
                    setError("Error signing in after sign up");
                    console.log("Error signing in after sign up");
                }
            } else {
                setError("Error signing up");
                console.log("Error signing up");
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSwitchToSI = (e) => {
        e.preventDefault()
        onClose();
        onSignIn();
    };
    return (
        <Wrapper id="signup">
            <CloseButton onClick={onClose}>X</CloseButton>
            <div className="allowed-click">
                <SignUpTitle>Sign Up</SignUpTitle>
                <FormLayout>
                    <Labels>First Name: <InputBoxes type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Labels>
                    <Labels>Last Name: <InputBoxes type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /></Labels>
                    <Labels>Username: <InputBoxes type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></Labels>
                    <Labels>Password: <InputBoxes type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Labels>
                    <Labels>Profile Picture: <InputBoxes type="file" accept="image/*" onChange={(e) => setProfilepic(e.target.files[0])} /></Labels>
                    {error && <ErrorBox>{error}</ErrorBox>}
                    <Button type="button" onClick={handleSignUp}>Sign up</Button>
                    <NoAccount>
                        <p>Already have an account? Sign in now!</p>
                        <Button onClick={(e) => handleSwitchToSI(e)}>Sign in</Button>
                    </NoAccount>
                </FormLayout>
            </div>
            {loading && <LoadingAnimation></LoadingAnimation>}
        </Wrapper>
    );
};

const NoAccount = styled.div`
    text-align: center;
    margin: 40px;
`;

const SignUpTitle = styled.div`
    text-align: center;
    font-family: 'Khand', sans-serif;
    font-weight: bold;
    font-size: 30px;
`;
const fadeIn = keyframes`
from {
    opacity: 0;
}
to {
    opacity: 1;
}
`
const loadingAnimation = keyframes`
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
`;
const LoadingAnimation = styled.div`
    border: 8px solid #6717A3;
    border-top: 8px solid #AA0FF2;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    margin: auto;
    margin-top: 50px;
    animation: ${loadingAnimation} 1.5s linear infinite;
    `
const Wrapper = styled.div`
    margin-top: 50px;
    background-color: #B49CC1;
    height: 70vh;
    padding: 30px;
    width: 40%;
    position: relative;
    z-index: 100;
    margin: auto;
    border-radius: 10px;
    pointer-events: auto;
    animation: ${fadeIn} 0.5s ease;
    font-family: 'Khand', sans-serif;
`;
const ErrorBox = styled.div`
    color: red;
    margin-top: 10px;
    font-size: 16px;
`;
const Button = styled.button`
margin-top: 20px;
padding: 20px 50px;
border: none;
border-radius: 10px;
font-family: 'Khand', sans-serif;
font-size: 20px;
&:hover {
    background-color: #2B2A2C;
    color:white;
    cursor: pointer;
    text-decoration: underline;
}
`
const InputBoxes = styled.input`
border-color: rgb(211, 211, 211);
border-width: 1px;
border-style: solid;
height: 20px;
margin-left: 5%;
`
const Labels = styled.label`
display: flex;
justify-content: center;
margin-bottom: 8px;
font-size: 20px;
margin-top: 10px;
`
const FormLayout = styled.form`
margin: auto;
text-align: center;
border-radius: 16px;
background-color: white;
padding: 24px;
max-width: 80%;
margin-top: 50px;
box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07);
`

const CloseButton = styled.button`
    background-color: grey;
    margin-left: 97%;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 20px;
    cursor: pointer;
`;
export default SignUp