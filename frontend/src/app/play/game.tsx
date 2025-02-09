'use client'

import { useState, useEffect } from "react";
import Ready from "../game_states/ready";
import Night from "../game_states/night";
import Discussion from "../game_states/discussion";
import Accusation from "../game_states/accusation";
import { testStates } from "../data/test_states";
import { GameState, PlayerData, Role } from "../data/types";

export default function Game({ game_id }: { game_id: string }) {
    const id = game_id;
    const test_states: GameState[] = testStates;
    const [state, setState] = useState<GameState>(test_states[0]);
    const [round, setRound] = useState<number>(1);

    const humanName = state.human;
    const player: PlayerData = state.players.find(player => player.name === humanName) || {
        name: "Test",
        alive: true,
        role: Role.TOWNSPERSON
    };

    return (
        <>
            {state.state === "ready" && <Ready player={player} />}
            {state.state === "night" && <Night round={round} player={player} players={state.players} />}
            {state.state === "discussion" && <Discussion />}
            {state.state === "accusation" && <Accusation />}

            <div>
                <p>Game with ID: {id}</p>
            </div>

            <button onClick={() => setState(test_states[Math.floor(Math.random() * test_states.length)])}>
                Change State Randomly
            </button>
        </>
    );
}