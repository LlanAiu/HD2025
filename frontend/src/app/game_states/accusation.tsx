import React, { useEffect, useState } from 'react';
import { PlayerData, Role, State } from '../data/types';
import PlayerSelector from '../components/player_selector';

interface AccusationProps {
    humanPlayer: PlayerData;
    players: PlayerData[];
    humanAccused: boolean,
    humanAccusing: boolean,
    onAccuse: (player: PlayerData, selectedPlayer: PlayerData) => void;
    sendDefenceMessage: (message: string) => void;
    continueTurn: (next: State) => void;
    pollDiscussion: () => void;
}

export default function Accusation({ humanPlayer, players, humanAccused, humanAccusing, onAccuse, sendDefenceMessage, continueTurn, pollDiscussion }: AccusationProps) {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            pollDiscussion();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage('');
            sendDefenceMessage(newMessage);
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Accusation</h2>
            {(humanPlayer.alive && humanAccusing) &&
                <PlayerSelector
                    player={humanPlayer}
                    players={players}
                    onSelect={onAccuse}
                    title="Select a player to accuse:"
                    ignore_mafia={false}
                    ignore_self={true}
                    night={false}
                />
            }
            {selectedPlayer && <p className="mt-4 text-lg">You have accused: <span className="font-bold">{selectedPlayer.name}</span></p>}
            <div className='mt-5'>
                <h3 className="text-xl font-semibold mb-2">Chat</h3>
                <div className="mb-4 space-y-2">
                    {messages.map((msg, index) => (
                        <p key={index} className="p-2 bg-white border border-gray-200 rounded">{msg}</p>
                    ))}
                </div>
                {(humanPlayer.alive && humanAccused) &&
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
                }
            </div>

            {((!humanAccused && !humanAccusing) || !humanPlayer.alive) &&

                <button onClick={() => continueTurn(State.VOTING)}> Continue </button>
            }
        </div>
    );
}