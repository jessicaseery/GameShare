import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Searchbar = ({ gameNamesAndIds }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
        setRecommendations([]);
    } else {
        const matchingGames = gameNamesAndIds.filter(
        (game) =>
            game.name.toLowerCase().includes(value.toLowerCase())
        );
        setRecommendations(matchingGames);
    }
    };

    const handleRecommendationClick = (recommendation) => {
    console.log(`Clicked on recommendation: ${recommendation.name}`);
    navigate(`/games/${recommendation.id}`);
    setSearchTerm("");
    setRecommendations([]);
    };

    useEffect(() => {
    const closePopupOnOutsideClick = (event) => {
    const searchBarElement = document.getElementById("search-bar");
        if ( searchBarElement && !searchBarElement.contains(event.target)) {
        setSearchTerm("");
        setRecommendations([]);
        }
    };
    document.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
        document.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
    }, [searchTerm]);

    return (
    <SearchbarWrapper id="search-bar">
        <Input type="text" placeholder="Search for a game" value={searchTerm} onChange={handleInputChange}/>
        {recommendations.length > 0 && (
        <RecommendationsList>
            {recommendations.map((recommendation, index) => (
            <RecommendationItem key={index} onClick={() => handleRecommendationClick(recommendation)}>
                {recommendation.name}
            </RecommendationItem>
            ))}
        </RecommendationsList>
        )}
    </SearchbarWrapper>
    );
};

const SearchbarWrapper = styled.div`
position: relative;
`;

const Input = styled.input`
color: black;
margin-left: 250px;
margin-top: -40px;
position: fixed;
padding: 8px;
width: 200px;
`;

const RecommendationsList = styled.ul`
list-style: none;
padding: 0;
margin: 0;
position: absolute;
top: 100%;
margin-left: 250px;
background-color: white;
border: 1px solid #3f3f3f;
border-radius: 5px;
z-index: 1;
`;

const RecommendationItem = styled.li`
padding: 8px;
cursor: pointer;

&:hover {
    background-color: lightpink;
}
`;

export default Searchbar;