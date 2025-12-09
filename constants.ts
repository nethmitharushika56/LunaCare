import { Product, Post, Article, UserProfile, Workshop, Notification, ChatRoomMessage } from './types';

export const MOCK_USER: UserProfile = {
  id: 'mock-user-1',
  email: 'sarah@example.com',
  name: "Sarah",
  age: 28,
  goal: 'track',
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // Started 12 days ago
};

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Cotton Tampons', category: 'hygiene', price: 8.99, image: 'https://picsum.photos/200/200?random=1', rating: 4.8 },
  { id: '2', name: 'Advanced Ovulation Kit', category: 'fertility', price: 24.99, image: 'https://picsum.photos/200/200?random=2', rating: 4.6 },
  { id: '3', name: 'Prenatal Multivitamin', category: 'pregnancy', price: 35.00, image: 'https://picsum.photos/200/200?random=3', rating: 4.9 },
  { id: '4', name: 'Soothing Heat Patch', category: 'wellness', price: 12.50, image: 'https://picsum.photos/200/200?random=4', rating: 4.7 },
  { id: '5', name: 'Menstrual Cup (Size B)', category: 'hygiene', price: 29.99, image: 'https://picsum.photos/200/200?random=5', rating: 4.5 },
  { id: '6', name: 'Stretch Mark Cream', category: 'pregnancy', price: 18.75, image: 'https://picsum.photos/200/200?random=6', rating: 4.3 },
];

export const FORUM_POSTS: Post[] = [
  { 
    id: '1', 
    author: 'Emily_Runs', 
    avatar: 'https://picsum.photos/50/50?random=10', 
    content: 'Has anyone tried seed cycling for hormonal balance? I am on day 14 and feeling more energetic!', 
    likes: 45, 
    comments: 12, 
    tags: ['PCOS', 'Nutrition'],
    timeAgo: '2h ago'
  },
  { 
    id: '2', 
    author: 'MamaBear2024', 
    avatar: 'https://picsum.photos/50/50?random=11', 
    content: 'Just got my big fat positive (BFP) today! Nervous but excited. Any tips for first trimester nausea?', 
    likes: 128, 
    comments: 43, 
    tags: ['Pregnancy', 'First Trimester'],
    timeAgo: '5h ago'
  },
  { 
    id: '3', 
    author: 'YogaJen', 
    avatar: 'https://picsum.photos/50/50?random=12', 
    content: 'Sharing a gentle yoga flow for severe cramping days. Link in comments!', 
    likes: 89, 
    comments: 8, 
    tags: ['Fitness', 'Period Pain'],
    timeAgo: '1d ago'
  }
];

export const MOCK_CHAT_HISTORY: ChatRoomMessage[] = [
  { id: '1', sender: 'Jessica', senderId: 'u2', avatar: 'https://ui-avatars.com/api/?name=Jessica&background=f0f&color=fff', text: 'Hey everyone! Just joined the group. 👋', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', sender: 'Dr. Emily', senderId: 'u3', avatar: 'https://ui-avatars.com/api/?name=Dr+Emily&background=0ff&color=fff', text: 'Welcome Jessica! Feel free to ask any questions.', timestamp: new Date(Date.now() - 3500000).toISOString() },
  { id: '3', sender: 'Sarah', senderId: 'mock-user-1', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=f43f5e&color=fff', text: 'Hi! Has anyone tried the new yoga workshop yet?', timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: '4', sender: 'Mia', senderId: 'u4', avatar: 'https://ui-avatars.com/api/?name=Mia&background=00f&color=fff', text: 'Yes! It was super relaxing. Highly recommend for cramps.', timestamp: new Date(Date.now() - 900000).toISOString() },
];

export const ARTICLES: Article[] = [
  { id: '1', title: 'Understanding Your Luteal Phase', category: 'Education', image: 'https://picsum.photos/400/250?random=20', readTime: '5 min' },
  { id: '2', title: 'Foods to Boost Fertility naturally', category: 'Nutrition', image: 'https://picsum.photos/400/250?random=21', readTime: '8 min' },
  { id: '3', title: 'Signs of Endometriosis You Shouldn\'t Ignore', category: 'Health', image: 'https://picsum.photos/400/250?random=22', readTime: '6 min' },
  { id: '4', title: 'Postpartum Mental Health Checklist', category: 'Mental Health', image: 'https://picsum.photos/400/250?random=23', readTime: '4 min' },
];

export const WORKSHOPS: Workshop[] = [
  { id: '1', title: 'Holistic PCOS Management', host: 'Dr. Emily Chen', date: 'Oct 15, 2:00 PM', attendees: 120, image: 'https://picsum.photos/400/250?random=30', category: 'Health' },
  { id: '2', title: 'Fertility Yoga Session', host: 'Sarah Yoga', date: 'Oct 18, 10:00 AM', attendees: 45, image: 'https://picsum.photos/400/250?random=31', category: 'Fitness' },
  { id: '3', title: 'Reproductive Anatomy 101', host: 'Nurse Jessica', date: 'Oct 20, 4:00 PM', attendees: 200, image: 'https://picsum.photos/400/250?random=32', category: 'Education' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'alert', message: 'Cycle is 3 days late based on predictions.', date: '2h ago', read: false, actionLabel: 'Log Symptoms' },
  { id: '2', type: 'reminder', message: 'Time for your monthly breast self-exam.', date: '1d ago', read: false, actionLabel: 'View Guide' },
  { id: '3', type: 'info', message: 'New workshop "Endo Awareness" added.', date: '2d ago', read: true, actionLabel: 'Join' },
  { id: '4', type: 'info', message: 'Your community post received 5 new comments.', date: '3d ago', read: true },
];