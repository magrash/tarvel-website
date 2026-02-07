'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';

export default function AIOracle() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const oracleResponses = {
        greeting: "Greetings, traveler. I am the Oracle of the Nile. Tell me your desires, and I shall craft a journey through time itself.",
        destinations: "The ancient lands call to you! Would you seek the mysteries of Giza, the temples of Luxor, or the oasis of Siwa? Each holds secrets waiting to be unveiled.",
        tours: "I sense adventure in your spirit. Our Pharaoh's Legacy tour offers 10 days of royal treatment, while the Nile Explorer reveals the river's ancient secrets in 7 days.",
        booking: "To begin your time-travel journey, visit our booking portal. Choose your timeline, companions, and experience level. The portal awaits at /booking.",
        price: "Our journeys range from €1,299 for desert adventures to €3,999 for the ultimate Pharaoh's Legacy experience. Premium travelers enjoy exclusive access and luxury.",
        default: "The sands of time hold many secrets. Ask me about destinations, tours, prices, or let me recommend the perfect Egyptian adventure for you.",
    };

    const detectIntent = (message) => {
        const lower = message.toLowerCase();
        if (lower.includes('destination') || lower.includes('where') || lower.includes('place')) return 'destinations';
        if (lower.includes('tour') || lower.includes('package') || lower.includes('trip')) return 'tours';
        if (lower.includes('book') || lower.includes('reserve') || lower.includes('how')) return 'booking';
        if (lower.includes('price') || lower.includes('cost') || lower.includes('much')) return 'price';
        return 'default';
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setMessages([{ type: 'oracle', text: oracleResponses.greeting }]);
                    setIsTyping(false);
                }, 1500);
            }, 500);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { type: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const intent = detectIntent(input);
            const response = { type: 'oracle', text: oracleResponses[intent] };
            setMessages((prev) => [...prev, response]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    return (
        <>
            {/* Oracle Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 shadow-lg"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    <span className="text-2xl">𓂀</span>
                </motion.div>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gold-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.button>

            {/* Oracle Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[80vh] bg-obsidian-900/95 backdrop-blur-xl rounded-2xl border border-gold-500/30 shadow-2xl overflow-hidden flex flex-col"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gold-500/20">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-2xl">
                                        𓂀
                                    </div>
                                    <motion.div
                                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-scarab-500 border-2 border-obsidian-900"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-display text-gold-500 font-semibold">AI Travel Oracle</h3>
                                    <p className="text-xs text-white/50">Guardian of Ancient Journeys</p>
                                </div>
                            </div>
                            <motion.button
                                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                                onClick={() => setIsOpen(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                                                ? 'bg-gold-500 text-obsidian-950 rounded-br-md'
                                                : 'bg-obsidian-800 text-white/90 rounded-bl-md border border-gold-500/20'
                                            }`}
                                    >
                                        {msg.type === 'oracle' && (
                                            <span className="text-gold-500 mr-2">𓂀</span>
                                        )}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    className="flex justify-start"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="bg-obsidian-800 border border-gold-500/20 rounded-2xl rounded-bl-md p-3 flex items-center gap-2">
                                        <span className="text-gold-500">𓂀</span>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full bg-gold-500"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick suggestions */}
                        <div className="px-4 py-2 border-t border-gold-500/10">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {['Destinations', 'Tours', 'Prices', 'Book Now'].map((suggestion) => (
                                    <motion.button
                                        key={suggestion}
                                        className="px-3 py-1.5 rounded-full border border-gold-500/30 text-gold-500 text-xs whitespace-nowrap hover:bg-gold-500/10 transition-colors"
                                        onClick={() => {
                                            setInput(suggestion);
                                            setTimeout(() => handleSend(), 100);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Sparkles className="w-3 h-3 inline mr-1" />
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gold-500/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask the Oracle..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-obsidian-800 border border-gold-500/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500 transition-colors"
                                />
                                <motion.button
                                    className="p-3 rounded-xl bg-gold-500 text-obsidian-950"
                                    onClick={handleSend}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!input.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
