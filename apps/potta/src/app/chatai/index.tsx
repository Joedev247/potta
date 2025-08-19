'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../(routes)/auth/AuthContext';
import {
  webSocketService,
  getAuthToken,
  getUserSession,
  type WebSocketResponse,
  type WebSocketError,
} from './websocket';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  data?: any;
  timestamp: Date;
}

interface WebSocketResponse {
  message: string;
  data: any;
}

interface WebSocketError {
  message: string;
  error_type: string;
}

interface ChatAIProps {
  onClose?: () => void;
}

const ChatAI = ({ onClose }: ChatAIProps) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get auth token from cookies and user session from whoami
  const userAuthToken = token || Cookies.get('auth_token') || '';
  const userSession = user?.id || user?.email || user?.name || 'unknown_user';
  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('wss://tribu.dev.instanvi.com/livra/'); // Replace with your WebSocket URL

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const response: WebSocketResponse | WebSocketError = JSON.parse(
          event.data
        );

        if ('error_type' in response) {
          // Handle error response
          const errorResponse = response as WebSocketError;
          addMessage('bot', `Error: ${errorResponse.message}`, {
            error_type: errorResponse.error_type,
          });
        } else {
          // Handle success response
          const successResponse = response as WebSocketResponse;
          addMessage('bot', successResponse.message, successResponse.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        addMessage(
          'bot',
          'Sorry, I encountered an error processing your request.'
        );
      }

      setIsLoading(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsLoading(false);
      addMessage('bot', 'Connection error. Please try again.');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const addMessage = (type: 'user' | 'bot', content: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      data,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isConnected) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    addMessage('user', userMessage);

    // Send message via WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
      const payload = {
        user_session: userSession,
        user_auth_token: userAuthToken,
        user_prompt: userMessage,
      };
      socket.send(JSON.stringify(payload));
    } else {
      // Fallback for when WebSocket is not available
      setTimeout(() => {
        addMessage(
          'bot',
          "I'm sorry, but I'm currently offline. Please try again later."
        );
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderDataTable = (data: any) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return null;
    }

    return (
      <div className="mt-3 bg-gray-50 p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">
          Data Response:
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {Object.keys(data).map((key) => (
                  <th
                    key={key}
                    className="text-left py-2 px-3 font-medium text-gray-600"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(data).map((value, index) => (
                  <td key={index} className="py-2 px-3 text-gray-800">
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-[400px] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 flex rounded-full items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Livra AI</h3>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 rounded-full h-2 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-md ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="w-4 h-4 mt-0.5 text-gray-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  {message.data && renderDataTable(message.data)}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {/* {message.type === 'user' && (
                  <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                )} */}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">
                  Livra is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading || !isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !isConnected}
            className="p-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            Connection lost. Trying to reconnect...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatAI;
