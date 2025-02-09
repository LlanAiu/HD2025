import { useState, useEffect, KeyboardEvent } from 'react';
import { Message, PlayerData } from '../data/types';

interface DiscussionProps {
    player: PlayerData;
    toDisplay: Message[];
    sendMessage: (message: string) => void;
    continueTurn: () => void;
    pollDiscussion: () => void;
}

export default function Discussion({player, toDisplay, sendMessage, continueTurn} : DiscussionProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage('');
            sendMessage(message);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto">
            <div className="mb-4">
                <p className="text-2xl font-bold">Chat</p>
            </div>
            <div className="mb-4 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 bg-white border border-gray-200 rounded">{msg}</div>
                ))}
            </div>

            {player.alive &&
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button 
                        onClick={handleSend}
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                        Send
                    </button>
                </div>
            }

            {!player.alive && 
                <div>
                    <button onClick={continueTurn}> Continue </button>
                </div>
            }
        </div>
    );
}