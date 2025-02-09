'use client'

import { redirect } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import { create_new_game } from "../data/data_client";

export default function Page() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [players, setPlayers] = useState(8);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        create_new_game({
            game_id: id,
            player_name: name,
            num_players: players
        });
        
        redirect(`/play/${id}`)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={e => handleSubmit(e)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="game_id" className="block text-gray-700 font-bold mb-2">Game ID:</label>
                    <input
                        type="text"
                        name="game_id"
                        id="game_id"
                        placeholder="Must be unique"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="players" className="block text-gray-700 font-bold mb-2"># of Players:</label>
                    <input
                        type="range"
                        name="players"
                        id="players"
                        min={7}
                        max={16}
                        value={players}
                        onChange={(e) => setPlayers(Number(e.target.value))}
                        required
                        className="w-full"
                    />
                    <p className="text-center mt-2">{players}</p>
                </div>
                
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Play</button>
            </form>
        </div>
    );
}