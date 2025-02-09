import React, { useState } from 'react';
import { PlayerData, Role } from '../data/types';
import PlayerSelector from '../components/player_selector';

export default function Accusation() {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const players: PlayerData[] = [
        { name: 'Player1', alive: true, role: Role.TOWNSPERSON },
        { name: 'Player2', alive: true, role: Role.MAFIA },
        { name: 'Player3', alive: true, role: Role.DETECTIVE }
    ];

    const handleAccuse = (player: PlayerData) => {
        setSelectedPlayer(player);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage('');
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Accusation</h2>
            <PlayerSelector 
                players={players} 
                onSelect={handleAccuse} 
                title="Select a player to accuse:"
                ignore_mafia={false}
            />
            {selectedPlayer && <p className="mt-4 text-lg">You have accused: <span className="font-bold">{selectedPlayer.name}</span></p>}
            <div className='mt-5'>
                <h3 className="text-xl font-semibold mb-2">Chat</h3>
                <div className="mb-4 space-y-2">
                    {messages.map((msg, index) => (
                        <p key={index} className="p-2 bg-white border border-gray-200 rounded">{msg}</p>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}