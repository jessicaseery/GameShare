import React from "react"
import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom"

const Header = () => {

    return (
        <Wrapper>
            <CompanyName to="/">GameShare</CompanyName>
        </Wrapper>
    )
}
const Wrapper = styled.div`
background-color: #2B2A2C;
height: 50px;
padding: 15px;

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