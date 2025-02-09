'use client'

import { useState, useEffect } from "react";
import Ready from "../game_states/ready";
import Night from "../game_states/night";
import Discussion from "../game_states/discussion";
import Accusation from "../game_states/accusation";
import { testStates } from "../data/test_states";
import { GameState, PlayerData, Role, State } from "../data/types";
import Voting from "../game_states/voting";
import { accusePlayer, castVote, defend, discuss, healPlayer, investigatePlayer, killPlayer, sleepNight } from "../data/socket_client";

export default function Game({ game_id, init_state }: { game_id: string, init_state: GameState }) {
    const id = game_id;
    const test_states: GameState[] = testStates;
    const [state, setState] = useState<GameState>(init_state);
    const [round, setRound] = useState<number>(1);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [index, setIndex] = useState(0);

    const humanName = state.human;
    const human: PlayerData = state.players.find(player => player.name === humanName) || {
        name: "Test",
        alive: true,
        role: Role.VILLAGER
    };

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/game/${game_id}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setState(s => data);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [game_id]);

    const start = () => {
        setState((prevState) => ({
            ...prevState,
            state: State.NIGHT
        }));
    }

    const vote = (accused: "Y" | "N") => {
        if (socket) {
            castVote(socket, game_id, accused);
        }
    };

    const nightAction = (player: PlayerData, selectedPlayer: PlayerData) => {
        if (socket) {
            if (player.role === Role.DETECTIVE) {
                investigatePlayer(socket, id, selectedPlayer.name);
            } else if (player.role === Role.DOCTOR) {
                healPlayer(socket, id, selectedPlayer.name);
            } else if (player.role === Role.MAFIA) {
                killPlayer(socket, id, selectedPlayer.name);
            }
        }
    }

    const sleep = () => {
        if (socket) {
            sleepNight(socket, id);
        }
    }

    const sendMessage = (message: string) => {
        if (socket) {
            discuss(socket, id, message);
        }
    }

    const accuse = (player: PlayerData, selectedPlayer: PlayerData) => {
        if (socket) {
            accusePlayer(socket, id, selectedPlayer.name);
        }
    }

    const sendDefenseMessage = (message: string) => {
        if (socket) {
            defend(socket, id, message);
        }
    }



    return (
        <>
            {state.state === State.READY && 
                <Ready 
                    player={human} 
                    onStart={start}
                />
            }
            {state.state === State.NIGHT && 
                <Night 
                    round={round} 
                    player={human} 
                    players={state.players} 
                    handleSelect={nightAction} 
                    sleep={sleep}
                />
            }
            {state.state === State.DISCUSSION && 
                <Discussion 
                    toDisplay={state.discussion}
                    sendMessage={sendMessage}
                />
            }
            {state.state === State.ACCUSATION && 
                <Accusation 
                    humanPlayer={human}
                    players={state.players}
                    humanAccused={state.accused === humanName}
                    humanAccusing={state.accuser === humanName}
                    onAccuse={accuse}
                    sendDefenceMessage={sendDefenseMessage}
                />
            }
            {state.state === State.VOTING && 
                <Voting 
                    accused={state.accused} 
                    onVote={vote} 
                />
            }

            <div className="mt-5">
                <button className='block' onClick={() => {
                    setIndex(s => (s + 1) % test_states.length)
                    setState(test_states[index])
                }}>
                    Change State
                </button>
            </div>
        </>
    );
}