'use client'

import { useState, useEffect } from "react";
import Ready from "../game_states/ready";
import Night from "../game_states/night";
import Discussion from "../game_states/discussion";
import Accusation from "../game_states/accusation";
import { testStates } from "../data/test_states";
import { EndResult, GameState, PlayerData, Role, State } from "../data/types";
import Voting from "../game_states/voting";
import { accusePlayer, castVote, continueTurn, defend, discuss, healPlayer, investigatePlayer, killPlayer, nextTurn, pollState, sleepNight } from "../data/socket_client";
import { redirect } from "next/navigation";

export default function Game({ game_id, init_state }: { game_id: string, init_state: GameState }) {
    const id = game_id;
    const test_states: GameState[] = testStates;
    const [state, setState] = useState<GameState>(init_state);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [discussionSocket, setDiscussionSocket] = useState<WebSocket | null>(null);
    
    const [index, setIndex] = useState(0);
    const [human, setHuman] = useState<PlayerData>(() => {
        const players: PlayerData[] = init_state.players || [];

        const humanPlayer: PlayerData = players.find(p => p.name === init_state.human) || {
            name: "Test",
            alive: true,
            role: Role.VILLAGER
        };
        return humanPlayer;
    });

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/game/${game_id}`);
        const discussionWs = new WebSocket(`ws://localhost:8000/ws/player/${game_id}`);

        ws.onmessage = (event) => {
            const data: GameState = JSON.parse(event.data) as GameState;
            console.log(data);
            if (data.game_over === EndResult.MAFIA_WIN) {
                redirect(`./${game_id}/win/mafia`);
            } else if (data.game_over === EndResult.VILLAGER_WIN) {
                redirect(`./${game_id}/win/villagers`);
            }

            const players: PlayerData[] = data["players"] || [];
            
            const humanPlayer: PlayerData = players.find(p => p.name === data.human) || {
                name: "Test",
                alive: true,
                role: Role.VILLAGER
            };

            setHuman(humanPlayer);
            setState(data);
        };

        discussionWs.onmessage = (event) => {

        };

        setSocket(ws);
        setDiscussionSocket(discussionWs);

        return () => {
            ws.close();
            discussionWs.close();
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

    const continueGame = (next: State) => {
        if (socket) {
            continueTurn(socket, id, next);
        }
    }

    const sendMessage = (message: string) => {
        if (discussionSocket) {
            discuss(discussionSocket, id, message);
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

    const pollDiscussion = () => {
        if (socket) {
            pollState(socket, id);
        }
    }

    const next = () => {
        if (socket) {
            nextTurn(socket, id);
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
                    player={human}
                    players={state.players}
                    handleSelect={nightAction}
                    sleep={sleep}
                />
            }
            {state.state === State.DISCUSSION &&
                <Discussion
                    player={human}
                    night_summary={state.night_summary}
                    toDisplay={state.discussion}
                    sendMessage={sendMessage}
                    continueTurn={continueGame}
                    pollDiscussion={pollDiscussion}
                />
            }
            {state.state === State.ACCUSATION &&
                <Accusation
                    humanPlayer={human}
                    players={state.players}
                    humanAccused={state.accused === human.name}
                    humanAccusing={state.accuser === human.name}
                    narratorMessage={state.night_summary}
                    onAccuse={accuse}
                    accusedMessage={state.discussion}
                    sendDefenceMessage={sendDefenseMessage}
                    continueTurn={continueGame}
                    pollDiscussion={pollDiscussion}
                    nextTurn={next}
                />
            }
            {state.state === State.VOTING &&
                <Voting
                    player={human}
                    accused={state.accused}
                    onVote={vote}
                    continueTurn={continueGame}
                    nextTurn={next}
                    narratorMessage={state.night_summary}
                />
            }
        </>
    );
}