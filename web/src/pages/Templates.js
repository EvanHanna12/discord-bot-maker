import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, MessageSquare, Music, Settings, Bot, ArrowRight, Check } from 'lucide-react';
import axios from 'axios';

const Templates = () => {
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bot Templates
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Choose from our collection of pre-built templates to create your perfect Discord bot
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {Object.entries(templates).map(([key, template]) => {
            const Icon = templateIcons[key];
            const colorClass = templateColors[key];
            
            return (
              <div key={key} className="glass-effect rounded-xl p-8 card-hover">
                <div className="flex items-start space-x-6">
                  <div className={`${colorClass} rounded-xl p-4 flex-shrink-0`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {template.name}
                    </h2>
                    <p className="text-white/70 mb-6">
                      {template.description}
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-3">Features:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {template.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-discord-green" />
                            <span className="text-white/80 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-3">Commands:</h3>
                      <div className="flex flex-wrap gap-2">
                        {template.commands.map((command, index) => (
                          <span
                            key={index}
                            className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-mono"
                          >
                            {command}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link
                      to="/create"
                      state={{ selectedTemplate: key }}
                      className="inline-flex items-center space-x-2 bg-discord-blurple hover:bg-discord-blurple/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                      <Bot className="h-5 w-5" />
                      <span>Use This Template</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Template Section */}
        <div className="mt-16 glass-effect rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Something Custom?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Can't find the perfect template? Create a custom bot from scratch with our advanced builder
          </p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-discord-blurple to-purple-600 hover:from-discord-blurple/90 hover:to-purple-600/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
          >
            <Bot className="h-6 w-6" />
            <span>Create Custom Bot</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Templates; 