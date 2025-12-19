
import { UserProfile, Friend, Group, FriendRequest } from './types';

export const MOCK_USER: UserProfile = {
  name: 'Alex J.',
  birthday: '1996-01-15',
  id: 'ABC-123-XYZ',
  sizes: [
    { id: '1', label: 'Shirt', value: 'L (Slim Fit)' },
    { id: '2', label: 'Shoe', value: '10 US M' },
    { id: '3', label: 'Jewelry', value: 'Silver' },
  ],
  interests: ['Sci-Fi', 'Coffee', 'Hiking', 'Vinyl Records'],
  dislikes: ['No Strong Perfumes'],
  wishlist: [
    {
      id: '1',
      name: 'New Hiking Boots',
      priceRange: '$150 - $200',
      priority: 'High',
      status: 'CLAIMED',
      imageUrl: 'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&q=80&w=800',
      link: 'https://example.com/boots',
      notes: 'I really prefer the dark brown leather version if possible! Size 10 fits perfect.',
    },
    {
      id: '2',
      name: "Zuckerberg's Biography",
      priceRange: '$20 - $30',
      priority: 'Medium',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      link: 'https://example.com/book',
      notes: 'Hardcover preferred for my collection.',
    },
    {
      id: '3',
      name: 'AeroPress Coffee Maker',
      priceRange: '$40 - $50',
      priority: 'High',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1517080315816-65f5e8d9c639?auto=format&fit=crop&q=80&w=800',
      link: 'https://example.com/coffee',
      notes: 'My old one finally broke! Need this for my morning survival lol.',
    },
    {
      id: '4',
      name: 'Vintage Rolling Stones Vinyl',
      priceRange: '$75 - $120',
      priority: 'Medium',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800',
      link: 'https://example.com/vinyl',
      notes: 'Looking for "Let It Bleed" specifically. Original pressing if you are a baller!',
    },
    {
      id: '5',
      name: 'Smart Wool Socks',
      priceRange: '$15 - $25',
      priority: 'Low',
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1582966772652-132d3080c441?auto=format&fit=crop&q=80&w=800',
      notes: 'You can never have too many socks. Gray or black please.',
    },
  ],
};

export const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Sarah Connor', username: '@sarahC', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', nextBirthday: 'Aug 24' },
  { id: '2', name: 'John Doe', username: '@jdoe', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', nextBirthday: 'Dec 12' },
  { id: '3', name: 'Emily Blunt', username: '@emilyb', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', nextBirthday: 'Feb 14' },
  { id: '4', name: 'Michael Chen', username: '@mikec', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', nextBirthday: 'May 05' },
];

export const MOCK_GROUPS: Group[] = [
  { id: '1', name: 'Family Vacation', memberCount: 5, members: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80'], description: 'Planning the big trip to Italy!', role: 'ADMIN' },
  { id: '2', name: 'Work Besties', memberCount: 8, members: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'], description: 'Lunch crew and meme sharing.', role: 'MEMBER' },
];

export const MOCK_REQUESTS: FriendRequest[] = [
  { id: '1', fromName: 'Dwight Schrute', fromAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', timestamp: '2 days ago' },
];

// Mock data for friend profiles
export const MOCK_FRIEND_PROFILES: Record<string, UserProfile> = {
  '1': {
    id: '1',
    name: 'Sarah Connor',
    birthday: '1995-08-24',
    sizes: [
      { id: '1', label: 'Shirt', value: 'M' },
      { id: '2', label: 'Shoe', value: '8 US W' },
      { id: '3', label: 'Ring', value: 'Size 6' }
    ],
    interests: ['Fitness', 'Robotics', 'Leather Jackets'],
    dislikes: ['Terminators', 'Slow Wifi'],
    wishlist: [
      {
        id: '101',
        name: 'Weighted Vest',
        priceRange: '$50 - $80',
        priority: 'High',
        status: 'AVAILABLE',
        notes: 'For training days.'
      },
      {
        id: '102',
        name: 'Aviator Sunglasses',
        priceRange: '$100 - $150',
        priority: 'Medium',
        status: 'AVAILABLE'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'John Doe',
    birthday: '1990-12-12',
    sizes: [
      { id: '1', label: 'Shirt', value: 'XL' },
      { id: '2', label: 'Hat', value: 'Snapback' }
    ],
    interests: ['Minimalism', 'Tech', 'Coffee'],
    dislikes: ['Clutter'],
    wishlist: [
      {
        id: '201',
        name: 'Mechanical Keyboard',
        priceRange: '$100 - $200',
        priority: 'High',
        status: 'CLAIMED',
        claimedByMe: true, // You claimed this!
        notes: 'Blue switches please.'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Emily Blunt',
    birthday: '1983-02-14',
    sizes: [
      { id: '1', label: 'Dress', value: '4' },
      { id: '2', label: 'Shoe', value: '7' }
    ],
    interests: ['Acting', 'Tea', 'British History'],
    dislikes: ['Loud noises'],
    wishlist: [
      {
        id: '301',
        name: 'Rare Tea Set',
        priceRange: '$80 - $120',
        priority: 'High',
        status: 'AVAILABLE'
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Michael Chen',
    birthday: '1998-05-05',
    sizes: [
      { id: '1', label: 'Jersey', value: 'L' },
      { id: '2', label: 'Shoe', value: '11' }
    ],
    interests: ['Basketball', 'Cooking', 'Anime'],
    dislikes: ['Cilantro'],
    wishlist: [
      {
        id: '401',
        name: 'Chef Knife',
        priceRange: '$120 - $180',
        priority: 'High',
        status: 'AVAILABLE'
      },
      {
        id: '402',
        name: 'Manga Subscription',
        priceRange: '$10/mo',
        priority: 'Low',
        status: 'AVAILABLE'
      }
    ]
  }
};
