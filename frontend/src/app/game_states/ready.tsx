import { PlayerData } from "../data/types";

interface ReadyProps {
    player: PlayerData,
    onStart: () => void
}

export default function Ready({ player, onStart } : ReadyProps) {
    
    function handleClick() {
        onStart();
    }

    const roleDescriptions: { [key: string]: string } = {
        "mafia": "You are part of the Mafia. Your goal is to eliminate all the other players.",
        "detective": "You are the Detective. Your goal is to find out who the Mafia members are.",
        "doctor": "You are the Doctor. Your goal is to save players from being eliminated.",
        "villager": "You are a Townsperson. Your goal is to survive and find out who the Mafia members are."
    };

    const roleDescription = roleDescriptions[player.role.valueOf()] || "No description available for this role.";

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto text-center">
            <p className="text-lg mb-4">You are role <span className="font-bold">{player.role}</span></p>
            <p className="mb-6">{roleDescription}</p>
            <button 
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                onClick={handleClick}
            >
                Ready
            </button>
        </div>
    );
}