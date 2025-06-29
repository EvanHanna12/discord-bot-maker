import React, { useState, useEffect } from 'react';
import { Bot, Download, Play, Settings, Shield, Users, MessageSquare, Music } from 'lucide-react';
import axios from 'axios';

const BotCreator = () => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    botName: '',
    botToken: '',
    prefix: '!',
    features: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBot, setGeneratedBot] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
      setSelectedTemplate(Object.keys(response.data)[0]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-bot', {
        template: selectedTemplate,
        ...formData
      });

      setGeneratedBot(response.data);
    } catch (error) {
      console.error('Error generating bot:', error);
      setError(error.response?.data?.error || 'Failed to generate bot');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedBot) {
      window.open(`http://localhost:5000${generatedBot.downloadUrl}`, '_blank');
    }
  };

  const handleStartBot = async () => {
    try {
      await axios.post('/api/start-bot', {
        botId: generatedBot.botId,
        botToken: formData.botToken,
        prefix: formData.prefix
      });
      alert('Bot started successfully!');
    } catch (error) {
      console.error('Error starting bot:', error);
      alert('Failed to start bot');
    }
  };

  const templateIcons = {
    moderation: Shield,
    fun: Users,
    modmail: MessageSquare,
    music: Music,
    utility: Settings
  };

  const templateColors = {
    moderation: 'bg-red-500',
    fun: 'bg-yellow-500',
    modmail: 'bg-blue-500',
    music: 'bg-green-500',
    utility: 'bg-purple-500'
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Discord Bot
          </h1>
          <p className="text-xl text-white/70">
            Choose a template and customize your bot settings
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Template Selection */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Choose Template</h2>
            <div className="space-y-4">
              {Object.entries(templates).map(([key, template]) => {
                const Icon = templateIcons[key];
                const colorClass = templateColors[key];
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTemplate === key
                        ? 'bg-discord-blurple/20 border-2 border-discord-blurple'
                        : 'glass-effect hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${colorClass} rounded-lg p-2`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {template.name}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    {selectedTemplate === key && (
                      <div className="mt-4">
                        <h4 className="text-white font-semibold mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-white/20 text-white px-2 py-1 rounded text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bot Configuration Form */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Bot Configuration</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Bot Name
                </label>
                <input
                  type="text"
                  name="botName"
                  value={formData.botName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-discord-blurple"
                  placeholder="My Awesome Bot"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Bot Token
                </label>
                <input
                  type="password"
                  name="botToken"
                  value={formData.botToken}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-discord-blurple"
                  placeholder="Enter your Discord bot token"
                  required
                />
                <p className="text-white/60 text-sm mt-1">
                  Get your bot token from the Discord Developer Portal
                </p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Command Prefix
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-discord-blurple"
                  placeholder="!"
                  maxLength="3"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-discord-blurple hover:bg-discord-blurple/90 disabled:bg-discord-blurple/50 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Bot...</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-5 w-5" />
                    <span>Generate Bot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Generated Bot Section */}
        {generatedBot && (
          <div className="mt-8 glass-effect rounded-xl p-6 animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">
                🎉 Bot Generated Successfully!
              </h2>
              <p className="text-white/70">
                Your Discord bot is ready to use
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download Bot Files</span>
              </button>
              <button
                onClick={handleStartBot}
                className="bg-discord-blurple hover:bg-discord-blurple/90 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Start Bot Now</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Next Steps:</h3>
              <ol className="text-white/70 space-y-1 text-sm">
                <li>1. Download the bot files</li>
                <li>2. Extract the ZIP file to a folder</li>
                <li>3. Open terminal in the folder and run: <code className="bg-black/30 px-2 py-1 rounded">npm install</code></li>
                <li>4. Run the bot: <code className="bg-black/30 px-2 py-1 rounded">npm start</code></li>
                <li>5. Invite the bot to your server using the OAuth2 URL from Discord Developer Portal</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotCreator; 