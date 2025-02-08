'use client'

import { redirect } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";

export default function Page() {
    const [id, setId] = useState("");
    const [players, setPlayers] = useState(8);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // fetch request

        
        redirect(`/play/${id}`)
    }

    return (
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <div>
                    <label htmlFor="game_id">Game ID:</label>
                    <input
                        type="text"
                        name="game_id"
                        id="game_id"
                        placeholder="Must be unique"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="players"># of Players:</label>
                    <input
                        type="range"
                        name="players"
                        id="players"
                        min={7}
                        max={16}
                        value={players}
                        onChange={(e) => setPlayers(Number(e.target.value))}
                        required
                    />
                    <p>{players}</p>
                </div>
                
                <button type="submit">Play</button>
            </form>
        </div>
    );
}