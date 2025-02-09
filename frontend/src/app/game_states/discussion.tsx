import { useState, KeyboardEvent} from 'react';

export default function Discussion() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div>
            <div>
                <p>Chat</p>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}