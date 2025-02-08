import { PlayerData } from "../data/types";


export default function Ready({ player } : { player : PlayerData}) {
    
    function handleClick() {
        console.log("Start game");
    }

    return (
        <div>
            <p>You are role {player.role}</p>

            <p> Description of Role </p>

            <button onClick={handleClick}>Ready?</button>
        </div>
    );
}