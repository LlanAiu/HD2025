import { PlayerData, Role } from "../data/types";
import NightRoleSelector from "../components/night_role_selector";

interface NightProps {
    player: PlayerData;
    players: PlayerData[];
    handleSelect: (player: PlayerData, selectedPlayer: PlayerData) => void;
    sleep: () => void;
}

export default function Night({player, players, handleSelect, sleep }: NightProps) {

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Night Time</h2>
            <NightRoleSelector player={player} players={players} onSelect={handleSelect} />
            {(player.role === Role.VILLAGER || !player.alive) && <button onClick={sleep}> Continue </button>}
        </div>
    );
}