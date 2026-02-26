import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePreview } from './ThemePreview';
import { defaultPreviewTheme, type PreviewThemeColors } from './types';

describe('ThemePreview', () => {
  const theme: PreviewThemeColors = defaultPreviewTheme;
  
  describe('rendering', () => {
    it('should render the theme preview', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('theme-preview')).toBeInTheDocument();
    });
    
    it('should render the title bar', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('title-bar')).toBeInTheDocument();
    });
    
    it('should render the sidebar', () => {
      render(<ThemePreview theme={theme} showSidebar={true} />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
    
    it('should render the chat header', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    });
    
    it('should render the message list', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
    });
    
    it('should render the compose area', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('compose-area')).toBeInTheDocument();
    });
    
    it('should apply custom className', () => {
      render(<ThemePreview theme={theme} className="custom-class" />);
      expect(screen.getByTestId('theme-preview')).toHaveClass('custom-class');
    });
  });
  
  describe('sidebar', () => {
    it('should show sidebar when showSidebar is true', () => {
      render(<ThemePreview theme={theme} showSidebar={true} />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
    
    it('should hide sidebar when showSidebar is false', () => {
      render(<ThemePreview theme={theme} showSidebar={false} />);
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });
    
    it('should render chat list items', () => {
      render(<ThemePreview theme={theme} showSidebar={true} />);
      const chatItems = screen.getAllByTestId('chat-list-item');
      expect(chatItems.length).toBeGreaterThan(0);
    });
    
    it('should highlight active chat', () => {
      render(<ThemePreview theme={theme} showSidebar={true} />);
      const chatItems = screen.getAllByTestId('chat-list-item');
      // First chat should be active by default
      expect(chatItems[0]).toHaveStyle({
        backgroundColor: '#419fd9',
      });
    });
  });
  
  describe('chat selection', () => {
    it('should change active chat when clicking chat list item', async () => {
      const user = userEvent.setup();
      render(<ThemePreview theme={theme} showSidebar={true} />);
      
      const chatItems = screen.getAllByTestId('chat-list-item');
      await user.click(chatItems[1]);
      
      // Second chat should now be active
      await waitFor(() => {
        expect(chatItems[1]).toHaveStyle({
          backgroundColor: '#419fd9',
        });
      });
    });
    
    it('should show typing indicator after selecting new chat', async () => {
      const user = userEvent.setup();
      render(<ThemePreview theme={theme} showSidebar={true} />);
      
      const chatItems = screen.getAllByTestId('chat-list-item');
      await user.click(chatItems[1]);
      
      await waitFor(() => {
        expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
      });
    });
  });
  
  describe('theming', () => {
    it('should apply window background color', () => {
      const customTheme = {
        ...theme,
        windowBg: '#ff0000',
      };
      render(<ThemePreview theme={customTheme} />);
      expect(screen.getByTestId('theme-preview')).toHaveStyle({
        backgroundColor: '#ff0000',
      });
    });
    
    it('should apply dialog background color to sidebar', () => {
      const customTheme = {
        ...theme,
        dialogsBg: '#00ff00',
      };
      render(<ThemePreview theme={customTheme} showSidebar={true} />);
      expect(screen.getByTestId('sidebar')).toHaveStyle({
        backgroundColor: '#00ff00',
      });
    });
    
    it('should update colors in real-time', () => {
      const { rerender } = render(<ThemePreview theme={theme} />);
      
      expect(screen.getByTestId('theme-preview')).toHaveStyle({
        backgroundColor: '#ffffff',
      });
      
      const updatedTheme = {
        ...theme,
        windowBg: '#0000ff',
      };
      rerender(<ThemePreview theme={updatedTheme} />);
      
      expect(screen.getByTestId('theme-preview')).toHaveStyle({
        backgroundColor: '#0000ff',
      });
    });
  });
  
  describe('title bar', () => {
    it('should show Telegram Desktop text', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('Telegram Desktop')).toBeInTheDocument();
    });
    
    it('should apply title bar colors', () => {
      const customTheme = {
        ...theme,
        titleBgActive: '#333333',
      };
      render(<ThemePreview theme={customTheme} />);
      expect(screen.getByTestId('title-bar')).toHaveStyle({
        backgroundColor: '#333333',
      });
    });
  });
  
  describe('chat header', () => {
    it('should show chat name', () => {
      render(<ThemePreview theme={theme} />);
      // Chat header should show Alex (also appears in sidebar)
      const header = screen.getByTestId('chat-header');
      expect(header).toHaveTextContent('Alex');
    });
    
    it('should show online status', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('online')).toBeInTheDocument();
    });
  });
  
  describe('compose area', () => {
    it('should show placeholder text', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('Write a message...')).toBeInTheDocument();
    });
    
    it('should apply compose area colors', () => {
      const customTheme = {
        ...theme,
        historyComposeAreaBg: '#eeeeee',
      };
      render(<ThemePreview theme={customTheme} />);
      expect(screen.getByTestId('compose-area')).toHaveStyle({
        backgroundColor: '#eeeeee',
      });
    });
  });
  
  describe('responsive design', () => {
    it('should have max-width when responsive is true', () => {
      render(<ThemePreview theme={theme} responsive={true} />);
      expect(screen.getByTestId('theme-preview')).toHaveClass('max-w-4xl');
    });
    
    it('should not have max-width when responsive is false', () => {
      render(<ThemePreview theme={theme} responsive={false} />);
      expect(screen.getByTestId('theme-preview')).not.toHaveClass('max-w-4xl');
    });
    
    it('should hide sidebar on mobile when responsive', () => {
      render(<ThemePreview theme={theme} responsive={true} showSidebar={true} />);
      // The sidebar container should have hidden class for mobile
      const sidebarContainer = screen.getByTestId('sidebar').parentElement;
      expect(sidebarContainer).toHaveClass('hidden');
      expect(sidebarContainer).toHaveClass('md:block');
    });
  });
  
  describe('sample messages', () => {
    it('should render sample messages', () => {
      render(<ThemePreview theme={theme} />);
      const chatBubbles = screen.getAllByTestId('chat-bubble');
      expect(chatBubbles.length).toBeGreaterThan(0);
    });
    
    it('should show both incoming and outgoing messages', () => {
      render(<ThemePreview theme={theme} />);
      const chatBubbles = screen.getAllByTestId('chat-bubble');
      
      const incomingBubbles = chatBubbles.filter(
        (bubble) => bubble.getAttribute('data-direction') === 'incoming'
      );
      const outgoingBubbles = chatBubbles.filter(
        (bubble) => bubble.getAttribute('data-direction') === 'outgoing'
      );
      
      expect(incomingBubbles.length).toBeGreaterThan(0);
      expect(outgoingBubbles.length).toBeGreaterThan(0);
    });
  });
  
  describe('default theme', () => {
    it('should use default theme when none provided', () => {
      render(<ThemePreview />);
      expect(screen.getByTestId('theme-preview')).toBeInTheDocument();
    });
  });
  
  describe('unread badges', () => {
    it('should show unread count badges', () => {
      render(<ThemePreview theme={theme} showSidebar={true} />);
      // Should have chats with unread counts in sample data
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });
  
  describe('accessibility', () => {
    it('should have proper structure for screen readers', () => {
      render(<ThemePreview theme={theme} />);
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
      expect(screen.getByTestId('compose-area')).toBeInTheDocument();
    });
  });
});
