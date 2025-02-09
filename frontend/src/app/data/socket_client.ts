import { Actions, SocketData } from "./types";

export function fetchGameState(socket: WebSocket, id: string) {
    console.log(`fetchGameState called with id: ${id}`);
    socket.send(JSON.stringify({game_id: id}));
}

export function castVote(socket: WebSocket, id: string, vote: "Y" | "N") {
    console.log(`castVote called with id: ${id}, vote: ${vote}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.VOTE,
        voted: vote
    };

    socket.send(JSON.stringify(data));
}

export function accusePlayer(socket: WebSocket, id: string, accused: string) {
    console.log(`accusePlayer called with id: ${id}, accused: ${accused}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.ACCUSE,
        accused: accused
    };

    socket.send(JSON.stringify(data));
}

export function discuss(socket: WebSocket, id: string, discussed: string) {
    console.log(`discuss called with id: ${id}, discussed: ${discussed}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.DISCUSS,
        discussed: discussed
    };

    socket.send(JSON.stringify(data));
}

export function healPlayer(socket: WebSocket, id: string, healed: string) {
    console.log(`healPlayer called with id: ${id}, healed: ${healed}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.HEAL,
        healed: healed
    };

    socket.send(JSON.stringify(data));
}

export function investigatePlayer(socket: WebSocket, id: string, investigate: string) {
    console.log(`investigatePlayer called with id: ${id}, investigate: ${investigate}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.INVESTIGATE,
        investigate: investigate
    };

    socket.send(JSON.stringify(data));
}

export function killPlayer(socket: WebSocket, id: string, kill: string) {
    console.log(`killPlayer called with id: ${id}, kill: ${kill}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.KILL,
        kill: kill
    };

    socket.send(JSON.stringify(data));
}

export function defend(socket: WebSocket, id: string, defence: string) {
    console.log(`defend called with id: ${id}, defence: ${defence}`);
    const data: SocketData = {
        game_id: id,
        action_type: Actions.DEFEND,
        defence: defence
    };

    socket.send(JSON.stringify(data));
}

