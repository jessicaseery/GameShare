import React, {useState, useEffect} from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8000/users/${id}`)
            .then((response) => response.json())
            .then((data) => setUserProfile(data))
            .catch((error) => console.error("Error fetching user data:", error));
        }
    }, [id]);
    useEffect(() => {
        if (userProfile && userProfile.favorites) {
            Promise.all(userProfile.favorites.map((gameId) =>
                fetch(`http://localhost:8000/games/${gameId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Error fetching game: ${response.status}`);
                        }
                        return response.json();
                    })
            ))
            .then((gamesData) => setFavoriteGames(gamesData))
            .catch((error) => console.error("Error fetching games:", error.message));
        }
    }, [userProfile]);

    const handleDeleteAccount = () => {
        try {
            if (!userProfile) {
                console.error("User profile not available");
                return;
            }
            const userId = userProfile._id;
            fetch(`http://localhost:8000/users/${userId}`, {
                method: "DELETE",
            })
            .then((response) => {
                if (response.ok) {
                    console.log("Account deleted successfully");
                    localStorage.removeItem("loggedInUser");
                    navigate("/");
                    window.location.reload(true);
                } else {
                    throw new Error(`Error deleting account: ${response.status} - ${response.statusText}`);
                }
            })
            .catch((error) => {
                console.error("Error deleting account:", error);
            });
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
    <Wrapper>
        {userProfile && (
        <div>
            <Profilepic src={`data:image/jpeg;base64,${userProfile?.profilepic?.data}`} alt="Profile Picture"/>
            <FullName>{`${userProfile.firstName}`} {`${userProfile.lastName}`}</FullName>
            <p>{`@${userProfile.username}`}</p>
            <p>Bio?</p>
            <FavGameArea>
            <Subtitle>Favourite Games</Subtitle>
            <GamesList>
                {favoriteGames.map((game) => (
                    <Link to={`/games/${game._id}`} key={game._id}>
                        <Game>
                            <GameImage src={game.bkg_img} alt={game.name} />
                            <GameName>{game.name}</GameName>
                        </Game>
                    </Link>
                ))}
            </GamesList>
            </FavGameArea>
            <DeleteButton onClick={handleDeleteAccount}>Delete Account</DeleteButton>
        </div>
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
const DeleteButton = styled.button`
background-color: red;
color: white;
cursor: pointer;
`
const FullName = styled.h1`
font-size: 45px;
font-family: 'Khand', sans-serif;
`
const FavGameArea = styled.div`
width: 75%;
`
const GamesList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #3e3e3e;
    height: 100%;
`;

const Game = styled.div`
    position: relative;
    filter: grayscale(20%);

&:hover {
    filter: grayscale(0%);
}
`;

const GameImage = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
`;
const Subtitle = styled.p`
font-size:30px;
text-decoration: underline;
margin-top: 20px;
font-family: 'Khand', sans-serif;
`

const GameName = styled.p`
    color: white;
    text-align: center;
    position: absolute;
    bottom: 50%;
    left: 0;
    right: 0;
    font-size: 20px;
    font-family: 'Khand', sans-serif;
    font-weight: bold;
    text-shadow: 1px 3px 2px black;
`;
export default Profile