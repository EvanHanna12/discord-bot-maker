import React, { useState, useEffect } from 'react';
import { Play, Square, Activity, Clock, Bot, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BotManager = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBots();
    const interval = setInterval(fetchBots, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBots = async () => {
    try {
      const response = await axios.get('/api/bots/status');
      setBots(response.data);
    } catch (error) {
      console.error('Error fetching bots:', error);
      setError('Failed to load bot status');
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async (botId) => {
    try {
      await axios.post('/api/stop-bot', { botId });
      fetchBots(); // Refresh the list
    } catch (error) {
      console.error('Error stopping bot:', error);
      alert('Failed to stop bot');
    }
  };

  const formatUptime = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bot Manager
          </h1>
          <p className="text-xl text-white/70">
            Monitor and control your active Discord bots
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {bots.length === 0 ? (
          <div className="glass-effect rounded-xl p-12 text-center">
            <Bot className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">
              No Active Bots
            </h2>
            <p className="text-white/70 mb-6">
              You don't have any bots running at the moment. Create a new bot to get started!
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-discord-green/20 border border-discord-green/50 text-discord-green px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Ready to create</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bots.map((bot) => (
              <div key={bot.botId} className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-discord-green/20 rounded-lg p-3">
                      <Bot className="h-6 w-6 text-discord-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Bot {bot.botId.slice(0, 8)}...
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <div className="flex items-center space-x-1">
                          <Activity className="h-4 w-4" />
                          <span className={bot.status === 'running' ? 'text-discord-green' : 'text-discord-red'}>
                            {bot.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatUptime(bot.startTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-discord-green/20 border border-discord-green/50 text-discord-green px-3 py-1 rounded-lg text-sm">
                      Active
                    </div>
                    <button
                      onClick={() => handleStopBot(bot.botId)}
                      className="bg-discord-red hover:bg-discord-red/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
                
                {/* Bot Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-discord-green" />
                      <span className="text-white font-medium">Status</span>
                    </div>
                    <p className="text-2xl font-bold text-discord-green">
                      {bot.status === 'running' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-discord-blurple" />
                      <span className="text-white font-medium">Uptime</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatUptime(bot.startTime)}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="h-4 w-4 text-discord-yellow" />
                      <span className="text-white font-medium">Bot ID</span>
                    </div>
                    <p className="text-sm font-mono text-white/70 break-all">
                      {bot.botId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 glass-effect rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-discord-blurple/20 rounded-lg p-4 w-fit mx-auto mb-4">
                <Bot className="h-8 w-8 text-discord-blurple" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create New Bot</h3>
              <p className="text-white/70 text-sm mb-4">
                Generate a new Discord bot with our templates
              </p>
              <button className="bg-discord-blurple hover:bg-discord-blurple/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                Create Bot
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-discord-green/20 rounded-lg p-4 w-fit mx-auto mb-4">
                <Play className="h-8 w-8 text-discord-green" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start All Bots</h3>
              <p className="text-white/70 text-sm mb-4">
                Start all your configured bots at once
              </p>
              <button className="bg-discord-green hover:bg-discord-green/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                Start All
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-discord-red/20 rounded-lg p-4 w-fit mx-auto mb-4">
                <Square className="h-8 w-8 text-discord-red" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Stop All Bots</h3>
              <p className="text-white/70 text-sm mb-4">
                Stop all running bots safely
              </p>
              <button className="bg-discord-red hover:bg-discord-red/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                Stop All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotManager; 