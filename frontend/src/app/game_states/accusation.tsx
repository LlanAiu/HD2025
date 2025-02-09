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
        <div>
            <h2>Accusation</h2>
            <PlayerSelector 
                players={players} 
                onSelect={handleAccuse} 
                title="Select a player to accuse:"
            />
            {selectedPlayer && <p>You have accused: {selectedPlayer.name}</p>}
            <div>
                <h3>Chat</h3>
                <div>
                    {messages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}