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
        <div>
            <h2>Night {round}</h2>
            <NightRoleSelector player={player} players={players} onSelect={handleSelect} />
        </div>
    );
}