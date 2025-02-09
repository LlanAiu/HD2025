import { useState } from "react";
import { PlayerData, Role } from "../data/types";

interface PlayerSelectorProps {
    players: PlayerData[];
    onSelect: (player: PlayerData) => void;
    ignore_mafia: boolean;
    title?: string;
}

export default function PlayerSelector({ players, onSelect, title = "Select a Player", ignore_mafia }: PlayerSelectorProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

    const handleSelect = (player: PlayerData) => {
        setSelectedPlayer(s => player);
        onSelect(player);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {players.map(player => 
                    ignore_mafia && player.role == Role.MAFIA ? (<div key={player.name}></div>) : 
                    (
                        <li key={player.name}>
                            <button 
                                onClick={() => handleSelect(player)}
                                className={`w-full py-2 px-4 rounded ${selectedPlayer?.name === player.name ? 'bg-blue-600 text-white font-bold' : 'bg-blue-500 text-white'}`}
                            >
                                {player.name}
                            </button>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
