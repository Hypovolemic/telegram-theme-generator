import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatBubble } from './ChatBubble';
import { defaultPreviewTheme, type Message, type PreviewThemeColors } from './types';

describe('ChatBubble', () => {
  const theme: PreviewThemeColors = defaultPreviewTheme;
  
  const createMessage = (overrides: Partial<Message> = {}): Message => ({
    id: '1',
    text: 'Hello, world!',
    direction: 'incoming',
    timestamp: new Date('2025-01-15T10:30:00'),
    ...overrides,
  });
  
  describe('rendering', () => {
    it('should render the chat bubble', () => {
      render(<ChatBubble message={createMessage()} theme={theme} />);
      expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
    });
    
    it('should render the message text', () => {
      render(<ChatBubble message={createMessage({ text: 'Test message' })} theme={theme} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    it('should render the timestamp', () => {
      render(<ChatBubble message={createMessage()} theme={theme} />);
      expect(screen.getByTestId('timestamp')).toBeInTheDocument();
    });
    
    it('should apply custom className', () => {
      render(
        <ChatBubble
          message={createMessage()}
          theme={theme}
          className="custom-class"
        />
      );
      expect(screen.getByTestId('chat-bubble')).toHaveClass('custom-class');
    });
  });
  
  describe('message direction', () => {
    it('should render incoming message aligned left', () => {
      render(<ChatBubble message={createMessage({ direction: 'incoming' })} theme={theme} />);
      expect(screen.getByTestId('chat-bubble')).toHaveClass('justify-start');
    });
    
    it('should render outgoing message aligned right', () => {
      render(<ChatBubble message={createMessage({ direction: 'outgoing' })} theme={theme} />);
      expect(screen.getByTestId('chat-bubble')).toHaveClass('justify-end');
    });
    
    it('should set data-direction attribute', () => {
      render(<ChatBubble message={createMessage({ direction: 'outgoing' })} theme={theme} />);
      expect(screen.getByTestId('chat-bubble')).toHaveAttribute('data-direction', 'outgoing');
    });
  });
  
  describe('theming', () => {
    it('should apply incoming message background color', () => {
      render(<ChatBubble message={createMessage({ direction: 'incoming' })} theme={theme} />);
      const bubble = screen.getByTestId('bubble-content');
      expect(bubble).toHaveStyle({ backgroundColor: '#ffffff' });
    });
    
    it('should apply outgoing message background color', () => {
      render(<ChatBubble message={createMessage({ direction: 'outgoing' })} theme={theme} />);
      const bubble = screen.getByTestId('bubble-content');
      expect(bubble).toHaveStyle({ backgroundColor: '#efffde' });
    });
  });
  
  describe('read status', () => {
    it('should show sent status icon for outgoing messages', () => {
      render(
        <ChatBubble
          message={createMessage({ direction: 'outgoing', readStatus: 'sent' })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('status-sent')).toBeInTheDocument();
    });
    
    it('should show delivered status icon', () => {
      render(
        <ChatBubble
          message={createMessage({ direction: 'outgoing', readStatus: 'delivered' })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('status-delivered')).toBeInTheDocument();
    });
    
    it('should show read status icon', () => {
      render(
        <ChatBubble
          message={createMessage({ direction: 'outgoing', readStatus: 'read' })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('status-read')).toBeInTheDocument();
    });
    
    it('should not show status for incoming messages', () => {
      render(
        <ChatBubble
          message={createMessage({ direction: 'incoming', readStatus: 'read' })}
          theme={theme}
        />
      );
      expect(screen.queryByTestId('status-read')).not.toBeInTheDocument();
    });
  });
  
  describe('sender name', () => {
    it('should show sender name when showSenderName is true', () => {
      render(
        <ChatBubble
          message={createMessage({ senderName: 'Alice' })}
          theme={theme}
          showSenderName={true}
        />
      );
      expect(screen.getByTestId('sender-name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    
    it('should not show sender name for outgoing messages', () => {
      render(
        <ChatBubble
          message={createMessage({ direction: 'outgoing', senderName: 'Me' })}
          theme={theme}
          showSenderName={true}
        />
      );
      expect(screen.queryByTestId('sender-name')).not.toBeInTheDocument();
    });
    
    it('should not show sender name when showSenderName is false', () => {
      render(
        <ChatBubble
          message={createMessage({ senderName: 'Alice' })}
          theme={theme}
          showSenderName={false}
        />
      );
      expect(screen.queryByTestId('sender-name')).not.toBeInTheDocument();
    });
  });
  
  describe('reply preview', () => {
    it('should show reply preview when message has replyTo', () => {
      render(
        <ChatBubble
          message={createMessage({
            replyTo: { senderName: 'Bob', text: 'Original message' },
          })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('reply-preview')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Original message')).toBeInTheDocument();
    });
    
    it('should not show reply preview when no replyTo', () => {
      render(<ChatBubble message={createMessage()} theme={theme} />);
      expect(screen.queryByTestId('reply-preview')).not.toBeInTheDocument();
    });
  });
  
  describe('service messages', () => {
    it('should render service message differently', () => {
      render(
        <ChatBubble
          message={createMessage({ isService: true, text: 'User joined the group' })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('service-message')).toBeInTheDocument();
      expect(screen.getByText('User joined the group')).toBeInTheDocument();
    });
    
    it('should center service messages', () => {
      render(
        <ChatBubble
          message={createMessage({ isService: true })}
          theme={theme}
        />
      );
      expect(screen.getByTestId('service-message')).toHaveClass('justify-center');
    });
  });
  
  describe('whitespace handling', () => {
    it('should preserve whitespace in messages', () => {
      render(
        <ChatBubble
          message={createMessage({ text: 'Line 1\nLine 2' })}
          theme={theme}
        />
      );
      const text = screen.getByText(/Line 1/);
      // Text is inside a span, check parent div for whitespace class
      const textContainer = text.closest('div');
      expect(textContainer).toHaveClass('whitespace-pre-wrap');
    });
    
    it('should break long words', () => {
      render(
        <ChatBubble
          message={createMessage()}
          theme={theme}
        />
      );
      const text = screen.getByText('Hello, world!');
      // Text is inside a span, check parent div for break-words class
      const textContainer = text.closest('div');
      expect(textContainer).toHaveClass('break-words');
    });
  });
});
