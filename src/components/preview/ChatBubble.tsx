import { useMemo } from 'react';
import type { ChatBubbleProps, ReadStatus } from './types';
import { hexToCSS } from './types';

/**
 * Formats a timestamp for display in a chat bubble
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

/**
 * Read status indicator icons
 */
function ReadStatusIcon({ status, color }: { status: ReadStatus; color: string }) {
  const iconStyle = { color: hexToCSS(color) };
  
  switch (status) {
    case 'sent':
      return (
        <svg
          data-testid="status-sent"
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          style={iconStyle}
        >
          <path
            d="M4 8l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'delivered':
      return (
        <svg
          data-testid="status-delivered"
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          style={iconStyle}
        >
          <path
            d="M2 8l3 3 5-6M6 8l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'read':
      return (
        <svg
          data-testid="status-read"
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          style={iconStyle}
        >
          <path
            d="M2 8l3 3 5-6M6 8l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Reply preview inside a message bubble
 */
function ReplyPreview({
  senderName,
  text,
  barColor,
  textColor,
}: {
  senderName: string;
  text: string;
  barColor: string;
  textColor: string;
}) {
  return (
    <div
      data-testid="reply-preview"
      className="flex items-stretch mb-1.5 rounded overflow-hidden"
    >
      <div
        className="w-0.5 flex-shrink-0"
        style={{ backgroundColor: hexToCSS(barColor) }}
      />
      <div className="pl-2 py-0.5 min-w-0">
        <div
          className="text-xs font-medium truncate"
          style={{ color: hexToCSS(barColor) }}
        >
          {senderName}
        </div>
        <div
          className="text-xs truncate opacity-70"
          style={{ color: hexToCSS(textColor) }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

/**
 * ChatBubble component
 * 
 * Renders a single message bubble styled according to the provided theme.
 * Supports incoming and outgoing messages, replies, timestamps, and read indicators.
 */
export function ChatBubble({
  message,
  theme,
  showSenderName = false,
  className = '',
}: Omit<ChatBubbleProps, 'isGroupChat'>) {
  const isOutgoing = message.direction === 'outgoing';
  const isService = message.isService;
  
  // Memoize computed styles for performance
  const styles = useMemo(() => {
    if (isService) {
      return {
        background: hexToCSS(theme.msgServiceBg),
        color: hexToCSS(theme.msgServiceFg),
      };
    }
    
    return {
      background: isOutgoing
        ? hexToCSS(theme.msgOutBg)
        : hexToCSS(theme.msgInBg),
      color: isOutgoing
        ? hexToCSS(theme.historyTextOutFg)
        : hexToCSS(theme.historyTextInFg),
      dateColor: isOutgoing
        ? hexToCSS(theme.msgOutDateFg)
        : hexToCSS(theme.msgInDateFg),
      replyBarColor: isOutgoing
        ? theme.msgOutReplyBarColor
        : theme.msgInReplyBarColor,
      statusColor: theme.historyOutIconFg,
    };
  }, [theme, isOutgoing, isService]);
  
  // Determine sender name color for group chats (must be before any return)
  const senderNameColor = useMemo(() => {
    if (!showSenderName || !message.senderName || isOutgoing) return null;
    
    // Use different peer colors based on sender name hash
    const hash = message.senderName.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const peerColors = [
      theme.historyPeer1NameFg,
      theme.historyPeer2NameFg,
      theme.historyPeer3NameFg,
      theme.historyPeer4NameFg,
    ];
    return peerColors[hash % peerColors.length];
  }, [theme, showSenderName, message.senderName, isOutgoing]);
  
  // Service messages (date separators, etc.)
  if (isService) {
    return (
      <div
        data-testid="service-message"
        className={`flex justify-center my-2 ${className}`}
      >
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: styles.background,
            color: styles.color,
          }}
        >
          {message.text}
        </div>
      </div>
    );
  }
  
  return (
    <div
      data-testid="chat-bubble"
      data-direction={message.direction}
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-1 ${className}`}
    >
      <div
        className={`
          relative max-w-[80%] px-3 py-1.5 rounded-lg
          ${isOutgoing ? 'rounded-br-sm' : 'rounded-bl-sm'}
        `}
        style={{
          backgroundColor: styles.background,
          color: styles.color,
        }}
      >
        {/* Sender name for group chats */}
        {showSenderName && senderNameColor && !isOutgoing && (
          <div
            data-testid="sender-name"
            className="text-xs font-semibold mb-0.5"
            style={{ color: hexToCSS(senderNameColor) }}
          >
            {message.senderName}
          </div>
        )}
        
        {/* Reply preview */}
        {message.replyTo && (
          <ReplyPreview
            senderName={message.replyTo.senderName}
            text={message.replyTo.text}
            barColor={styles.replyBarColor!}
            textColor={styles.color}
          />
        )}
        
        {/* Message text */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </div>
        
        {/* Timestamp and read status */}
        <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
          <span
            data-testid="timestamp"
            className="text-[10px] leading-none"
            style={{ color: styles.dateColor }}
          >
            {formatTime(message.timestamp)}
          </span>
          
          {isOutgoing && message.readStatus && (
            <ReadStatusIcon
              status={message.readStatus}
              color={styles.statusColor!}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
