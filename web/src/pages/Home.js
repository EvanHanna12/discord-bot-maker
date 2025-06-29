import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Shield, Users, Download, Play, Code } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Create fully functional Discord bots in minutes with our intuitive interface'
    },
    {
      icon: Shield,
      title: 'Moderation Tools',
      description: 'Built-in moderation commands for kick, ban, mute, and warning systems'
    },
    {
      icon: Users,
      title: 'Community Features',
      description: 'Fun commands, games, and interactive features to engage your community'
    },
    {
      icon: Code,
      title: 'Customizable',
      description: 'Easy to customize and extend with your own commands and features'
    }
  ];

  const templates = [
    {
      name: 'Moderation Bot',
      description: 'Complete moderation suite with advanced features',
      color: 'bg-red-500',
      icon: Shield
    },
    {
      name: 'Fun Bot',
      description: 'Entertainment and games for your server',
      color: 'bg-yellow-500',
      icon: Users
    },
    {
      name: 'Modmail Bot',
      description: 'Private messaging system for support',
      color: 'bg-blue-500',
      icon: Bot
    },
    {
      name: 'Music Bot',
      description: 'High-quality music playback with playlists',
      color: 'bg-green-500',
      icon: Play
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Create Discord Bots
              <span className="text-discord-blurple block">In Minutes</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              The easiest way to create, customize, and deploy Discord bots. 
              No coding experience required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="bg-discord-blurple hover:bg-discord-blurple/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Bot className="h-6 w-6" />
                <span>Start Creating</span>
              </Link>
              <Link
                to="/templates"
                className="glass-effect hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="h-6 w-6" />
                <span>Browse Templates</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Discord Bot Maker?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features that make bot creation simple and efficient
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-effect rounded-xl p-6 card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-discord-blurple/20 rounded-lg p-3 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-discord-blurple" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Popular Bot Templates
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Choose from our collection of pre-built templates to get started quickly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <div
                  key={index}
                  className="glass-effect rounded-xl p-6 card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`${template.color} rounded-lg p-3 w-fit mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {template.description}
                  </p>
                  <Link
                    to="/create"
                    className="text-discord-blurple hover:text-discord-blurple/80 font-semibold transition-colors duration-200"
                  >
                    Use Template →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Create Your Bot?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of users who have created amazing Discord bots with our platform
            </p>
            <Link
              to="/create"
              className="bg-discord-blurple hover:bg-discord-blurple/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center space-x-2"
            >
              <Bot className="h-6 w-6" />
              <span>Get Started Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 