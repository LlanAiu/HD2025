import { useState } from "react";
import { PlayerData, Role } from "../data/types";

interface PlayerSelectorProps {
    player: PlayerData,
    players: PlayerData[];
    onSelect: (player: PlayerData, selectedPlayer: PlayerData) => void;
    ignore_mafia: boolean;
    ignore_self: boolean;
    night: boolean;
    title?: string;
}

export default function PlayerSelector({
    player, 
    players, 
    onSelect, 
    title = "Select a Player", 
    ignore_mafia,
    ignore_self,
    night
} : PlayerSelectorProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
    const [message, setMessage] = useState<string>("");
    const [selected, setSelected] = useState(false);

    const handleSelect = (selectedPlayer: PlayerData) => {
        if(!selected) {
            setSelectedPlayer(s => selectedPlayer);
        }
    };

    const handleSubmit = () => {
        if (selectedPlayer !== null && !selected) {
            if(night && player.role === Role.DETECTIVE) {
                if (selectedPlayer.role === Role.MAFIA) {
                    setMessage(`${selectedPlayer.name} IS a mafia member`);
                } else {
                    setMessage(`${selectedPlayer.name} is NOT a mafia member`);
                }
                setSelected(true);
            } else {
                setSelected(true);
                onSelect(player, selectedPlayer);
            }
        }
    }

    const detectiveSubmit = () => {
        if (selectedPlayer !== null) {
            onSelect(player, selectedPlayer);
        }
    }

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {players.map(p =>
                    (ignore_mafia && p.role == Role.MAFIA) || (ignore_self && p === player) ? 
                        (<div key={p.name}></div>) 
                            :
                        (
                            <li key={p.name}>
                                <button
                                    onClick={() => handleSelect(p)}
                                    className={`w-full py-2 px-4 rounded ${selectedPlayer?.name === p.name ? 'bg-blue-600 text-white font-bold' : 'bg-blue-500 text-white'}`}
                                >
                                    {p.name}
                                </button>
                            </li>
                        )
                )}
            </ul>
            <button onClick={handleSubmit}>Confirm</button>
            {message !== "" && 
                <div>
                    <p>{message}</p>
                    <button onClick={detectiveSubmit}>Continue</button>
                </div>
            }
        </div>
    );
}
