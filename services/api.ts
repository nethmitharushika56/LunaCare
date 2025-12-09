import { UserProfile, CycleDay, Post, ChatRoomMessage } from '../types';
import { MOCK_USER, FORUM_POSTS, MOCK_CHAT_HISTORY } from '../constants';

// Simulated Network Latency (ms)
const DELAY = 600;

// Local Storage Keys (Acting as Database Tables)
const DB_USERS = 'luna_db_users';
const DB_SESSION = 'luna_db_session_uid';
const DB_CYCLE_LOGS = 'luna_db_cycle_logs';
const DB_POSTS = 'luna_db_posts';
const DB_CHAT = 'luna_db_chat';

// --- Database Helpers (Server-side logic simulation) ---

const getDB = (key: string): any[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveDB = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API Layer ---

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<UserProfile> => {
      await new Promise(resolve => setTimeout(resolve, DELAY));
      const users = getDB(DB_USERS);
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password');
      localStorage.setItem(DB_SESSION, user.id);
      const { password: _, ...userProfile } = user;
      return userProfile as UserProfile;
    },

    signup: async (data: { name: string; email: string; password: string; age: number }): Promise<UserProfile> => {
      await new Promise(resolve => setTimeout(resolve, DELAY));
      const users = getDB(DB_USERS);
      if (users.find((u: any) => u.email === data.email)) throw new Error('User with this email already exists');

      const newUser = {
        id: Date.now().toString(),
        ...data,
        goal: 'track',
        cycleLength: 28,
        periodLength: 5,
        lastPeriodStart: new Date().toISOString(),
        registeredWorkshopIds: [],
      };

      users.push(newUser);
      saveDB(DB_USERS, users);
      localStorage.setItem(DB_SESSION, newUser.id);
      const { password: _, ...userProfile } = newUser;
      return userProfile as UserProfile;
    },

    getSession: async (): Promise<UserProfile | null> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const uid = localStorage.getItem(DB_SESSION);
      if (!uid) return null;
      const users = getDB(DB_USERS);
      const user = users.find((u: any) => u.id === uid);
      if (!user) {
        localStorage.removeItem(DB_SESSION);
        return null;
      }
      const { password: _, ...userProfile } = user;
      return userProfile as UserProfile;
    },

    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.removeItem(DB_SESSION);
    }
  },

  user: {
    updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, DELAY));
        const uid = localStorage.getItem(DB_SESSION);
        if (!uid) throw new Error("Unauthorized");
        const users = getDB(DB_USERS);
        const userIndex = users.findIndex((u: any) => u.id === uid);
        if (userIndex === -1) throw new Error("User not found");
        
        // Ensure we don't accidentally save password via this general method if not intended,
        // though for this mock it's fine.
        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        saveDB(DB_USERS, users);
        const { password: _, ...userProfile } = updatedUser;
        return userProfile as UserProfile;
    },

    changePassword: async (newPassword: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, DELAY));
        const uid = localStorage.getItem(DB_SESSION);
        if (!uid) throw new Error("Unauthorized");
        
        const users = getDB(DB_USERS);
        const userIndex = users.findIndex((u: any) => u.id === uid);
        if (userIndex === -1) throw new Error("User not found");

        users[userIndex].password = newPassword;
        saveDB(DB_USERS, users);
    },

    deleteAccount: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, DELAY + 400));
        const uid = localStorage.getItem(DB_SESSION);
        if (!uid) return;

        // Remove user from DB
        const users = getDB(DB_USERS).filter((u: any) => u.id !== uid);
        saveDB(DB_USERS, users);
        
        // Remove session
        localStorage.removeItem(DB_SESSION);
        
        // Optional: Clean up other related data if necessary
    },

    registerWorkshop: async (workshopId: string): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, DELAY));
        const uid = localStorage.getItem(DB_SESSION);
        if (!uid) throw new Error("Unauthorized");
        
        const users = getDB(DB_USERS);
        const userIndex = users.findIndex((u: any) => u.id === uid);
        if (userIndex === -1) throw new Error("User not found");
        
        const user = users[userIndex];
        const currentRegistrations = user.registeredWorkshopIds || [];
        
        if (!currentRegistrations.includes(workshopId)) {
            user.registeredWorkshopIds = [...currentRegistrations, workshopId];
            users[userIndex] = user;
            saveDB(DB_USERS, users);
        }
        
        const { password: _, ...userProfile } = user;
        return userProfile as UserProfile;
    }
  },

  cycle: {
    getLogs: async (): Promise<CycleDay[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getDB(DB_CYCLE_LOGS);
    },
    logDay: async (log: CycleDay): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const logs = getDB(DB_CYCLE_LOGS);
        // Remove existing log for this date to overwrite
        const filtered = logs.filter((l: CycleDay) => l.date !== log.date);
        filtered.push(log);
        saveDB(DB_CYCLE_LOGS, filtered);
    }
  },

  community: {
    getPosts: async (): Promise<Post[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        let posts = getDB(DB_POSTS);
        if (posts.length === 0) {
            // Seed with constants if empty
            posts = FORUM_POSTS;
            saveDB(DB_POSTS, posts);
        }
        return posts.sort((a: Post, b: Post) => b.id.localeCompare(a.id)); // Simple sort
    },
    createPost: async (post: Post): Promise<Post> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const posts = getDB(DB_POSTS);
        posts.unshift(post);
        saveDB(DB_POSTS, posts);
        return post;
    },
    getChatHistory: async (): Promise<ChatRoomMessage[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        let msgs = getDB(DB_CHAT);
        if (msgs.length === 0) {
            msgs = MOCK_CHAT_HISTORY;
            saveDB(DB_CHAT, msgs);
        }
        return msgs;
    },
    sendChatMessage: async (msg: ChatRoomMessage): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 100)); // fast
        const msgs = getDB(DB_CHAT);
        msgs.push(msg);
        saveDB(DB_CHAT, msgs);
    }
  }
};