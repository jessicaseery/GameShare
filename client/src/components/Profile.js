import React, {useState, useEffect} from "react"
import styled from "styled-components"

const Profile = ({ loggedInUser }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (loggedInUser) {
        fetch(`http://localhost:8000/users/${loggedInUser.userId}`)
            .then((response) => response.json())
            .then((data) => setUserProfile(data))
            .catch((error) => console.error("Error fetching user data:", error));
        }
    }, [loggedInUser]);

    return (
    <Wrapper>
        {userProfile && (
        <>
            <Profilepic src={`data:image/jpeg;base64,${userProfile?.profilepic?.data}`} alt="Profile Picture"/>
            <FullName>{`${userProfile.firstName}`} {`${userProfile.lastName}`}</FullName>
            <p>{`@${userProfile.username}`}</p>
            <p>Bio?</p>
        </>
        )}
    </Wrapper>
    );
};
const Wrapper = styled.div`
padding-top: 120px;
color: white;
background-color: #3e3e3e;
height: 100vh;
text-align: center;
`
const Profilepic = styled.img`
width: 300px;
border-radius: 50%;
`
const FullName = styled.h1`
font-size: 45px;
font-family: 'Khand', sans-serif;
`
export default Profile