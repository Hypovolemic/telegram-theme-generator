import { useState, useMemo } from 'react';
import { MessageList, TypingIndicator } from './MessageList';
import type { ThemePreviewProps, Message, Chat, PreviewThemeColors } from './types';
import { hexToCSS, defaultPreviewTheme } from './types';

/**
 * Sample messages for the preview
 */
const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! Check out this new theme I made 🎨',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 3600000),
    senderName: 'Alex',
  },
  {
    id: '2',
    text: 'Wow, it looks amazing! Love the colours',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 3500000),
    readStatus: 'read',
  },
  {
    id: '3',
    text: 'Thanks! I extracted them from a sunset photo',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 3400000),
    senderName: 'Alex',
  },
  {
    id: '4',
    text: 'That\'s so cool! Can you share the theme file?',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 3300000),
    readStatus: 'read',
  },
  {
    id: '5',
    text: 'Sure! I\'ll send it right now',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 60000),
    senderName: 'Alex',
  },
  {
    id: '6',
    text: 'Perfect, thanks! 🙌',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 30000),
    readStatus: 'delivered',
  },
];

/**
 * Sample chats for the sidebar
 */
const sampleChats: Chat[] = [
  {
    id: '1',
    name: 'Alex',
    lastMessage: 'Sure! I\'ll send it right now',
    timestamp: new Date(Date.now() - 60000),
    isOnline: true,
    isActive: true,
  },
  {
    id: '2',
    name: 'Theme Creators',
    lastMessage: 'Check out the new gradient themes!',
    timestamp: new Date(Date.now() - 3600000),
    unreadCount: 3,
    avatarColor: '#4fad2d',
  },
  {
    id: '3',
    name: 'Sarah',
    lastMessage: 'See you tomorrow!',
    timestamp: new Date(Date.now() - 86400000),
    avatarColor: '#d09306',
  },
  {
    id: '4',
    name: 'Design Team',
    lastMessage: 'Mike: The mockups are ready',
    timestamp: new Date(Date.now() - 172800000),
    isMuted: true,
    unreadCount: 12,
    avatarColor: '#c03d33',
  },
];

/**
 * Title bar component
 */
function TitleBar({ theme }: { theme: PreviewThemeColors }) {
  return (
    <div
      data-testid="title-bar"
      className="flex items-center justify-between h-8 px-3"
      style={{ backgroundColor: hexToCSS(theme.titleBgActive) }}
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: hexToCSS(theme.titleFgActive) }}
      >
        Telegram Desktop
      </span>
      <div className="w-12" />
    </div>
  );
}

/**
 * Chat list item component
 */
