import { useMemo, useRef, useEffect } from 'react';
import { ChatBubble } from './ChatBubble';
import type { MessageListProps, Message } from './types';
import { hexToCSS } from './types';

/**
 * Groups messages by date for rendering date separators
 */
function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();
  
  for (const message of messages) {
    const dateKey = message.timestamp.toDateString();
    const existing = groups.get(dateKey) || [];
    existing.push(message);
    groups.set(dateKey, existing);
  }
  
  return groups;
}

/**
 * Formats a date for the date separator
 */
function formatDateSeparator(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Date separator component
 */
function DateSeparator({
  date,
  bgColor,
  textColor,
}: {
  date: Date;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div
      data-testid="date-separator"
      className="flex justify-center my-3"
    >
      <div
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: hexToCSS(bgColor),
          color: hexToCSS(textColor),
        }}
      >
        {formatDateSeparator(date)}
      </div>
    </div>
  );
}

/**
 * Typing indicator component
 */
export function TypingIndicator({
  bgColor,
  dotColor,
}: {
  bgColor: string;
  dotColor: string;
}) {
  return (
    <div
      data-testid="typing-indicator"
      className="flex justify-start mb-1"
    >
      <div
        className="px-3 py-2 rounded-lg rounded-bl-sm"
        style={{ backgroundColor: hexToCSS(bgColor) }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: hexToCSS(dotColor),
                animationDelay: `${i * 150}ms`,
                animationDuration: '600ms',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MessageList component
 * 
 * Renders a scrollable list of messages with date separators.
 * Automatically scrolls to bottom when new messages arrive.
 * Supports both individual and group chat modes.
 */
export function MessageList({
  messages,
  theme,
  isGroupChat = false,
  className = '',
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Group messages by date
  const messageGroups = useMemo(
    () => groupMessagesByDate(messages),
    [messages]
  );
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Scrollbar styles
  const scrollbarStyles = useMemo(() => ({
    '--scroll-bg': hexToCSS(theme.scrollBg),
    '--scroll-bg-over': hexToCSS(theme.scrollBgOver),
    '--scroll-bar-bg': hexToCSS(theme.scrollBarBg),
    '--scroll-bar-bg-over': hexToCSS(theme.scrollBarBgOver),
  }), [theme]);
  
  return (
    <div
      ref={containerRef}
      data-testid="message-list"
      className={`
        flex-1 overflow-y-auto px-3 py-2
        scrollbar-thin scrollbar-thumb-rounded
        ${className}
      `}
      style={{
        backgroundColor: hexToCSS(theme.windowBg),
        ...scrollbarStyles as React.CSSProperties,
      }}
    >
      {Array.from(messageGroups.entries()).map(([dateKey, dayMessages]) => (
        <div key={dateKey} data-testid="message-group">
          <DateSeparator
            date={new Date(dateKey)}
            bgColor={theme.msgServiceBg}
            textColor={theme.msgServiceFg}
          />
          
          {dayMessages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              theme={theme}
              showSenderName={isGroupChat && message.direction === 'incoming'}
              isGroupChat={isGroupChat}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
