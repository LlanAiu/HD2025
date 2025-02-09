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