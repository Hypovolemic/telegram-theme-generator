import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList, TypingIndicator } from './MessageList';
import { defaultPreviewTheme, type Message, type PreviewThemeColors } from './types';

describe('MessageList', () => {
  const theme: PreviewThemeColors = defaultPreviewTheme;
  
  const createMessages = (count: number): Message[] => {
    const messages: Message[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      messages.push({
        id: String(i + 1),
        text: `Message ${i + 1}`,
        direction: i % 2 === 0 ? 'incoming' : 'outgoing',
        timestamp: new Date(now.getTime() - (count - i) * 60000),
        senderName: i % 2 === 0 ? 'Alice' : undefined,
        readStatus: i % 2 === 1 ? 'read' : undefined,
      });
    }
    
    return messages;
  };
  
  describe('rendering', () => {
    it('should render the message list', () => {
      render(<MessageList messages={[]} theme={theme} />);
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
    });
    
    it('should render all messages', () => {
      render(<MessageList messages={createMessages(5)} theme={theme} />);
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
      expect(screen.getByText('Message 3')).toBeInTheDocument();
      expect(screen.getByText('Message 4')).toBeInTheDocument();
      expect(screen.getByText('Message 5')).toBeInTheDocument();
    });
    
    it('should apply custom className', () => {
      render(
        <MessageList
          messages={[]}
          theme={theme}
          className="custom-class"
        />
      );
      expect(screen.getByTestId('message-list')).toHaveClass('custom-class');
    });
    
    it('should apply background color from theme', () => {
      render(<MessageList messages={[]} theme={theme} />);
      expect(screen.getByTestId('message-list')).toHaveStyle({
        backgroundColor: '#ffffff',
      });
    });
  });
  
  describe('date separators', () => {
    it('should render date separator', () => {
      render(<MessageList messages={createMessages(1)} theme={theme} />);
      expect(screen.getByTestId('date-separator')).toBeInTheDocument();
    });
    
    it('should show "Today" for today\'s messages', () => {
      render(<MessageList messages={createMessages(1)} theme={theme} />);
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
    
    it('should group messages by date', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Yesterday message',
          direction: 'incoming',
          timestamp: new Date(Date.now() - 86400000 * 2),
        },
        {
          id: '2',
          text: 'Today message',
          direction: 'outgoing',
          timestamp: new Date(),
        },
      ];
      
      render(<MessageList messages={messages} theme={theme} />);
      const groups = screen.getAllByTestId('message-group');
      expect(groups.length).toBe(2);
    });
  });
  
  describe('group chat mode', () => {
    it('should show sender names in group chat', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Hello from Alice',
          direction: 'incoming',
          timestamp: new Date(),
          senderName: 'Alice',
        },
      ];
      
      render(<MessageList messages={messages} theme={theme} isGroupChat={true} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    
    it('should not show sender names when not in group chat', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Hello from Alice',
          direction: 'incoming',
          timestamp: new Date(),
          senderName: 'Alice',
        },
      ];
      
      render(<MessageList messages={messages} theme={theme} isGroupChat={false} />);
      // Should not show sender name in container
      expect(screen.queryByTestId('sender-name')).not.toBeInTheDocument();
    });
  });
  
  describe('empty state', () => {
    it('should render empty list without errors', () => {
      render(<MessageList messages={[]} theme={theme} />);
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-bubble')).not.toBeInTheDocument();
    });
  });
  
  describe('scrolling', () => {
    it('should be scrollable', () => {
      render(<MessageList messages={createMessages(10)} theme={theme} />);
      expect(screen.getByTestId('message-list')).toHaveClass('overflow-y-auto');
    });
  });
});

describe('TypingIndicator', () => {
  const theme = defaultPreviewTheme;
  
  it('should render typing indicator', () => {
    render(
      <TypingIndicator
        bgColor={theme.msgInBg}
        dotColor={theme.dialogsTextFg}
      />
    );
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
  });
  
  it('should render three dots', () => {
    render(
      <TypingIndicator
        bgColor={theme.msgInBg}
        dotColor={theme.dialogsTextFg}
      />
    );
    const dots = screen.getByTestId('typing-indicator').querySelectorAll('.rounded-full.animate-bounce');
    expect(dots.length).toBe(3);
  });
  
  it('should apply background color', () => {
    render(
      <TypingIndicator
        bgColor="#ff0000"
        dotColor={theme.dialogsTextFg}
      />
    );
    const container = screen.getByTestId('typing-indicator').querySelector('div > div');
    expect(container).toHaveStyle({ backgroundColor: '#ff0000' });
  });
});
