import React, { useEffect, useState } from 'react';
import { Message, PlayerData, Role, State } from '../data/types';
import PlayerSelector from '../components/player_selector';

interface AccusationProps {
    humanPlayer: PlayerData;
    players: PlayerData[];
    accusedMessage: Message[];
    narratorMessage: string;
    humanAccused: boolean,
    humanAccusing: boolean,
    onAccuse: (player: PlayerData, selectedPlayer: PlayerData) => void;
    sendDefenceMessage: (message: string) => void;
    continueTurn: (next: State) => void;
    nextTurn: () => void;
    pollDiscussion: () => void;
}

export default function Accusation({ humanPlayer, players, humanAccused, humanAccusing, narratorMessage, accusedMessage, onAccuse, sendDefenceMessage, continueTurn, pollDiscussion, nextTurn }: AccusationProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        setMessages(accusedMessage);
    }, [accusedMessage]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { player_name: humanPlayer.name, message: newMessage }]);
            setNewMessage('');
            sendDefenceMessage(newMessage);
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Accusation</h2>
            <p className="text-gray-700 mb-4">{narratorMessage}</p>
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
            <div className='mt-5'>
                <h3 className="text-xl font-semibold mb-2">Chat</h3>

                <div className="mb-4 space-y-2">
                    {messages.map((msg, index) => (
                        <p key={index} className="p-2 bg-white border border-gray-200 rounded">
                            <span className="font-bold">{msg.player_name}: </span>{msg.message}
                        </p>
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
                        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded">
                            <p className="text-yellow-800">You have been accused! Defend yourself in the chat.</p>
                        </div>
                    </div>
                }
            </div>

            {((humanPlayer.alive && !humanAccused && !humanAccusing) || !humanPlayer.alive) &&
                <button 
                    onClick={() => continueTurn(State.VOTING)} 
                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                > 
                    Continue 
                </button>
            }

            {(humanPlayer.alive && humanAccusing && messages.length > 0) &&
                <button 
                    onClick={nextTurn} 
                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                > 
                    Continue 
                </button>
            }
        </div>
    );
}