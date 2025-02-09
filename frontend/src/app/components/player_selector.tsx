import { useState } from "react";
import { PlayerData } from "../data/types";

interface PlayerSelectorProps {
    players: PlayerData[];
    onSelect: (player: PlayerData) => void;
    title?: string;
}

export default function PlayerSelector({ players, onSelect, title = "Select a Player" }: PlayerSelectorProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

    const handleSelect = (player: PlayerData) => {
        setSelectedPlayer(s => player);
        onSelect(player);
    };

    return (
        <div>
            <h3>{title}</h3>
            <ul>
                {players.map(player => (
                    <li key={player.name}>
                        <button 
                            onClick={() => handleSelect(player)}
                            style={{ fontWeight: selectedPlayer?.name === player.name ? 'bold' : 'normal' }}
                        >
                            {player.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
