import { PlayerData, Role } from "../data/types";
import PlayerSelector from "./player_selector";

interface NightRoleSelectorProps {
    player: PlayerData;
    players: PlayerData[];
    onSelect: (player: PlayerData, selectedPlayer: PlayerData) => void;
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
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-2">{prompts[player.role]}</h3>
            <PlayerSelector player={player} players={players} onSelect={onSelect} ignore_mafia={player.role === Role.MAFIA} ignore_self={player.role === Role.MAFIA || player.role === Role.DETECTIVE}/>
        </div>
    );
}
