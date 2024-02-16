import React, {useState, useEffect} from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const Profile = ({loggedInUser}) => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [wishlist, setWishlist] = useState([]);
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
                console.error("User profile cannot be deleted");
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
    useEffect(() => {
        if (id) {
        fetch(`http://localhost:8000/users/${id}/wishlist`)
            .then((response) => response.json())
            .then((wishlistIds) => {
                const promises = wishlistIds.map((gameId) =>
                    fetch(`http://localhost:8000/games/${gameId}`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Error fetching game: ${response.status}`);
                            }
                            return response.json();
                        })
                );
                return Promise.all(promises);
            })
            .then((gamesData) => setWishlist(gamesData))
            .catch((error) =>
            console.error("Error fetching wishlist games:", error)
            );
        }
    }, [id]);

    return (
    <Wrapper>
        <Whole>
        {userProfile && (
        <div>
            <Profilepic src={`data:image/jpeg;base64,${userProfile?.profilepic?.data}`} alt="Profile Picture"/>
            <FullName>{`${userProfile.firstName}`} {`${userProfile.lastName}`}</FullName>
            <p>{`@${userProfile.username}`}</p>
            <Content>
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
            <WishlistArea>
            <Subtitle>Wishlisted</Subtitle>
            <GamesList>
            {wishlist.map((game) => (
                <LinkWishlist to={`/games/${game._id}`} key={game._id}>
                    <GameNameList>{game.name}</GameNameList>
                </LinkWishlist>
                ))}
                </GamesList>
            </WishlistArea>
            </Content>
        {loggedInUser && loggedInUser.userId === userProfile._id && <DeleteButton onClick={handleDeleteAccount}>Delete Account</DeleteButton>}
        </div>
        )}
        </Whole>
    </Wrapper>
    );
};
const Wrapper = styled.div`
padding-top: 120px;
color: white;
height: fit-content;
text-align: center;
padding-bottom: 50px;
`
const Content = styled.div`
display: grid;
grid-template-columns: 80% auto;
`
const LinkWishlist = styled(Link)`
text-decoration: none;
`
const GameNameList = styled.ul`
color: white;
&:hover {
    color: violet;
}
`
const Whole = styled.div`
height: auto;
`
const Profilepic = styled.img`
width: 300px;
border-radius: 50%;
`
const DeleteButton = styled.button`
background-color: red;
padding: 5px 10px;
border-radius: 20px;
color: white;
cursor: pointer;
`
const FullName = styled.h1`
font-size: 45px;
font-family: 'Khand', sans-serif;
`
const FavGameArea = styled.div`
width: 90%;
margin: auto;
`
const WishlistArea = styled.div`
border: 3px solid purple;
box-shadow: 3px 3px 5px deeppink;
margin: 0 auto;
`
const GamesList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin-bottom: 50px;
`;

const Game = styled.div`
    position: relative;
    filter: grayscale(20%);

&:hover {
    filter: grayscale(0%);
}
`;

const GameImage = styled.img`
    width: 250px;
    height: 150px;
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
    position: absolute;
    bottom: 50%;
    left: 0;
    right: 0;
    font-size: 20px;
    font-family: 'Khand', sans-serif;
    font-weight: bold;
    text-shadow: 1px 3px 2px black;
    background-color: rgba(10, 10, 10 ,0.5);
    width: fit-content;
    padding: 3px;
    margin: auto;
`;
export default Profile