/**
 * Types for the Telegram Theme Preview components
 */

/**
 * Theme colors used for preview rendering
 * Maps to Telegram Desktop theme properties
 */
export interface PreviewThemeColors {
  // Window colors
  windowBg: string;
  windowFg: string;
  windowBgOver: string;
  windowFgOver: string;
  windowBgActive: string;
  windowFgActive: string;
  
  // Chat/History colors
  historyPeer1NameFg: string;
  historyPeer2NameFg: string;
  historyPeer3NameFg: string;
  historyPeer4NameFg: string;
  
  // Message bubbles
  msgInBg: string;
  msgInBgSelected: string;
  msgOutBg: string;
  msgOutBgSelected: string;
  msgInShadow: string;
  msgOutShadow: string;
  
  // Message text
  historyTextInFg: string;
  historyTextOutFg: string;
  
  // Timestamps and meta
  msgInDateFg: string;
  msgOutDateFg: string;
  historyOutIconFg: string;
  historyOutIconFgSelected: string;
  
  // Reply and forward
  msgInReplyBarColor: string;
  msgOutReplyBarColor: string;
  msgInReplyBarSelColor: string;
  msgOutReplyBarSelColor: string;
  
  // Service messages
  msgServiceBg: string;
  msgServiceFg: string;
  
  // Dialogs/sidebar
  dialogsBg: string;
  dialogsNameFg: string;
  dialogsTextFg: string;
  dialogsDateFg: string;
  dialogsBgActive: string;
  dialogsNameFgActive: string;
  dialogsTextFgActive: string;
  dialogsDateFgActive: string;
  dialogsUnreadBg: string;
  dialogsUnreadBgMuted: string;
  dialogsUnreadFg: string;
  
  // Accent colors
  activeButtonBg: string;
  activeButtonFg: string;
  activeButtonBgOver: string;
  activeButtonBgRipple: string;
  
  // Input field
  historyComposeAreaBg: string;
  historyComposeAreaFg: string;
  historyComposeIconFg: string;
  historyComposeIconFgOver: string;
  
  // Scrollbar
  scrollBg: string;
  scrollBgOver: string;
  scrollBarBg: string;
  scrollBarBgOver: string;
  
  // Menu
  menuBg: string;
  menuBgOver: string;
  menuIconFg: string;
  menuFgDisabled: string;
  menuSeparatorFg: string;
  
  // Tooltips
  tooltipBg: string;
  tooltipFg: string;
  tooltipBorderFg: string;
  
  // Title bar
  titleBg: string;
  titleFg: string;
  titleBgActive: string;
  titleFgActive: string;
  titleButtonBg: string;
  titleButtonFg: string;
  titleButtonBgOver: string;
  titleButtonFgOver: string;
  titleButtonBgActive: string;
  titleButtonFgActive: string;
  titleButtonCloseBg: string;
  titleButtonCloseFg: string;
  titleButtonCloseBgOver: string;
  titleButtonCloseFgOver: string;
}

/**
 * Message direction
 */
export type MessageDirection = 'incoming' | 'outgoing';

/**
 * Message read status
 */
export type ReadStatus = 'sent' | 'delivered' | 'read';

/**
 * Single message data
 */
export interface Message {
  id: string;
  text: string;
  direction: MessageDirection;
  timestamp: Date;
  senderName?: string;
  readStatus?: ReadStatus;
  replyTo?: {
    senderName: string;
    text: string;
  };
  isService?: boolean;
}

/**
 * Chat/Conversation data
 */
export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
  isOnline?: boolean;
  isMuted?: boolean;
  isActive?: boolean;
  avatarColor?: string;
}

/**
 * Props for ChatBubble component
 */
export interface ChatBubbleProps {
  message: Message;
  theme: PreviewThemeColors;
  showSenderName?: boolean;
  isGroupChat?: boolean;
  className?: string;
}

/**
 * Props for MessageList component
 */
export interface MessageListProps {
  messages: Message[];
  theme: PreviewThemeColors;
  isGroupChat?: boolean;
  className?: string;
  wallpaperUrl?: string;
}

/**
 * Props for ThemePreview component
 */
export interface ThemePreviewProps {
  theme: PreviewThemeColors;
  className?: string;
  showSidebar?: boolean;
  responsive?: boolean;
  wallpaperUrl?: string;
}

/**
 * Props for ChatListItem component
 */
