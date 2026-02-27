import { useMemo } from 'react';
import type { ChatBubbleProps, ReadStatus } from './types';
import { hexToCSS } from './types';

/**
 * Formats a timestamp for display in a chat bubble
 * Uses 12-hour format like Telegram
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

/**
 * Read status indicator icons - double check marks like Telegram
 */
function ReadStatusIcon({ status, color }: { status: ReadStatus; color: string }) {
  const iconStyle = { 
    color: hexToCSS(color),
    width: '16px',
    height: '16px',
    minWidth: '16px',
    minHeight: '16px',
    maxWidth: '16px',
    maxHeight: '16px',
  };
  
  switch (status) {
    case 'sent':
      return (
        <svg
          data-testid="status-sent"
          className="flex-shrink-0"
          width="16"
          height="16"
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
          className="flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={iconStyle}
        >
          <path
            d="M1.5 8l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 8l3 3 5-6"
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
          className="flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={iconStyle}
        >
          <path
            d="M1.5 8l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 8l3 3 5-6"
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
      className="flex items-stretch mb-1 rounded overflow-hidden"
    >
      <div
        className="flex-shrink-0"
        style={{ backgroundColor: hexToCSS(barColor), width: '2px' }}
      />
      <div className="pl-2 py-0.5 min-w-0">
        <div
          className="text-xs font-semibold truncate"
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
 * Renders a single message bubble styled according to the Telegram Desktop format.
 * - Timestamp floats inline at the end of the message text
 * - Bubble has a small tail at the bottom corner
 * - Max width is constrained to ~65% of the chat area
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
      shadowColor: isOutgoing
        ? hexToCSS(theme.msgOutShadow)
        : hexToCSS(theme.msgInShadow),
    };
  }, [theme, isOutgoing, isService]);
  
  // Determine sender name color for group chats (must be before any return)
  const senderNameColor = useMemo(() => {
    if (!showSenderName || !message.senderName || isOutgoing) return null;
    
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
  
  // Telegram-style bubble tail using CSS
  const tailColor = isOutgoing ? theme.msgOutBg : theme.msgInBg;
  
  return (
    <div
      data-testid="chat-bubble"
      data-direction={message.direction}
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-1 ${className}`}
      style={{ padding: '0 12px' }}
    >
      <div
        className="relative"
        style={{
          maxWidth: '70%',
          minWidth: '80px',
        }}
      >
        {/* The bubble */}
        <div
          data-testid="bubble-content"
          className="relative px-3 py-2 rounded-lg"
          style={{
            backgroundColor: styles.background,
            color: styles.color,
            borderRadius: isOutgoing 
              ? '12px 12px 0 12px' 
              : '12px 12px 12px 0',
            boxShadow: `0 1px 2px ${styles.shadowColor}`,
            marginLeft: isOutgoing ? '0' : '6px',
            marginRight: isOutgoing ? '6px' : '0',
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
          {/* Message text with inline timestamp (Telegram style) */}
          <div className="text-[13px] leading-[18px] whitespace-pre-wrap break-words">
            <span>{message.text}</span>
            {/* Invisible spacer to prevent timestamp from overlapping text */}
            <span 
              className="inline-block align-bottom" 
              style={{ 
                width: isOutgoing && message.readStatus ? '65px' : '48px', 
                height: '1px',
              }} 
            />
          </div>
          {/* Timestamp + read status - positioned at bottom-right, overlapping the spacer */}
          <div 
            className="flex items-center justify-end"
            style={{ 
              marginTop: '-14px',
              marginBottom: '1px',
              height: '16px',
              gap: '3px',
            }}
          >
            <span
              data-testid="timestamp"
              className="leading-none"
              style={{ 
                color: styles.dateColor,
                fontSize: '11px',
              }}
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
        {/* Bubble tail - small triangle at bottom corner */}
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            [isOutgoing ? 'right' : 'left']: '-7px',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            ...(isOutgoing ? {
              borderWidth: '0 0 10px 10px',
              borderColor: `transparent transparent transparent ${hexToCSS(tailColor)}`,
            } : {
              borderWidth: '0 10px 10px 0',
              borderColor: `transparent ${hexToCSS(tailColor)} transparent transparent`,
            }),
          }}
        />
      </div>
    </div>
  );
}

export default ChatBubble;
