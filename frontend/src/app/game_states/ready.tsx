import { PlayerData } from "../data/types";


export default function Ready({ player } : { player : PlayerData}) {
    
    function handleClick() {
        console.log("Start game");
    }

    const roleDescriptions: { [key: string]: string } = {
        "mafia": "You are part of the Mafia. Your goal is to eliminate all the other players.",
        "detective": "You are the Detective. Your goal is to find out who the Mafia members are.",
        "doctor": "You are the Doctor. Your goal is to save players from being eliminated.",
        "townsperson": "You are a Townsperson. Your goal is to survive and find out who the Mafia members are."
    };

    const roleDescription = roleDescriptions[player.role.valueOf()] || "No description available for this role.";

    return (
        <div>
            <p>You are role {player.role}</p>

            <p> {roleDescription} </p>

            <button onClick={handleClick}>Ready?</button>
        </div>
    );
}