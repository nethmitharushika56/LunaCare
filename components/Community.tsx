import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Post, UserProfile, ChatRoomMessage } from '../types';
import { MessageCircle, Heart, Share2, Search, Edit3, X, Loader2, Send, Users } from 'lucide-react';

interface CommunityProps {
  user: UserProfile;
}

type Tab = 'forum' | 'chat';

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('forum');
  
  // Forum State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatRoomMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load Posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Load Chat when tab switches
  useEffect(() => {
    if (activeTab === 'chat') {
        loadChat();
    }
  }, [activeTab]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  const loadPosts = async () => {
    try {
        const data = await api.community.getPosts();
        setPosts(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingPosts(false);
    }
  };

  const loadChat = async () => {
    setLoadingChat(true);
    try {
        const msgs = await api.community.getChatHistory();
        setChatMessages(msgs);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingChat(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setPosting(true);
    
    const newPost: Post = {
        id: Date.now().toString(),
        author: user.name,
        avatar: user.avatar || 'https://ui-avatars.com/api/?background=f43f5e&color=fff&name=' + user.name,
        content: newPostContent,
        likes: 0,
        comments: 0,
        tags: ['General'],
        timeAgo: 'Just now'
    };

    try {
        await api.community.createPost(newPost);
        await loadPosts();
        setShowPostModal(false);
        setNewPostContent('');
    } catch (e) {
        console.error(e);
    } finally {
        setPosting(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const newMsg: ChatRoomMessage = {
        id: Date.now().toString(),
        sender: user.name,
        senderId: user.id,
        avatar: user.avatar || 'https://ui-avatars.com/api/?background=f43f5e&color=fff&name=' + user.name,
        text: chatInput,
        timestamp: new Date().toISOString()
    };

    // Optimistic update
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    try {
        await api.community.sendChatMessage(newMsg);
    } catch (e) {
        console.error("Failed to send message", e);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in relative">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Community</h2>
             
             {/* Tabs */}
             <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                 <button 
                    onClick={() => setActiveTab('forum')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'forum' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                 >
                    Discussions
                 </button>
                 <button 
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                 >
                    Group Chat
                 </button>
             </div>
        </div>

        {/* FORUM VIEW */}
        {activeTab === 'forum' && (
            <div className="space-y-6 overflow-y-auto pb-20 pr-1">
                <div className="flex justify-between items-center gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search topics (e.g. PCOS, TTC)..." 
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 dark:text-white"
                        />
                    </div>
                    <button 
                        onClick={() => setShowPostModal(true)}
                        className="bg-rose-500 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-rose-200 dark:shadow-rose-900/40 hover:bg-rose-600 transition-colors whitespace-nowrap"
                    >
                        <Edit3 size={18} /> <span className="hidden md:inline">New Post</span>
                    </button>
                </div>

                {/* Pinned Groups */}
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-3">Popular Groups</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {[
                            {name: 'TTC Warriors', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'},
                            {name: 'PCOS Support', color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'},
                            {name: 'Pregnancy 2024', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'},
                            {name: 'Postpartum Care', color: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300'}
                        ].map((group) => (
                            <div key={group.name} className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity ${group.color}`}>
                                # {group.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-4">
                    {loadingPosts ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-rose-500" />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No posts found.</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 object-cover" />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{post.author}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{post.timeAgo}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-6 border-t border-slate-50 dark:border-slate-800 pt-3">
                                    <button className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 text-sm transition-colors">
                                        <Heart size={18} /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors">
                                        <MessageCircle size={18} /> {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-green-500 dark:hover:text-green-400 text-sm transition-colors ml-auto">
                                        <Share2 size={18} /> Share
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* CHAT VIEW */}
        {activeTab === 'chat' && (
            <div className="flex flex-col flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-4">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
                    <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full text-rose-600 dark:text-rose-400">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">General Wellness Room</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">24 Online • Global Chat</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                    {loadingChat ? (
                        <div className="flex justify-center py-10">
                             <Loader2 className="animate-spin text-rose-500" />
                        </div>
                    ) : (
                        chatMessages.map((msg) => {
                            const isMe = msg.senderId === user.id;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <img 
                                        src={msg.avatar} 
                                        alt={msg.sender} 
                                        className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 object-cover flex-shrink-0" 
                                    />
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            isMe 
                                            ? 'bg-rose-500 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                        }`}>
                                            {!isMe && <span className="block text-[10px] font-bold text-rose-500 dark:text-rose-400 mb-0.5">{msg.sender}</span>}
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white transition-all"
                        />
                        <button 
                            onClick={handleSendChat}
                            disabled={!chatInput.trim()}
                            className="bg-rose-500 text-white p-3 rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-rose-200 dark:shadow-rose-900/40"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Create Post Modal */}
        {showPostModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in p-6 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Discussion</h3>
                        <button onClick={() => setShowPostModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's on your mind? Share your journey or ask a question..."
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-sm dark:text-white"
                    />

                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim() || posting}
                            className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-rose-200 dark:shadow-rose-900/40 hover:bg-rose-600 disabled:opacity-70 transition-colors flex items-center gap-2"
                        >
                            {posting ? <Loader2 className="animate-spin" size={18} /> : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Community;