import { PlayerData, Role } from "../data/types";
import PlayerSelector from "./player_selector";

interface NightRoleSelectorProps {
    player: PlayerData;
    players: PlayerData[];
    onSelect: (player: PlayerData) => void;
}

const activeNightRoles = [Role.MAFIA, Role.DETECTIVE, Role.DOCTOR];

export default function NightRoleSelector({ player, players, onSelect }: NightRoleSelectorProps) {
    if (!activeNightRoles.includes(player.role)) {
        return null;
    }

    return (
        <div>
            <h3>Night Role Action</h3>
            <PlayerSelector players={players} onSelect={onSelect} />
        </div>
    );
}
