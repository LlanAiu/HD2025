'use client'

import { useState, useEffect } from "react";
import Ready from "../game_states/ready";
import Night from "../game_states/night";
import Discussion from "../game_states/discussion";
import Accusation from "../game_states/accusation";
import { testStates } from "../data/test_states";
import { GameState, PlayerData, Role, State } from "../data/types";
import Voting from "../game_states/voting";
import { castVote } from "../data/socket_client";

export default function Game({ game_id, init_state }: { game_id: string, init_state: GameState }) {
    const id = game_id;
    const test_states: GameState[] = testStates;
    const [state, setState] = useState<GameState>(init_state);
    const [round, setRound] = useState<number>(1);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState(["What"]);

    const [index, setIndex] = useState(0);

    const humanName = state.human;
    const player: PlayerData = state.players.find(player => player.name === humanName) || {
        name: "Test",
        alive: true,
        role: Role.TOWNSPERSON
    };

    const vote = (accused: "Y" | "N") => {
        if (socket) {
            castVote(socket, game_id, accused);
        }
    };

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/game");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data.message]);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [])

    const sendMessage = () => {
        if (socket) {
            socket.send(JSON.stringify({ message: "Hello from Player!" }));
        }
    };

    return (
        <>

            <div className="mb-5">
                <p>Game with ID: {id}</p>
            </div>
            {state.state === State.READY && <Ready player={player} />}
            {state.state === State.NIGHT && <Night round={round} player={player} players={state.players} />}
            {state.state === State.DISCUSSION && <Discussion />}
            {state.state === State.ACCUSATION && <Accusation />}
            {state.state === State.VOTING && <Voting accused={state.accusation} onVote={vote} />}


            <div className="mt-5">
                <button className='block' onClick={() => {
                    setIndex(s => (s + 1) % test_states.length)
                    setState(test_states[index])
                }}>
                    Change State
                </button>

                <button className='block' onClick={sendMessage}>Send Message</button>
                <ul className='block'>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}