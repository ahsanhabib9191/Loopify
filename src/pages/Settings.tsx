import React from 'react';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  Key, 
  Save, 
  Globe, 
  Smartphone, 
  Moon, 
  Sun, 
  RefreshCw, 
  LogOut, 
  Link, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'integrations' | 'security';

export function Settings() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile settings
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || '');
  const [bio, setBio] = useState('AI content creator and entrepreneur');
  const [timezone, setTimezone] = useState('America/New_York');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contentReminders, setContentReminders] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  
  // Appearance settings
  const [theme, setTheme] = useState('dark');
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // Integration settings
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message (could use a toast notification here)
    }, 1000);
  };
  
  const handleConnectService = (service: string) => {
    // This would open OAuth flow in real implementation
    alert(`Connecting to ${service}...`);
    
    // Simulate successful connection
    if (service === 'youtube') setYoutubeConnected(true);
    if (service === 'linkedin') setLinkedinConnected(true);
    if (service === 'twitter') setTwitterConnected(true);
    if (service === 'instagram') setInstagramConnected(true);
  };
  
  const handleDisconnectService = (service: string) => {
    if (!confirm(`Are you sure you want to disconnect ${service}?`)) return;
    
    if (service === 'youtube') setYoutubeConnected(false);
    if (service === 'linkedin') setLinkedinConnected(false);
    if (service === 'twitter') setTwitterConnected(false);
    if (service === 'instagram') setInstagramConnected(false);
  };
  
  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Link },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
        <p className="text-gray-400">Customize your Infinitum experience.</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="glass-card p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/30'
                      : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-800/30">
            <button
              onClick={signOut}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/20 text-gray-400 hover:text-red-400"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="glass-card p-6 lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <User size={20} className="text-cyan-400" />
                <span>Profile Settings</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-70"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan (JST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Bell size={20} className="text-cyan-400" />
                <span>Notification Settings</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailNotifications} 
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Content Reminders</h3>
                    <p className="text-sm text-gray-400">Get reminders about upcoming content deadlines</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={contentReminders} 
                      onChange={() => setContentReminders(!contentReminders)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Goal Reminders</h3>
                    <p className="text-sm text-gray-400">Get reminders about upcoming goals and milestones</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={goalReminders} 
                      onChange={() => setGoalReminders(!goalReminders)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Weekly Reports</h3>
                    <p className="text-sm text-gray-400">Receive weekly progress and analytics reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={weeklyReports} 
                      onChange={() => setWeeklyReports(!weeklyReports)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">System Updates</h3>
                    <p className="text-sm text-gray-400">Get notified about new features and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={systemUpdates} 
                      onChange={() => setSystemUpdates(!systemUpdates)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Palette size={20} className="text-cyan-400" />
                <span>Appearance Settings</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        theme === 'dark'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Moon size={20} />
                        <span className="font-medium">Dark Theme</span>
                      </div>
                      <p className="text-xs text-gray-400">Dark background with light text</p>
                    </button>
                    
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        theme === 'light'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Sun size={20} />
                        <span className="font-medium">Light Theme</span>
                      </div>
                      <p className="text-xs text-gray-400">Light background with dark text</p>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Compact Mode</h3>
                    <p className="text-sm text-gray-400">Reduce spacing to show more content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={compactMode} 
                      onChange={() => setCompactMode(!compactMode)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Animations</h3>
                    <p className="text-sm text-gray-400">Enable UI animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={animationsEnabled} 
                      onChange={() => setAnimationsEnabled(!animationsEnabled)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Link size={20} className="text-cyan-400" />
                <span>Integrations</span>
              </h2>
              
              <div className="space-y-6">
                {/* YouTube Integration */}
                <div className="glass-card p-6 bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-500 rounded-lg">
                        <Youtube size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">YouTube</h3>
                        <p className="text-sm text-gray-400 mb-2">Connect your YouTube account to analyze videos and track metrics</p>
                        <div className={`text-xs ${youtubeConnected ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {youtubeConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => youtubeConnected ? handleDisconnectService('youtube') : handleConnectService('youtube')}
                      className={`btn-secondary ${youtubeConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}`}
                    >
                      {youtubeConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
                
                {/* LinkedIn Integration */}
                <div className="glass-card p-6 bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <Linkedin size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">LinkedIn</h3>
                        <p className="text-sm text-gray-400 mb-2">Connect your LinkedIn account to post content and track engagement</p>
                        <div className={`text-xs ${linkedinConnected ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {linkedinConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => linkedinConnected ? handleDisconnectService('linkedin') : handleConnectService('linkedin')}
                      className={`btn-secondary ${linkedinConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}`}
                    >
                      {linkedinConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
                
                {/* Twitter Integration */}
                <div className="glass-card p-6 bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-400 rounded-lg">
                        <Twitter size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">Twitter</h3>
                        <p className="text-sm text-gray-400 mb-2">Connect your Twitter account to post content and track engagement</p>
                        <div className={`text-xs ${twitterConnected ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {twitterConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => twitterConnected ? handleDisconnectService('twitter') : handleConnectService('twitter')}
                      className={`btn-secondary ${twitterConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}`}
                    >
                      {twitterConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
                
                {/* Instagram Integration */}
                <div className="glass-card p-6 bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Instagram size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">Instagram</h3>
                        <p className="text-sm text-gray-400 mb-2">Connect your Instagram account to post content and track engagement</p>
                        <div className={`text-xs ${instagramConnected ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {instagramConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => instagramConnected ? handleDisconnectService('instagram') : handleConnectService('instagram')}
                      className={`btn-secondary ${instagramConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : ''}`}
                    >
                      {instagramConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Shield size={20} className="text-cyan-400" />
                <span>Security Settings</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
                  <div>
                    <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={twoFactorEnabled} 
                      onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
                  </label>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          placeholder="Enter your current password"
                        />
                        <Key size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          placeholder="Enter your new password"
                        />
                        <Key size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          placeholder="Confirm your new password"
                        />
                        <Key size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    
                    <button className="btn-primary mt-2">
                      Change Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t border-gray-800/30">
                  <h3 className="text-white font-medium mb-4">Danger Zone</h3>
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors">
                    Delete Account
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    This action is permanent and cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}