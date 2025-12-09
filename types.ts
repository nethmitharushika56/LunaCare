
export type ViewState = 'dashboard' | 'cycle' | 'pregnancy' | 'symptom-ai' | 'reproductive-health' | 'community' | 'learn' | 'shop' | 'profile' | 'settings' | 'help';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  goal: 'track' | 'conceive' | 'pregnancy' | 'health';
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string; // ISO date
  registeredWorkshopIds?: string[];
  avatar?: string;
}

export interface CycleDay {
  date: string;
  dayOfCycle: number;
  flow?: 'light' | 'medium' | 'heavy' | 'spotting';
  symptoms: string[];
  mood?: string;
  isPeriod: boolean;
  isOvulation: boolean;
  isFertile: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatRoomMessage {
  id: string;
  sender: string;
  senderId: string;
  avatar: string;
  text: string;
  timestamp: string; // ISO date
}

export interface Product {
  id: string;
  name: string;
  category: 'hygiene' | 'fertility' | 'pregnancy' | 'wellness';
  price: number;
  image: string;
  rating: number;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  timeAgo: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  readTime: string;
}

export interface Workshop {
  id: string;
  title: string;
  host: string;
  date: string;
  attendees: number;
  image: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'info';
  message: string;
  date: string;
  read: boolean;
  actionLabel?: string;
}

export interface HealthReportAnalysis {
  id: string;
  date: string;
  type: 'Blood Work' | 'Ultrasound' | 'Hormone Panel';
  summary: string;
  metrics: {
    name: string;
    value: string;
    status: 'Normal' | 'Low' | 'High' | 'Critical';
  }[];
  recommendations: string[];
}
