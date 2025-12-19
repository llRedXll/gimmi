
export type GiftStatus = 'AVAILABLE' | 'CLAIMED';
export type Priority = 'High' | 'Medium' | 'Low';

export interface WishlistItem {
  id: string;
  name: string;
  priceRange: string;
  priority: Priority;
  status: GiftStatus;
  imageUrl?: string;
  link?: string;
  notes?: string;
  claimedByMe?: boolean;
}

export interface SizeItem {
  id: string;
  label: string;
  value: string;
}

export interface UserProfile {
  id: string;
  name: string;
  birthday: string; // YYYY-MM-DD format for easier editing
  sizes: SizeItem[];
  interests: string[];
  dislikes: string[];
  wishlist: WishlistItem[];
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  nextBirthday: string; // e.g. "Jan 15"
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: string[]; // Avatar URLs
  description: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface FriendRequest {
  id: string;
  fromName: string;
  fromAvatar: string;
  timestamp: string;
}
