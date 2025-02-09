import { PlayerData, Role } from "../data/types";
import PlayerSelector from "./player_selector";

interface NightRoleSelectorProps {
    player: PlayerData;
    players: PlayerData[];
    onSelect: (player: PlayerData) => void;
}

const activeNightRoles = [Role.MAFIA, Role.DETECTIVE, Role.DOCTOR];
const prompts = {
    [Role.MAFIA] : "Select a player to eliminate.",
    [Role.DETECTIVE]: "Select a player to investigate.",
    [Role.DOCTOR]: "Select a player to heal.",
    [Role.TOWNSPERSON]: "Literally Nothing"
};

export default function NightRoleSelector({ player, players, onSelect }: NightRoleSelectorProps) {
    if (!activeNightRoles.includes(player.role)) {
        return null;
    }

    return (
        <div>
            <h3>{prompts[player.role]}</h3>
            <PlayerSelector players={players} onSelect={onSelect} />
        </div>
    );
}
