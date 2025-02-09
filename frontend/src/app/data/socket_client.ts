import { Actions, SocketData } from "./types";

export function fetchGameState(socket: WebSocket, id: string) {
    socket.send(JSON.stringify({game_id: id}));
}

export function castVote(socket: WebSocket, id: string, vote: "Y" | "N") {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.VOTE,
        voted: vote
    };

    socket.send(JSON.stringify(data));
}

export function accusePlayer(socket: WebSocket, id: string, accused: string) {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.ACCUSE,
        accused: accused
    };

    socket.send(JSON.stringify(data));
}

export function discuss(socket: WebSocket, id: string, discussed: string) {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.DISCUSS,
        discussed: discussed
    };

    socket.send(JSON.stringify(data));
}

export function healPlayer(socket: WebSocket, id: string, healed: string) {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.HEAL,
        healed: healed
    };

    socket.send(JSON.stringify(data));
}

export function investigatePlayer(socket: WebSocket, id: string, investigate: string) {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.INVESTIGATE,
        investigate: investigate
    };

    socket.send(JSON.stringify(data));
}

export function killPlayer(socket: WebSocket, id: string, kill: string) {
    const data: SocketData = {
        game_id: id,
        action_type: Actions.KILL,
        kill: kill
    };

    socket.send(JSON.stringify(data));
}