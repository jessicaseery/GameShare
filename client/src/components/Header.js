import React, {useState, useEffect} from "react"
import styled, { keyframes } from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Searchbar from "./Searchbar"

const Header = ({gameNamesAndIds , setLoggedInUser , loggedInUser}) => {
    const [activePopup, setActivePopup] = useState(null);
    const navigate = useNavigate()
    const handleSwitchToSignUp = () => {
        setActivePopup("signup");
    };
    const togglePopup = (popup) => {
        setActivePopup(activePopup === popup ? null : popup);
    };
    
    useEffect(() => {
        const closePopupOnOutsideClick = (event) => {
        const popupElement = document.getElementById(activePopup);
        if ( activePopup && (!popupElement || (!popupElement.contains(event.target) &&  event.target.className !== "allowed-click"))) {
            setActivePopup(null);
        }
        };
        document.addEventListener("mousedown", closePopupOnOutsideClick);
        return () => {
        document.removeEventListener("mousedown", closePopupOnOutsideClick);
        };
    }, [activePopup]);
    const handleSignIn = (userDetails) => {
        setLoggedInUser(userDetails);
    };
    
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        navigate("/")
    };

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
        console.log("Stored User:", storedUser);
        setLoggedInUser(storedUser)
        }
    }, [setLoggedInUser]);
    return (
        <Wrapper>
        <CompanyName to="/">GameShare</CompanyName>
        <Searchbar gameNamesAndIds={gameNamesAndIds}/>
        {loggedInUser ? (
            <UserProfile>
            <Link to={`/profile/${loggedInUser.userId}`} style={{ textDecoration: "none" }}>
                <HelloUserButton>Hello, {loggedInUser.firstName}</HelloUserButton>
            </Link>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </UserProfile>
        ) : (
        <div>
            <LogIn onClick={() => togglePopup("signin")}>Sign In</LogIn>
            <LogIn onClick={() => togglePopup("signup")}>Sign Up</LogIn>
        </div>
        )}
        {activePopup === "signin" && (
        <SignIn onClose={() => setActivePopup(null)} onSwitchToSignUp={handleSwitchToSignUp}/>
        )}
        {activePopup === "signup" && (
        <SignUp isOpen={activePopup === "signup"} onClose={() => setActivePopup(null)} onSignUp={handleSignIn} onSignIn={() => togglePopup("signin")}/>
        )}
    </Wrapper>
)
}
const LogoutButton = styled.button`
background-color: #2b2a2c;
color: white;
border: none;
border-radius: 5px;
padding: 8px 16px;
cursor: pointer;
margin-left: 10px;

&:hover {
    background-color: #1c1b1d;
}
`;
const HelloUserButton = styled.button`
background: none;
border: none;
cursor: pointer;
font-size: 16px;
color: #fff;
margin-right: 10px;
`;
const UserProfile = styled.div`
color: white;
font-size: 18px;
font-family: 'Khand', sans-serif;
margin-left: 80%;
margin-top: -50px;

`;
const Wrapper = styled.div`
background-color: #2B2A2C;
height: 50px;
padding: 15px;
width: 100%;
position: fixed;
z-index: 900;
`
const LogIn = styled.div`
color: white;
margin-left: 90%;

margin-top: -40px;
font-size: 19px;
font-family: 'Khand', sans-serif;
cursor: pointer;
`

const flashAnimation = keyframes`
0% {
    background-position: 0% 50%;
}
50% {
    background-position: 100% 50%;
}
100% {
    background-position: 0% 50%;
}
`;

const CompanyName = styled(Link)`
color: white;
text-decoration: none;
font-size: 55px;
font-family: 'Khand', sans-serif;
font-weight: bold;
position: relative;
display: inline-block;
overflow: hidden;
&:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
    to right,
    #6717A3, /* Dark Purple color */
    #AA0FF2,
    #F10FF2 /* Light Purple color, adjust as needed */
    );
    background-size: 200% 100%;
    animation: ${flashAnimation} 4s linear infinite;
}
`;

export default Header