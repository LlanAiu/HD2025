import { PlayerData, Role } from "../data/types";
import NightRoleSelector from "../components/night_role_selector";

interface NightProps {
    round: number;
    player: PlayerData;
    players: PlayerData[];
}

export default function Night({ round, player, players }: NightProps) {

    function handleSelect(player: PlayerData) {
        console.log(`Selected ${player.name}`);
        //TODO
    }

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Night {round}</h2>
            <NightRoleSelector player={player} players={players} onSelect={handleSelect} />
        </div>
    );
}