function ChatListItem({
  chat,
  theme,
  onClick,
}: {
  chat: Chat;
  theme: PreviewThemeColors;
  onClick?: () => void;
}) {
  const isActive = chat.isActive;
  
  const styles = useMemo(() => ({
    backgroundColor: isActive
      ? hexToCSS(theme.dialogsBgActive)
      : hexToCSS(theme.dialogsBg),
    nameColor: isActive
      ? hexToCSS(theme.dialogsNameFgActive)
      : hexToCSS(theme.dialogsNameFg),
    textColor: isActive
      ? hexToCSS(theme.dialogsTextFgActive)
      : hexToCSS(theme.dialogsTextFg),
    dateColor: isActive
      ? hexToCSS(theme.dialogsDateFgActive)
      : hexToCSS(theme.dialogsDateFg),
    unreadBg: chat.isMuted
      ? hexToCSS(theme.dialogsUnreadBgMuted)
      : hexToCSS(theme.dialogsUnreadBg),
    unreadFg: hexToCSS(theme.dialogsUnreadFg),
  }), [theme, isActive, chat.isMuted]);
  
  const avatarColor = chat.avatarColor || theme.windowBgActive;
  
  return (
    <div
      data-testid="chat-list-item"
      className={`
        flex items-center gap-3 px-3 py-2 cursor-pointer
        transition-colors duration-150
      `}
      style={{ backgroundColor: styles.backgroundColor }}
      onClick={onClick}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium"
        style={{ backgroundColor: hexToCSS(avatarColor) }}
      >
        {chat.name.charAt(0).toUpperCase()}
        {chat.isOnline && (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"
          />
        )}
      </div>
      
      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className="font-medium truncate"
            style={{ color: styles.nameColor }}
          >
            {chat.name}
          </span>
          <span
            className="text-xs flex-shrink-0"
            style={{ color: styles.dateColor }}
          >
            {formatChatTime(chat.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span
            className="text-sm truncate"
            style={{ color: styles.textColor }}
          >
            {chat.lastMessage}
          </span>
          {chat.unreadCount && (
            <span
              className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
              style={{
                backgroundColor: styles.unreadBg,
                color: styles.unreadFg,
              }}
            >
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Formats timestamp for chat list
 */
function formatChatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  
  if (days === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
  }
  
  if (days === 1) {
    return 'Yesterday';
  }
  
  if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Chat header component
 */
function ChatHeader({
  chatName,
  isOnline,
  theme,
}: {
  chatName: string;
  isOnline?: boolean;
  theme: PreviewThemeColors;
}) {
  return (
    <div
      data-testid="chat-header"
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{
        backgroundColor: hexToCSS(theme.windowBg),
        borderColor: hexToCSS(theme.menuSeparatorFg),
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
          style={{ backgroundColor: hexToCSS(theme.windowBgActive) }}
        >
          {chatName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div
            className="font-medium"
            style={{ color: hexToCSS(theme.windowFg) }}
          >
            {chatName}
          </div>
          <div
            className="text-xs"
            style={{
              color: isOnline
                ? hexToCSS(theme.windowBgActive)
                : hexToCSS(theme.dialogsTextFg),
            }}
          >
            {isOnline ? 'online' : 'last seen recently'}
          </div>
        </div>
      </div>
      
      {/* Header icons */}
      <div className="flex items-center gap-4">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={hexToCSS(theme.historyComposeIconFg)}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={hexToCSS(theme.historyComposeIconFg)}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={hexToCSS(theme.historyComposeIconFg)}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Compose area component
 */
function ComposeArea({ theme }: { theme: PreviewThemeColors }) {
  return (
    <div
      data-testid="compose-area"
      className="flex items-center gap-3 px-4 py-3 border-t"
      style={{
        backgroundColor: hexToCSS(theme.historyComposeAreaBg),
        borderColor: hexToCSS(theme.menuSeparatorFg),
      }}
    >
      {/* Attachment button */}
      <button
        className="flex-shrink-0 p-1 rounded-full transition-colors"
        style={{ color: hexToCSS(theme.historyComposeIconFg) }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>
      
      {/* Input field */}
      <div
        className="flex-1 px-4 py-2 rounded-full text-sm"
        style={{
          backgroundColor: hexToCSS(theme.windowBgOver),
          color: hexToCSS(theme.historyComposeAreaFg),
        }}
      >
        <span style={{ color: hexToCSS(theme.dialogsTextFg) }}>
          Write a message...
        </span>
      </div>
      
      {/* Emoji button */}
      <button
        className="flex-shrink-0 p-1 rounded-full transition-colors"
        style={{ color: hexToCSS(theme.historyComposeIconFg) }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      
      {/* Microphone button */}
      <button
        className="flex-shrink-0 p-1 rounded-full transition-colors"
        style={{ color: hexToCSS(theme.historyComposeIconFg) }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </div>
  );
}

/**
 * Sidebar component
 */
function Sidebar({
  chats,
  theme,
  onSelectChat,
}: {
  chats: Chat[];
  theme: PreviewThemeColors;
  onSelectChat?: (chatId: string) => void;
}) {
  return (
    <div
      data-testid="sidebar"
      className="flex flex-col h-full border-r flex-shrink-0"
      style={{
        backgroundColor: hexToCSS(theme.dialogsBg),
        borderColor: hexToCSS(theme.menuSeparatorFg),
        width: '280px',
      }}
    >
      {/* Search bar */}
      <div
        className="px-3 py-2 border-b"
        style={{ borderColor: hexToCSS(theme.menuSeparatorFg) }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: hexToCSS(theme.windowBgOver) }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke={hexToCSS(theme.dialogsTextFg)}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span
            className="text-sm"
            style={{ color: hexToCSS(theme.dialogsTextFg) }}
          >
            Search
          </span>
        </div>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            theme={theme}
            onClick={() => onSelectChat?.(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ThemePreview component
 * 
 * A realistic preview of how a theme looks in Telegram Desktop.
 * Includes sidebar with chat list, message area, and compose input.
 * Updates in real-time when theme colors change.
 */
export function ThemePreview({
  theme = defaultPreviewTheme,
  className = '',
  showSidebar = true,
  responsive = true,
  wallpaperUrl,
}: ThemePreviewProps) {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [showTyping, setShowTyping] = useState(false);
  
  // Get the active chat
  const activeChat = useMemo(
    () => sampleChats.find((c) => c.id === selectedChat) || sampleChats[0],
    [selectedChat]
  );
  
  // Update chats to mark selected as active
  const chatsWithActive = useMemo(
    () => sampleChats.map((chat) => ({
      ...chat,
      isActive: chat.id === selectedChat,
    })),
    [selectedChat]
  );
  
  // Show typing indicator briefly when chat changes
  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2000);
  };
  
  return (
    <div
      data-testid="theme-preview"
      className={`
        flex flex-col rounded-lg overflow-hidden shadow-xl
        ${responsive ? 'w-full max-w-4xl' : ''}
        ${className}
      `}
      style={{
        backgroundColor: hexToCSS(theme.windowBg),
        height: responsive ? 'auto' : '600px',
        minHeight: '400px',
      }}
    >
      {/* Title bar */}
      <TitleBar theme={theme} />
      
      {/* Main content area */}
      <div
        className={`
          flex flex-1 min-h-0
          ${responsive ? 'flex-col md:flex-row' : 'flex-row'}
        `}
      >
        {/* Sidebar */}
        {showSidebar && (
          <div className={responsive ? 'hidden md:block' : ''}>
            <Sidebar
              chats={chatsWithActive}
              theme={theme}
              onSelectChat={handleSelectChat}
            />
          </div>
        )}
        
        {/* Chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat header */}
          <ChatHeader
            chatName={activeChat.name}
            isOnline={activeChat.isOnline}
            theme={theme}
          />
          
          {/* Message list */}
          <MessageList
            messages={sampleMessages}
            theme={theme}
            isGroupChat={false}
            wallpaperUrl={wallpaperUrl}
          />
          
          {/* Typing indicator */}
          {showTyping && (
            <div className="px-3 pb-2">
              <TypingIndicator
                bgColor={theme.msgInBg}
                dotColor={theme.dialogsTextFg}
              />
            </div>
          )}
          
          {/* Compose area */}
          <ComposeArea theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default ThemePreview;