export interface ChatListItemProps {
  chat: Chat;
  theme: PreviewThemeColors;
  onClick?: () => void;
  className?: string;
}

/**
 * Default preview theme colors (light theme)
 */
export const defaultPreviewTheme: PreviewThemeColors = {
  // Window
  windowBg: '#ffffff',
  windowFg: '#000000',
  windowBgOver: '#f1f1f1',
  windowFgOver: '#000000',
  windowBgActive: '#40a7e3',
  windowFgActive: '#ffffff',
  
  // History peer names
  historyPeer1NameFg: '#c03d33',
  historyPeer2NameFg: '#4fad2d',
  historyPeer3NameFg: '#d09306',
  historyPeer4NameFg: '#168acd',
  
  // Message bubbles
  msgInBg: '#ffffff',
  msgInBgSelected: '#c2dcf2',
  msgOutBg: '#efffde',
  msgOutBgSelected: '#b7dbdb',
  msgInShadow: '#00000000',
  msgOutShadow: '#00000000',
  
  // Message text
  historyTextInFg: '#000000',
  historyTextOutFg: '#000000',
  
  // Timestamps
  msgInDateFg: '#a0acb6',
  msgOutDateFg: '#6cc264',
  historyOutIconFg: '#5dc452',
  historyOutIconFgSelected: '#5dc452',
  
  // Reply
  msgInReplyBarColor: '#40a7e3',
  msgOutReplyBarColor: '#5dc452',
  msgInReplyBarSelColor: '#40a7e3',
  msgOutReplyBarSelColor: '#5dc452',
  
  // Service
  msgServiceBg: '#7fc8e580',
  msgServiceFg: '#ffffff',
  
  // Dialogs
  dialogsBg: '#ffffff',
  dialogsNameFg: '#212121',
  dialogsTextFg: '#888888',
  dialogsDateFg: '#a8a8a8',
  dialogsBgActive: '#419fd9',
  dialogsNameFgActive: '#ffffff',
  dialogsTextFgActive: '#d4e7f5',
  dialogsDateFgActive: '#d4e7f5',
  dialogsUnreadBg: '#419fd9',
  dialogsUnreadBgMuted: '#bbbbbb',
  dialogsUnreadFg: '#ffffff',
  
  // Active button
  activeButtonBg: '#40a7e3',
  activeButtonFg: '#ffffff',
  activeButtonBgOver: '#2095e4',
  activeButtonBgRipple: '#1c8dd5',
  
  // Compose
  historyComposeAreaBg: '#ffffff',
  historyComposeAreaFg: '#000000',
  historyComposeIconFg: '#999999',
  historyComposeIconFgOver: '#40a7e3',
  
  // Scrollbar
  scrollBg: '#00000000',
  scrollBgOver: '#00000000',
  scrollBarBg: '#c8c8c880',
  scrollBarBgOver: '#9e9e9e80',
  
  // Menu
  menuBg: '#ffffff',
  menuBgOver: '#f1f1f1',
  menuIconFg: '#40a7e3',
  menuFgDisabled: '#a8a8a8',
  menuSeparatorFg: '#e8e8e8',
  
  // Tooltips
  tooltipBg: '#e5f0f6',
  tooltipFg: '#547085',
  tooltipBorderFg: '#c9d9e3',
  
  // Title bar
  titleBg: '#ffffff',
  titleFg: '#acacac',
  titleBgActive: '#ffffff',
  titleFgActive: '#3e3c3e',
  titleButtonBg: '#ffffff00',
  titleButtonFg: '#acacac',
  titleButtonBgOver: '#e5e5e5',
  titleButtonFgOver: '#9a9a9a',
  titleButtonBgActive: '#e5e5e5',
  titleButtonFgActive: '#9a9a9a',
  titleButtonCloseBg: '#e5e5e5',
  titleButtonCloseFg: '#d92626',
  titleButtonCloseBgOver: '#e81123',
  titleButtonCloseFgOver: '#ffffff',
};

/**
 * Convert hex color to CSS-compatible format
 */
export function hexToCSS(hex: string): string {
  // Remove # if present
  const cleaned = hex.replace(/^#/, '');
  
  // Handle 6 or 8 character hex
  if (cleaned.length === 6) {
    return `#${cleaned}`;
  } else if (cleaned.length === 8) {
    // RRGGBBAA format - convert to CSS rgba
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const a = parseInt(cleaned.slice(6, 8), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  
  return `#${cleaned}`;
}
