/**
 * Base Telegram Desktop Theme Template
 * 
 * This template defines all 200+ theme properties for Telegram Desktop.
 * Properties are organized by semantic category for easier understanding.
 * 
 * Color format: RRGGBB or RRGGBBAA (hex without #)
 */

export interface ThemeColors {
  // Primary colors extracted from image
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary/accent colors
  accent: string;
  accentLight: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  
  // Status colors
  online: string;
  offline: string;
  
  // Additional extracted colors
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
}

export interface ThemeProperty {
  key: string;
  description: string;
  category: ThemeCategory;
}

export type ThemeCategory = 
  | 'window'
  | 'chat'
  | 'dialogs'
  | 'history'
  | 'media'
  | 'profile'
  | 'settings'
  | 'intro'
  | 'calls'
  | 'misc';

/**
 * Complete list of Telegram Desktop theme properties
 * Organized by UI component/category
 */
export const THEME_PROPERTIES: ThemeProperty[] = [
  // Window/General
  { key: 'windowBg', description: 'Main window background', category: 'window' },
  { key: 'windowFg', description: 'Main text color', category: 'window' },
  { key: 'windowBgOver', description: 'Background on hover', category: 'window' },
  { key: 'windowBgRipple', description: 'Ripple effect background', category: 'window' },
  { key: 'windowFgOver', description: 'Text color on hover', category: 'window' },
  { key: 'windowSubTextFg', description: 'Secondary text color', category: 'window' },
  { key: 'windowSubTextFgOver', description: 'Secondary text on hover', category: 'window' },
  { key: 'windowBoldFg', description: 'Bold text color', category: 'window' },
  { key: 'windowBoldFgOver', description: 'Bold text on hover', category: 'window' },
  { key: 'windowBgActive', description: 'Active item background', category: 'window' },
  { key: 'windowFgActive', description: 'Active item text', category: 'window' },
  { key: 'windowActiveTextFg', description: 'Active link text', category: 'window' },
  { key: 'windowShadowFg', description: 'Shadow color', category: 'window' },
  { key: 'windowShadowFgFallback', description: 'Shadow fallback', category: 'window' },
  
  // Scrollbar
  { key: 'scrollBarBg', description: 'Scrollbar background', category: 'window' },
  { key: 'scrollBarBgOver', description: 'Scrollbar on hover', category: 'window' },
  { key: 'scrollBg', description: 'Scroll area background', category: 'window' },
  { key: 'scrollBgOver', description: 'Scroll area on hover', category: 'window' },
  
  // Links
  { key: 'linkFg', description: 'Link color', category: 'window' },
  { key: 'linkOverFg', description: 'Link on hover', category: 'window' },
  
  // Tooltips
  { key: 'tooltipBg', description: 'Tooltip background', category: 'window' },
  { key: 'tooltipFg', description: 'Tooltip text', category: 'window' },
  { key: 'tooltipBorderFg', description: 'Tooltip border', category: 'window' },
  
  // Menu
  { key: 'menuBg', description: 'Menu background', category: 'window' },
  { key: 'menuBgOver', description: 'Menu item hover', category: 'window' },
  { key: 'menuBgRipple', description: 'Menu ripple', category: 'window' },
  { key: 'menuIconFg', description: 'Menu icon color', category: 'window' },
  { key: 'menuIconFgOver', description: 'Menu icon hover', category: 'window' },
  { key: 'menuSubmenuArrowFg', description: 'Submenu arrow', category: 'window' },
  { key: 'menuFgDisabled', description: 'Disabled menu item', category: 'window' },
  { key: 'menuSeparatorFg', description: 'Menu separator', category: 'window' },
  
  // Title bar
  { key: 'titleBg', description: 'Title bar background', category: 'window' },
  { key: 'titleBgActive', description: 'Active title background', category: 'window' },
  { key: 'titleButtonBg', description: 'Title button background', category: 'window' },
  { key: 'titleButtonFg', description: 'Title button color', category: 'window' },
  { key: 'titleButtonBgOver', description: 'Title button hover', category: 'window' },
  { key: 'titleButtonFgOver', description: 'Title button hover color', category: 'window' },
  { key: 'titleButtonBgActive', description: 'Title button active', category: 'window' },
  { key: 'titleButtonFgActive', description: 'Title button active color', category: 'window' },
  { key: 'titleButtonBgActiveOver', description: 'Title button active hover', category: 'window' },
  { key: 'titleButtonFgActiveOver', description: 'Title button active hover color', category: 'window' },
  { key: 'titleButtonCloseBg', description: 'Close button background', category: 'window' },
  { key: 'titleButtonCloseFg', description: 'Close button color', category: 'window' },
  { key: 'titleButtonCloseBgOver', description: 'Close button hover', category: 'window' },
  { key: 'titleButtonCloseFgOver', description: 'Close button hover color', category: 'window' },
  { key: 'titleButtonCloseBgActive', description: 'Close button active', category: 'window' },
  { key: 'titleButtonCloseFgActive', description: 'Close button active color', category: 'window' },
  { key: 'titleButtonCloseBgActiveOver', description: 'Close button active hover', category: 'window' },
  { key: 'titleButtonCloseFgActiveOver', description: 'Close button active hover color', category: 'window' },
  { key: 'titleFg', description: 'Title text', category: 'window' },
  { key: 'titleFgActive', description: 'Active title text', category: 'window' },
  
  // Tray icon
  { key: 'trayCounterBg', description: 'Tray counter background', category: 'window' },
  { key: 'trayCounterBgMute', description: 'Muted tray counter', category: 'window' },
  { key: 'trayCounterFg', description: 'Tray counter text', category: 'window' },
  { key: 'trayCounterBgMacInvert', description: 'Mac inverted counter', category: 'window' },
  { key: 'trayCounterFgMacInvert', description: 'Mac inverted text', category: 'window' },
  
  // Dialogs list
  { key: 'dialogsBg', description: 'Dialogs background', category: 'dialogs' },
  { key: 'dialogsBgOver', description: 'Dialogs hover', category: 'dialogs' },
  { key: 'dialogsBgActive', description: 'Active dialog', category: 'dialogs' },
  { key: 'dialogsBgRipple', description: 'Dialogs ripple', category: 'dialogs' },
  { key: 'dialogsNameFg', description: 'Chat name', category: 'dialogs' },
  { key: 'dialogsNameFgOver', description: 'Chat name hover', category: 'dialogs' },
  { key: 'dialogsNameFgActive', description: 'Active chat name', category: 'dialogs' },
  { key: 'dialogsChatIconFg', description: 'Chat icon', category: 'dialogs' },
  { key: 'dialogsChatIconFgOver', description: 'Chat icon hover', category: 'dialogs' },
  { key: 'dialogsChatIconFgActive', description: 'Active chat icon', category: 'dialogs' },
  { key: 'dialogsDateFg', description: 'Date text', category: 'dialogs' },
  { key: 'dialogsDateFgOver', description: 'Date hover', category: 'dialogs' },
  { key: 'dialogsDateFgActive', description: 'Active date', category: 'dialogs' },
  { key: 'dialogsTextFg', description: 'Message preview', category: 'dialogs' },
  { key: 'dialogsTextFgOver', description: 'Message preview hover', category: 'dialogs' },
  { key: 'dialogsTextFgActive', description: 'Active message preview', category: 'dialogs' },
  { key: 'dialogsTextFgService', description: 'Service message', category: 'dialogs' },
  { key: 'dialogsTextFgServiceOver', description: 'Service message hover', category: 'dialogs' },
  { key: 'dialogsTextFgServiceActive', description: 'Active service message', category: 'dialogs' },
  { key: 'dialogsDraftFg', description: 'Draft label', category: 'dialogs' },
  { key: 'dialogsDraftFgOver', description: 'Draft hover', category: 'dialogs' },
  { key: 'dialogsDraftFgActive', description: 'Active draft', category: 'dialogs' },
  { key: 'dialogsVerifiedIconBg', description: 'Verified badge background', category: 'dialogs' },
  { key: 'dialogsVerifiedIconFg', description: 'Verified badge icon', category: 'dialogs' },
  { key: 'dialogsVerifiedIconBgOver', description: 'Verified hover', category: 'dialogs' },
  { key: 'dialogsVerifiedIconFgOver', description: 'Verified icon hover', category: 'dialogs' },
  { key: 'dialogsVerifiedIconBgActive', description: 'Active verified', category: 'dialogs' },
  { key: 'dialogsVerifiedIconFgActive', description: 'Active verified icon', category: 'dialogs' },
  { key: 'dialogsSendingIconFg', description: 'Sending icon', category: 'dialogs' },
  { key: 'dialogsSendingIconFgOver', description: 'Sending icon hover', category: 'dialogs' },
  { key: 'dialogsSendingIconFgActive', description: 'Active sending icon', category: 'dialogs' },
  { key: 'dialogsSentIconFg', description: 'Sent checkmark', category: 'dialogs' },
  { key: 'dialogsSentIconFgOver', description: 'Sent checkmark hover', category: 'dialogs' },
  { key: 'dialogsSentIconFgActive', description: 'Active sent checkmark', category: 'dialogs' },
  { key: 'dialogsUnreadBg', description: 'Unread counter', category: 'dialogs' },
  { key: 'dialogsUnreadBgOver', description: 'Unread counter hover', category: 'dialogs' },
  { key: 'dialogsUnreadBgActive', description: 'Active unread counter', category: 'dialogs' },
  { key: 'dialogsUnreadBgMuted', description: 'Muted unread', category: 'dialogs' },
  { key: 'dialogsUnreadBgMutedOver', description: 'Muted unread hover', category: 'dialogs' },
  { key: 'dialogsUnreadBgMutedActive', description: 'Active muted unread', category: 'dialogs' },
  { key: 'dialogsUnreadFg', description: 'Unread text', category: 'dialogs' },
  { key: 'dialogsUnreadFgOver', description: 'Unread text hover', category: 'dialogs' },
  { key: 'dialogsUnreadFgActive', description: 'Active unread text', category: 'dialogs' },
  { key: 'dialogsOnlineBadgeFg', description: 'Online badge', category: 'dialogs' },
  { key: 'dialogsScamFg', description: 'Scam label', category: 'dialogs' },
  { key: 'dialogsForwardBg', description: 'Forward panel', category: 'dialogs' },
  { key: 'dialogsForwardFg', description: 'Forward text', category: 'dialogs' },
  
  // Search
  { key: 'searchedBarBg', description: 'Search bar background', category: 'dialogs' },
  { key: 'searchedBarFg', description: 'Search bar text', category: 'dialogs' },
  
  // Filter tabs
  { key: 'dialogsArchiveFg', description: 'Archive folder icon', category: 'dialogs' },
  { key: 'dialogsArchiveFgOver', description: 'Archive hover', category: 'dialogs' },
  { key: 'dialogsArchiveBg', description: 'Archive background', category: 'dialogs' },
  { key: 'dialogsArchiveBgOver', description: 'Archive hover bg', category: 'dialogs' },
  
  // Chat history
  { key: 'historyPeerArchiveUserpicBg', description: 'Archived user pic', category: 'history' },
  { key: 'historyScrollBarBg', description: 'History scrollbar', category: 'history' },
  { key: 'historyScrollBarBgOver', description: 'History scrollbar hover', category: 'history' },
  { key: 'historyScrollBg', description: 'History scroll bg', category: 'history' },
  { key: 'historyScrollBgOver', description: 'History scroll hover', category: 'history' },
  { key: 'historyForwardChooseBg', description: 'Forward choose bg', category: 'history' },
  { key: 'historyForwardChooseFg', description: 'Forward choose text', category: 'history' },
  
  // Message bubbles - outgoing
  { key: 'msgOutBg', description: 'Outgoing message background', category: 'history' },
  { key: 'msgOutBgSelected', description: 'Selected outgoing', category: 'history' },
  { key: 'msgOutShadow', description: 'Outgoing shadow', category: 'history' },
  { key: 'msgOutShadowSelected', description: 'Selected outgoing shadow', category: 'history' },
  { key: 'msgOutServiceFg', description: 'Outgoing service text', category: 'history' },
  { key: 'msgOutServiceFgSelected', description: 'Selected service text', category: 'history' },
  { key: 'msgOutDateFg', description: 'Outgoing date', category: 'history' },
  { key: 'msgOutDateFgSelected', description: 'Selected outgoing date', category: 'history' },
  
  // Message bubbles - incoming
  { key: 'msgInBg', description: 'Incoming message background', category: 'history' },
  { key: 'msgInBgSelected', description: 'Selected incoming', category: 'history' },
  { key: 'msgInShadow', description: 'Incoming shadow', category: 'history' },
  { key: 'msgInShadowSelected', description: 'Selected incoming shadow', category: 'history' },
  { key: 'msgInServiceFg', description: 'Incoming service text', category: 'history' },
  { key: 'msgInServiceFgSelected', description: 'Selected service', category: 'history' },
  { key: 'msgInDateFg', description: 'Incoming date', category: 'history' },
  { key: 'msgInDateFgSelected', description: 'Selected incoming date', category: 'history' },
  
  // Service messages
  { key: 'msgServiceBg', description: 'Service message bg', category: 'history' },
  { key: 'msgServiceBgSelected', description: 'Selected service bg', category: 'history' },
  { key: 'msgServiceFg', description: 'Service message text', category: 'history' },
  
  // Selection
  { key: 'msgSelectOverlay', description: 'Selection overlay', category: 'history' },
  { key: 'msgStickerOverlay', description: 'Sticker overlay', category: 'history' },
  
  // Reply/Forward bars
  { key: 'msgInReplyBarColor', description: 'Incoming reply bar', category: 'history' },
  { key: 'msgInReplyBarSelColor', description: 'Selected reply bar', category: 'history' },
  { key: 'msgOutReplyBarColor', description: 'Outgoing reply bar', category: 'history' },
  { key: 'msgOutReplyBarSelColor', description: 'Selected outgoing reply', category: 'history' },
  { key: 'msgInMonoFg', description: 'Incoming mono text', category: 'history' },
  { key: 'msgInMonoFgSelected', description: 'Selected mono', category: 'history' },
  { key: 'msgOutMonoFg', description: 'Outgoing mono text', category: 'history' },
  { key: 'msgOutMonoFgSelected', description: 'Selected outgoing mono', category: 'history' },
  
  // Media
  { key: 'msgDateImgBg', description: 'Media date bg', category: 'history' },
  { key: 'msgDateImgFg', description: 'Media date text', category: 'history' },
  { key: 'msgFile1Bg', description: 'File type 1 bg', category: 'history' },
  { key: 'msgFile1BgDark', description: 'File type 1 dark', category: 'history' },
  { key: 'msgFile1BgOver', description: 'File type 1 hover', category: 'history' },
  { key: 'msgFile1BgSelected', description: 'File type 1 selected', category: 'history' },
  { key: 'msgFile2Bg', description: 'File type 2 bg', category: 'history' },
  { key: 'msgFile2BgDark', description: 'File type 2 dark', category: 'history' },
  { key: 'msgFile2BgOver', description: 'File type 2 hover', category: 'history' },
  { key: 'msgFile2BgSelected', description: 'File type 2 selected', category: 'history' },
  { key: 'msgFile3Bg', description: 'File type 3 bg', category: 'history' },
  { key: 'msgFile3BgDark', description: 'File type 3 dark', category: 'history' },
  { key: 'msgFile3BgOver', description: 'File type 3 hover', category: 'history' },
  { key: 'msgFile3BgSelected', description: 'File type 3 selected', category: 'history' },
  { key: 'msgFile4Bg', description: 'File type 4 bg', category: 'history' },
  { key: 'msgFile4BgDark', description: 'File type 4 dark', category: 'history' },
  { key: 'msgFile4BgOver', description: 'File type 4 hover', category: 'history' },
  { key: 'msgFile4BgSelected', description: 'File type 4 selected', category: 'history' },
  { key: 'msgWaveformInActive', description: 'Voice wave active', category: 'history' },
  { key: 'msgWaveformInInactive', description: 'Voice wave inactive', category: 'history' },
  { key: 'msgWaveformOutActive', description: 'Out voice active', category: 'history' },
  { key: 'msgWaveformOutInactive', description: 'Out voice inactive', category: 'history' },
  
  // Chat compose
  { key: 'historyComposeAreaBg', description: 'Compose area bg', category: 'history' },
  { key: 'historyComposeAreaFg', description: 'Compose text', category: 'history' },
  { key: 'historyComposeAreaFgService', description: 'Compose service', category: 'history' },
  { key: 'historyComposeIconFg', description: 'Compose icons', category: 'history' },
  { key: 'historyComposeIconFgOver', description: 'Compose icons hover', category: 'history' },
  { key: 'historySendIconFg', description: 'Send button', category: 'history' },
  { key: 'historySendIconFgOver', description: 'Send button hover', category: 'history' },
  { key: 'historyPinnedBg', description: 'Pinned message bg', category: 'history' },
  { key: 'historyReplyBg', description: 'Reply preview bg', category: 'history' },
  { key: 'historyReplyIconFg', description: 'Reply icon', category: 'history' },
  { key: 'historyReplyCancelFg', description: 'Reply cancel', category: 'history' },
  { key: 'historyReplyCancelFgOver', description: 'Reply cancel hover', category: 'history' },
  
  // Chat background
  { key: 'historyToDownBg', description: 'Scroll down button', category: 'history' },
  { key: 'historyToDownBgOver', description: 'Scroll down hover', category: 'history' },
  { key: 'historyToDownBgRipple', description: 'Scroll down ripple', category: 'history' },
  { key: 'historyToDownFg', description: 'Scroll down icon', category: 'history' },
  { key: 'historyToDownFgOver', description: 'Scroll down icon hover', category: 'history' },
  { key: 'historyToDownShadow', description: 'Scroll down shadow', category: 'history' },
  
  // Input field
  { key: 'historyTextInFg', description: 'Input text', category: 'history' },
  { key: 'historyTextInFgSelected', description: 'Selected input', category: 'history' },
  { key: 'historyTextOutFg', description: 'Output text', category: 'history' },
  { key: 'historyTextOutFgSelected', description: 'Selected output', category: 'history' },
  { key: 'historyLinkInFg', description: 'Link in incoming', category: 'history' },
  { key: 'historyLinkInFgSelected', description: 'Selected link in', category: 'history' },
  { key: 'historyLinkOutFg', description: 'Link in outgoing', category: 'history' },
  { key: 'historyLinkOutFgSelected', description: 'Selected link out', category: 'history' },
  
  // Read markers
  { key: 'historyOutIconFg', description: 'Read checkmark', category: 'history' },
  { key: 'historyOutIconFgSelected', description: 'Selected checkmark', category: 'history' },
  { key: 'historyIconFgInverted', description: 'Inverted icon', category: 'history' },
  
  // Profile/Info
  { key: 'topBarBg', description: 'Top bar background', category: 'profile' },
  { key: 'profileBg', description: 'Profile background', category: 'profile' },
  { key: 'profileOtherAdminStarFg', description: 'Admin star', category: 'profile' },
  { key: 'profileVerifiedCheckBg', description: 'Verified check bg', category: 'profile' },
  { key: 'profileVerifiedCheckFg', description: 'Verified check fg', category: 'profile' },
  { key: 'profileAdminStartFg', description: 'Admin star fg', category: 'profile' },
  
  // Emoji panel
  { key: 'emojiPanBg', description: 'Emoji panel bg', category: 'misc' },
  { key: 'emojiPanCategories', description: 'Emoji categories bg', category: 'misc' },
  { key: 'emojiPanHeaderBg', description: 'Emoji header bg', category: 'misc' },
  { key: 'emojiPanHeaderFg', description: 'Emoji header fg', category: 'misc' },
  { key: 'stickerPanDeleteBg', description: 'Sticker delete bg', category: 'misc' },
  { key: 'stickerPanDeleteFg', description: 'Sticker delete fg', category: 'misc' },
  { key: 'stickerPreviewBg', description: 'Sticker preview bg', category: 'misc' },
  
  // Box/Dialogs
  { key: 'boxBg', description: 'Dialog box bg', category: 'misc' },
  { key: 'boxTextFg', description: 'Dialog text', category: 'misc' },
  { key: 'boxTextFgGood', description: 'Success text', category: 'misc' },
  { key: 'boxTextFgError', description: 'Error text', category: 'misc' },
  { key: 'boxTitleFg', description: 'Dialog title', category: 'misc' },
  { key: 'boxSearchBg', description: 'Search in dialog', category: 'misc' },
  { key: 'boxTitleAdditionalFg', description: 'Additional title', category: 'misc' },
  { key: 'boxTitleCloseFg', description: 'Close button', category: 'misc' },
  { key: 'boxTitleCloseFgOver', description: 'Close hover', category: 'misc' },
  
  // Buttons
  { key: 'activeButtonBg', description: 'Primary button bg', category: 'misc' },
  { key: 'activeButtonBgOver', description: 'Primary button hover', category: 'misc' },
  { key: 'activeButtonBgRipple', description: 'Primary button ripple', category: 'misc' },
  { key: 'activeButtonFg', description: 'Primary button text', category: 'misc' },
  { key: 'activeButtonFgOver', description: 'Primary button hover text', category: 'misc' },
  { key: 'activeButtonSecondaryFg', description: 'Secondary text', category: 'misc' },
  { key: 'activeButtonSecondaryFgOver', description: 'Secondary hover', category: 'misc' },
  { key: 'activeLineFg', description: 'Active line', category: 'misc' },
  { key: 'activeLineFgError', description: 'Error line', category: 'misc' },
  { key: 'lightButtonBg', description: 'Light button bg', category: 'misc' },
  { key: 'lightButtonBgOver', description: 'Light button hover', category: 'misc' },
  { key: 'lightButtonBgRipple', description: 'Light button ripple', category: 'misc' },
  { key: 'lightButtonFg', description: 'Light button text', category: 'misc' },
  { key: 'lightButtonFgOver', description: 'Light button hover text', category: 'misc' },
  { key: 'cancelIconFg', description: 'Cancel icon', category: 'misc' },
  { key: 'cancelIconFgOver', description: 'Cancel hover', category: 'misc' },
  
  // Checkboxes/Radio
  { key: 'checkboxFg', description: 'Checkbox border', category: 'misc' },
  { key: 'sliderBgInactive', description: 'Inactive slider', category: 'misc' },
  { key: 'sliderBgActive', description: 'Active slider', category: 'misc' },
  
  // Input fields
  { key: 'inputBorderFg', description: 'Input border', category: 'misc' },
  
  // Media player
  { key: 'mediaPlayerBg', description: 'Player background', category: 'media' },
  { key: 'mediaPlayerActiveFg', description: 'Player active', category: 'media' },
  { key: 'mediaPlayerInactiveFg', description: 'Player inactive', category: 'media' },
  { key: 'mediaPlayerDisabledFg', description: 'Player disabled', category: 'media' },
  { key: 'mediaviewFileBg', description: 'File view bg', category: 'media' },
  { key: 'mediaviewFileNameFg', description: 'File name', category: 'media' },
  { key: 'mediaviewFileSizeFg', description: 'File size', category: 'media' },
  { key: 'mediaviewFileRedCornerFg', description: 'File red corner', category: 'media' },
  { key: 'mediaviewFileYellowCornerFg', description: 'File yellow corner', category: 'media' },
  { key: 'mediaviewFileGreenCornerFg', description: 'File green corner', category: 'media' },
  { key: 'mediaviewFileBlueCornerFg', description: 'File blue corner', category: 'media' },
  { key: 'mediaviewFileExtFg', description: 'File extension', category: 'media' },
  { key: 'mediaviewMenuBg', description: 'Media menu bg', category: 'media' },
  { key: 'mediaviewMenuBgOver', description: 'Media menu hover', category: 'media' },
  { key: 'mediaviewMenuFg', description: 'Media menu fg', category: 'media' },
  { key: 'mediaviewBg', description: 'Media view bg', category: 'media' },
  { key: 'mediaviewVideoBg', description: 'Video view bg', category: 'media' },
  { key: 'mediaviewControlBg', description: 'Control bg', category: 'media' },
  { key: 'mediaviewControlFg', description: 'Control fg', category: 'media' },
  { key: 'mediaviewCaptionBg', description: 'Caption bg', category: 'media' },
  { key: 'mediaviewCaptionFg', description: 'Caption fg', category: 'media' },
  { key: 'mediaviewTextLinkFg', description: 'Media text link', category: 'media' },
  { key: 'mediaviewSaveMsgBg', description: 'Save message bg', category: 'media' },
  { key: 'mediaviewSaveMsgFg', description: 'Save message fg', category: 'media' },
  { key: 'mediaviewPlaybackActive', description: 'Playback active', category: 'media' },
  { key: 'mediaviewPlaybackInactive', description: 'Playback inactive', category: 'media' },
  { key: 'mediaviewPlaybackActiveOver', description: 'Playback hover', category: 'media' },
  { key: 'mediaviewPlaybackInactiveOver', description: 'Playback inactive hover', category: 'media' },
  { key: 'mediaviewPlaybackProgressFg', description: 'Progress fg', category: 'media' },
  { key: 'mediaviewPlaybackIconFg', description: 'Playback icon', category: 'media' },
  { key: 'mediaviewPlaybackIconFgOver', description: 'Playback icon hover', category: 'media' },
  { key: 'mediaviewTransparentBg', description: 'Transparent bg', category: 'media' },
  { key: 'mediaviewTransparentFg', description: 'Transparent fg', category: 'media' },
  
  // Notifications
  { key: 'notificationBg', description: 'Notification bg', category: 'misc' },
  
  // Calls
  { key: 'callBg', description: 'Call background', category: 'calls' },
  { key: 'callNameFg', description: 'Call name', category: 'calls' },
  { key: 'callFingerprintBg', description: 'Fingerprint bg', category: 'calls' },
  { key: 'callStatusFg', description: 'Call status', category: 'calls' },
  { key: 'callIconFg', description: 'Call icon', category: 'calls' },
  { key: 'callAnswerBg', description: 'Answer button', category: 'calls' },
  { key: 'callAnswerRipple', description: 'Answer ripple', category: 'calls' },
  { key: 'callAnswerBgOuter', description: 'Answer outer', category: 'calls' },
  { key: 'callHangupBg', description: 'Hangup button', category: 'calls' },
  { key: 'callHangupRipple', description: 'Hangup ripple', category: 'calls' },
  { key: 'callCancelBg', description: 'Cancel bg', category: 'calls' },
  { key: 'callCancelFg', description: 'Cancel fg', category: 'calls' },
  { key: 'callCancelRipple', description: 'Cancel ripple', category: 'calls' },
  { key: 'callMuteRipple', description: 'Mute ripple', category: 'calls' },
  { key: 'callBarBg', description: 'Call bar bg', category: 'calls' },
  { key: 'callBarMuteRipple', description: 'Call bar mute', category: 'calls' },
  { key: 'callBarBgMuted', description: 'Call bar muted', category: 'calls' },
  { key: 'callBarUnmuteRipple', description: 'Call bar unmute', category: 'calls' },
  { key: 'callBarFg', description: 'Call bar fg', category: 'calls' },
  
  // Intro/Login
  { key: 'introBg', description: 'Intro background', category: 'intro' },
  { key: 'introTitleFg', description: 'Intro title', category: 'intro' },
  { key: 'introDescriptionFg', description: 'Intro description', category: 'intro' },
  { key: 'introErrorFg', description: 'Intro error', category: 'intro' },
  { key: 'introCoverTopBg', description: 'Cover top bg', category: 'intro' },
  { key: 'introCoverBottomBg', description: 'Cover bottom bg', category: 'intro' },
  { key: 'introCoverIconsFg', description: 'Cover icons', category: 'intro' },
  { key: 'introCoverPlaneTrace', description: 'Plane trace', category: 'intro' },
  { key: 'introCoverPlaneOuter', description: 'Plane outer', category: 'intro' },
  { key: 'introCoverPlaneInner', description: 'Plane inner', category: 'intro' },
  { key: 'introCoverPlaneTop', description: 'Plane top', category: 'intro' },
  
  // Settings sidebar
  { key: 'sideBarBg', description: 'Sidebar background', category: 'settings' },
  { key: 'sideBarBgActive', description: 'Active sidebar item', category: 'settings' },
  { key: 'sideBarBgRipple', description: 'Sidebar ripple', category: 'settings' },
  { key: 'sideBarTextFg', description: 'Sidebar text', category: 'settings' },
  { key: 'sideBarTextFgActive', description: 'Active sidebar text', category: 'settings' },
  { key: 'sideBarIconFg', description: 'Sidebar icon', category: 'settings' },
  { key: 'sideBarIconFgActive', description: 'Active sidebar icon', category: 'settings' },
  { key: 'sideBarBadgeBg', description: 'Sidebar badge bg', category: 'settings' },
  { key: 'sideBarBadgeBgMuted', description: 'Muted badge bg', category: 'settings' },
  { key: 'sideBarBadgeFg', description: 'Sidebar badge text', category: 'settings' },
  
  // Placeholder
  { key: 'placeholderFg', description: 'Placeholder text', category: 'misc' },
  { key: 'placeholderFgActive', description: 'Active placeholder', category: 'misc' },
  
  // Photos
  { key: 'photosPhotoFg', description: 'Photos fg', category: 'misc' },
  { key: 'photosPrimaryBg', description: 'Photos primary', category: 'misc' },
  { key: 'photosIconBg', description: 'Photos icon bg', category: 'misc' },
  { key: 'photosSelectBg', description: 'Photos select bg', category: 'misc' },
  
  // Report spam
  { key: 'reportSpamBg', description: 'Report spam bg', category: 'misc' },
  { key: 'reportSpamFg', description: 'Report spam fg', category: 'misc' },
];

/**
 * Required properties that must be present in every theme
 */
export const REQUIRED_PROPERTIES = [
  'windowBg',
  'windowFg',
  'windowBgOver',
  'windowFgOver',
  'windowBgActive',
  'windowFgActive',
  'dialogsBg',
  'dialogsNameFg',
  'dialogsTextFg',
  'msgInBg',
  'msgOutBg',
  'historyComposeAreaBg',
  'historyTextInFg',
  'historyTextOutFg',
  'activeButtonBg',
  'activeButtonFg',
];

/**
 * Default base theme values (light theme)
 * These provide fallback colors when not mapped from extracted colors
 */
export const DEFAULT_LIGHT_THEME: Record<string, string> = {
  // Window
  windowBg: 'ffffff',
  windowFg: '000000',
  windowBgOver: 'f1f1f1',
  windowBgRipple: 'e5e5e5',
  windowFgOver: '000000',
  windowSubTextFg: '999999',
  windowSubTextFgOver: '919191',
  windowBoldFg: '222222',
  windowBoldFgOver: '222222',
  windowBgActive: '40a7e3',
  windowFgActive: 'ffffff',
  windowActiveTextFg: '168acd',
  windowShadowFg: '00000018',
  windowShadowFgFallback: 'f1f1f1',
  
  // Scrollbar
  scrollBarBg: '40a7e353',
  scrollBarBgOver: '40a7e37a',
  scrollBg: '0000001a',
  scrollBgOver: '0000002c',
  
  // Links
  linkFg: '2fa9e2',
  linkOverFg: '168acd',
  
  // Tooltips
  tooltipBg: 'eef2f5',
  tooltipFg: '5d6c80',
  tooltipBorderFg: 'c9d1db',
  
  // Menu
  menuBg: 'f7f7f7',
  menuBgOver: 'f1f1f1',
  menuBgRipple: 'e5e5e5',
  menuIconFg: 'a8a8a8',
  menuIconFgOver: '999999',
  menuSubmenuArrowFg: '373737',
  menuFgDisabled: 'cccccc',
  menuSeparatorFg: 'f1f1f1',
  
  // Title bar
  titleBg: 'f1f1f1',
  titleBgActive: 'e3e3e3',
  titleButtonBg: 'f1f1f100',
  titleButtonFg: 'ababab',
  titleButtonBgOver: 'e5e5e5',
  titleButtonFgOver: '9a9a9a',
  titleButtonBgActive: 'e5e5e5',
  titleButtonFgActive: '828282',
  titleButtonBgActiveOver: 'd1d1d1',
  titleButtonFgActiveOver: '828282',
  titleButtonCloseBg: 'f1f1f100',
  titleButtonCloseFg: 'ababab',
  titleButtonCloseBgOver: 'e81123',
  titleButtonCloseFgOver: 'ffffff',
  titleButtonCloseBgActive: 'e81123',
  titleButtonCloseFgActive: 'ffffff',
  titleButtonCloseBgActiveOver: 'f1707a',
  titleButtonCloseFgActiveOver: 'ffffff',
  titleFg: 'acacac',
  titleFgActive: '3e3c3e',
  
  // Tray
  trayCounterBg: 'f23c34',
  trayCounterBgMute: '888888',
  trayCounterFg: 'ffffff',
  trayCounterBgMacInvert: 'ffffff',
  trayCounterFgMacInvert: 'ffffff01',
  
  // Dialogs
  dialogsBg: 'ffffff',
  dialogsBgOver: 'f7f7f7',
  dialogsBgActive: '419fd9',
  dialogsBgRipple: 'ededed',
  dialogsNameFg: '000000',
  dialogsNameFgOver: '000000',
  dialogsNameFgActive: 'ffffff',
  dialogsChatIconFg: '42a5f5',
  dialogsChatIconFgOver: '42a5f5',
  dialogsChatIconFgActive: 'ffffff',
  dialogsDateFg: '999999',
  dialogsDateFgOver: '999999',
  dialogsDateFgActive: 'ffffff',
  dialogsTextFg: '999999',
  dialogsTextFgOver: '999999',
  dialogsTextFgActive: 'ffffff',
  dialogsTextFgService: '168acd',
  dialogsTextFgServiceOver: '168acd',
  dialogsTextFgServiceActive: 'ffffff',
  dialogsDraftFg: 'dd4b39',
  dialogsDraftFgOver: 'dd4b39',
  dialogsDraftFgActive: 'c6e1f7',
  dialogsVerifiedIconBg: '40a7e3',
  dialogsVerifiedIconFg: 'ffffff',
  dialogsVerifiedIconBgOver: '40a7e3',
  dialogsVerifiedIconFgOver: 'ffffff',
  dialogsVerifiedIconBgActive: 'ffffff',
  dialogsVerifiedIconFgActive: '419fd9',
  dialogsSendingIconFg: 'c1c1c1',
  dialogsSendingIconFgOver: 'c1c1c1',
  dialogsSendingIconFgActive: 'ffffff',
  dialogsSentIconFg: '5dc452',
  dialogsSentIconFgOver: '5dc452',
  dialogsSentIconFgActive: 'ffffff',
  dialogsUnreadBg: '419fd9',
  dialogsUnreadBgOver: '419fd9',
  dialogsUnreadBgActive: 'ffffff',
  dialogsUnreadBgMuted: 'bbbbbb',
  dialogsUnreadBgMutedOver: 'bbbbbb',
  dialogsUnreadBgMutedActive: 'ffffff',
  dialogsUnreadFg: 'ffffff',
  dialogsUnreadFgOver: 'ffffff',
  dialogsUnreadFgActive: '419fd9',
  dialogsOnlineBadgeFg: '5dc452',
  dialogsScamFg: 'e14d4d',
  dialogsForwardBg: '418fd9',
  dialogsForwardFg: 'ffffff',
  
  // Search
  searchedBarBg: 'e5e5e5',
  searchedBarFg: '000000',
  
  // Archive
  dialogsArchiveFg: '999999',
  dialogsArchiveFgOver: '999999',
  dialogsArchiveBg: '999999',
  dialogsArchiveBgOver: '999999',
  
  // History
  historyPeerArchiveUserpicBg: '999999',
  historyScrollBarBg: '40a7e37a',
  historyScrollBarBgOver: '40a7e3bc',
  historyScrollBg: '0000001a',
  historyScrollBgOver: '0000002c',
  historyForwardChooseBg: '00000066',
  historyForwardChooseFg: 'ffffff',
  
  // Message bubbles
  msgOutBg: 'efffde',
  msgOutBgSelected: 'b7dbdb',
  msgOutShadow: '4e9f4e29',
  msgOutShadowSelected: '378c6a29',
  msgOutServiceFg: '3a8e26',
  msgOutServiceFgSelected: '367570',
  msgOutDateFg: '6cc264',
  msgOutDateFgSelected: '50a79c',
  msgInBg: 'ffffff',
  msgInBgSelected: 'c2dcf2',
  msgInShadow: '748ea229',
  msgInShadowSelected: '3a78b329',
  msgInServiceFg: '168acd',
  msgInServiceFgSelected: '3a95d5',
  msgInDateFg: 'a0acb6',
  msgInDateFgSelected: '6a9cc5',
  
  // Service messages
  msgServiceBg: '5dc4529c',
  msgServiceBgSelected: '8bd4a9a2',
  msgServiceFg: 'ffffff',
  
  // Selection
  msgSelectOverlay: '358cd466',
  msgStickerOverlay: '358cd47f',
  
  // Reply bars
  msgInReplyBarColor: '419fd9',
  msgInReplyBarSelColor: '419fd9',
  msgOutReplyBarColor: '6ec96e',
  msgOutReplyBarSelColor: '55c084',
  msgInMonoFg: '4e7391',
  msgInMonoFgSelected: '4e7391',
  msgOutMonoFg: '469165',
  msgOutMonoFgSelected: '469165',
  
  // Media date
  msgDateImgBg: '00000054',
  msgDateImgFg: 'ffffff',
  
  // File types
  msgFile1Bg: '72b1df',
  msgFile1BgDark: '5c9ece',
  msgFile1BgOver: '5294c4',
  msgFile1BgSelected: '5099d0',
  msgFile2Bg: '61b96e',
  msgFile2BgDark: '4da859',
  msgFile2BgOver: '44a050',
  msgFile2BgSelected: '46a07e',
  msgFile3Bg: 'e47272',
  msgFile3BgDark: 'cd5b5e',
  msgFile3BgOver: 'c35154',
  msgFile3BgSelected: 'c75f74',
  msgFile4Bg: 'efc274',
  msgFile4BgDark: 'e6a561',
  msgFile4BgOver: 'dc9c5a',
  msgFile4BgSelected: 'e6bf83',
  
  // Voice waveform
  msgWaveformInActive: '51acd7',
  msgWaveformInInactive: 'cfe5ef',
  msgWaveformOutActive: '78c67d',
  msgWaveformOutInactive: 'b3e2b4',
  
  // Compose area
  historyComposeAreaBg: 'ffffff',
  historyComposeAreaFg: '000000',
  historyComposeAreaFgService: '999999',
  historyComposeIconFg: '999999',
  historyComposeIconFgOver: '7c99b2',
  historySendIconFg: '40a7e3',
  historySendIconFgOver: '168acd',
  historyPinnedBg: 'f7f7f7',
  historyReplyBg: 'f7f7f7',
  historyReplyIconFg: '40a7e3',
  historyReplyCancelFg: 'aaaaaa',
  historyReplyCancelFgOver: '999999',
  
  // Scroll to bottom
  historyToDownBg: 'ffffff',
  historyToDownBgOver: 'f7f7f7',
  historyToDownBgRipple: 'ededed',
  historyToDownFg: '40a7e3',
  historyToDownFgOver: '40a7e3',
  historyToDownShadow: '00000040',
  
  // History text
  historyTextInFg: '000000',
  historyTextInFgSelected: '000000',
  historyTextOutFg: '000000',
  historyTextOutFgSelected: '000000',
  historyLinkInFg: '2fa9e2',
  historyLinkInFgSelected: '2fa9e2',
  historyLinkOutFg: '2fa9e2',
  historyLinkOutFgSelected: '2fa9e2',
  
  // Read markers
  historyOutIconFg: '5dc452',
  historyOutIconFgSelected: '44b594',
  historyIconFgInverted: 'ffffffc8',
  
  // Profile
  topBarBg: 'ffffff',
  profileBg: 'ffffff',
  profileOtherAdminStarFg: 'ffa60d',
  profileVerifiedCheckBg: '40a7e3',
  profileVerifiedCheckFg: 'ffffff',
  profileAdminStartFg: 'ffa60d',
  
  // Emoji panel
  emojiPanBg: 'f7f7f7',
  emojiPanCategories: 'f7f7f7',
  emojiPanHeaderBg: 'f7f7f7',
  emojiPanHeaderFg: '999999',
  stickerPanDeleteBg: 'f7f7f7cc',
  stickerPanDeleteFg: '000000',
  stickerPreviewBg: 'f7f7f7eb',
  
  // Box/Dialog
  boxBg: 'ffffff',
  boxTextFg: '000000',
  boxTextFgGood: '4ab44a',
  boxTextFgError: 'd84d4d',
  boxTitleFg: '000000',
  boxSearchBg: 'f1f3f4',
  boxTitleAdditionalFg: '808080',
  boxTitleCloseFg: 'a8a8a8',
  boxTitleCloseFgOver: '999999',
  
  // Buttons
  activeButtonBg: '40a7e3',
  activeButtonBgOver: '39a5db',
  activeButtonBgRipple: '2095d0',
  activeButtonFg: 'ffffff',
  activeButtonFgOver: 'ffffff',
  activeButtonSecondaryFg: 'cceeff',
  activeButtonSecondaryFgOver: 'cceeff',
  activeLineFg: '37a1de',
  activeLineFgError: 'e48383',
  lightButtonBg: 'ffffff',
  lightButtonBgOver: 'f1f1f1',
  lightButtonBgRipple: 'e5e5e5',
  lightButtonFg: '168acd',
  lightButtonFgOver: '168acd',
  cancelIconFg: 'ababab',
  cancelIconFgOver: '999999',
  
  // Checkbox/Slider
  checkboxFg: 'b1b1b1',
  sliderBgInactive: 'e1eaef',
  sliderBgActive: '40a7e3',
  
  // Input
  inputBorderFg: 'e0e0e0',
  
  // Media player
  mediaPlayerBg: 'ffffff',
  mediaPlayerActiveFg: '168acd',
  mediaPlayerInactiveFg: 'e9e9e9',
  mediaPlayerDisabledFg: 'efefef',
  mediaviewFileBg: '00000066',
  mediaviewFileNameFg: 'ffffff',
  mediaviewFileSizeFg: 'ffffffb2',
  mediaviewFileRedCornerFg: 'db5856',
  mediaviewFileYellowCornerFg: 'e8a556',
  mediaviewFileGreenCornerFg: '5fb76e',
  mediaviewFileBlueCornerFg: '49a8d8',
  mediaviewFileExtFg: 'ffffff',
  mediaviewMenuBg: 'ffffff',
  mediaviewMenuBgOver: 'f7f7f7',
  mediaviewMenuFg: '505050',
  mediaviewBg: '000000eb',
  mediaviewVideoBg: '000000',
  mediaviewControlBg: '00000066',
  mediaviewControlFg: 'ffffff',
  mediaviewCaptionBg: '00000066',
  mediaviewCaptionFg: 'ffffff',
  mediaviewTextLinkFg: '90d0ff',
  mediaviewSaveMsgBg: '00000066',
  mediaviewSaveMsgFg: 'ffffff',
  mediaviewPlaybackActive: 'ffffff',
  mediaviewPlaybackInactive: '666666',
  mediaviewPlaybackActiveOver: 'ffffff',
  mediaviewPlaybackInactiveOver: 'a0a0a0',
  mediaviewPlaybackProgressFg: 'ffffffc7',
  mediaviewPlaybackIconFg: 'ffffff',
  mediaviewPlaybackIconFgOver: 'ffffff',
  mediaviewTransparentBg: 'ffffff',
  mediaviewTransparentFg: 'cccccc',
  
  // Notification
  notificationBg: 'ffffff',
  
  // Calls
  callBg: '26282cf2',
  callNameFg: 'ffffff',
  callFingerprintBg: 'ffffff12',
  callStatusFg: 'ffffff',
  callIconFg: 'ffffff',
  callAnswerBg: '5db961',
  callAnswerRipple: 'a5cf9b',
  callAnswerBgOuter: '5db96166',
  callHangupBg: 'd75a5a',
  callHangupRipple: 'e69898',
  callCancelBg: 'ffffff',
  callCancelFg: '777777',
  callCancelRipple: 'e9e9e9',
  callMuteRipple: 'ffffff40',
  callBarBg: '5db961',
  callBarMuteRipple: '66db70',
  callBarBgMuted: '999999',
  callBarUnmuteRipple: 'aaaaaa',
  callBarFg: 'ffffff',
  
  // Intro
  introBg: 'ffffff',
  introTitleFg: '000000',
  introDescriptionFg: '737373',
  introErrorFg: 'e35353',
  introCoverTopBg: '6aa8e6',
  introCoverBottomBg: '358bd4',
  introCoverIconsFg: '50acf3',
  introCoverPlaneTrace: '519ee648',
  introCoverPlaneOuter: '6abce7',
  introCoverPlaneInner: 'ffffff',
  introCoverPlaneTop: 'ffffff',
  
  // Settings sidebar
  sideBarBg: 'f1f1f1',
  sideBarBgActive: 'ffffff',
  sideBarBgRipple: 'e5e5e5',
  sideBarTextFg: '000000',
  sideBarTextFgActive: '000000',
  sideBarIconFg: '999999',
  sideBarIconFgActive: '40a7e3',
  sideBarBadgeBg: '40a7e3',
  sideBarBadgeBgMuted: '999999',
  sideBarBadgeFg: 'ffffff',
  
  // Placeholder
  placeholderFg: 'aaaaaa',
  placeholderFgActive: '999999',
  
  // Photos
  photosPhotoFg: '000000',
  photosPrimaryBg: '40a7e3',
  photosIconBg: '40a7e3',
  photosSelectBg: '40a7e3',
  
  // Report spam
  reportSpamBg: 'e5eaed',
  reportSpamFg: '636c72',
};

/**
 * Default dark theme values
 */
export const DEFAULT_DARK_THEME: Record<string, string> = {
  // Window
  windowBg: '17212b',
  windowFg: 'e9e9e9',
  windowBgOver: '232f3d',
  windowBgRipple: '1c2731',
  windowFgOver: 'e9e9e9',
  windowSubTextFg: '708499',
  windowSubTextFgOver: '708499',
  windowBoldFg: 'e9e9e9',
  windowBoldFgOver: 'e9e9e9',
  windowBgActive: '5288c1',
  windowFgActive: 'ffffff',
  windowActiveTextFg: '71bafa',
  windowShadowFg: '000000',
  windowShadowFgFallback: '0c0f13',
  
  // Scrollbar
  scrollBarBg: '5b8fb373',
  scrollBarBgOver: '5b8fb3b2',
  scrollBg: 'ffffff14',
  scrollBgOver: 'ffffff29',
  
  // Links
  linkFg: '58b6ed',
  linkOverFg: '7fcdff',
  
  // Tooltips
  tooltipBg: '3d5265',
  tooltipFg: 'd3e2ef',
  tooltipBorderFg: '5e7284',
  
  // Menu
  menuBg: '17212b',
  menuBgOver: '232f3d',
  menuBgRipple: '1c2731',
  menuIconFg: '708499',
  menuIconFgOver: '8aa3bd',
  menuSubmenuArrowFg: 'd5dee7',
  menuFgDisabled: '5b6b79',
  menuSeparatorFg: '1c2731',
  
  // Title bar
  titleBg: '17212b',
  titleBgActive: '17212b',
  titleButtonBg: '17212b00',
  titleButtonFg: '7b8892',
  titleButtonBgOver: '232f3d',
  titleButtonFgOver: '8b989f',
  titleButtonBgActive: '232f3d',
  titleButtonFgActive: '8b989f',
  titleButtonBgActiveOver: '3a4a5a',
  titleButtonFgActiveOver: '8b989f',
  titleButtonCloseBg: '17212b00',
  titleButtonCloseFg: '7b8892',
  titleButtonCloseBgOver: 'e81123',
  titleButtonCloseFgOver: 'ffffff',
  titleButtonCloseBgActive: 'e81123',
  titleButtonCloseFgActive: 'ffffff',
  titleButtonCloseBgActiveOver: 'f1707a',
  titleButtonCloseFgActiveOver: 'ffffff',
  titleFg: '7b8892',
  titleFgActive: 'f0f0f0',
  
  // Tray
  trayCounterBg: 'f23c34',
  trayCounterBgMute: '888888',
  trayCounterFg: 'ffffff',
  trayCounterBgMacInvert: 'ffffff',
  trayCounterFgMacInvert: 'ffffff01',
  
  // Dialogs
  dialogsBg: '17212b',
  dialogsBgOver: '202b36',
  dialogsBgActive: '2b5278',
  dialogsBgRipple: '1c2731',
  dialogsNameFg: 'e9e9e9',
  dialogsNameFgOver: 'e9e9e9',
  dialogsNameFgActive: 'ffffff',
  dialogsChatIconFg: '5288c1',
  dialogsChatIconFgOver: '5288c1',
  dialogsChatIconFgActive: 'd4e8f2',
  dialogsDateFg: '708499',
  dialogsDateFgOver: '708499',
  dialogsDateFgActive: 'cce5ff',
  dialogsTextFg: '708499',
  dialogsTextFgOver: '708499',
  dialogsTextFgActive: 'cce5ff',
  dialogsTextFgService: '71bafa',
  dialogsTextFgServiceOver: '71bafa',
  dialogsTextFgServiceActive: 'cce5ff',
  dialogsDraftFg: 'dd4b39',
  dialogsDraftFgOver: 'dd4b39',
  dialogsDraftFgActive: 'cce5ff',
  dialogsVerifiedIconBg: '5288c1',
  dialogsVerifiedIconFg: '17212b',
  dialogsVerifiedIconBgOver: '5288c1',
  dialogsVerifiedIconFgOver: '17212b',
  dialogsVerifiedIconBgActive: 'ffffff',
  dialogsVerifiedIconFgActive: '2b5278',
  dialogsSendingIconFg: '708499',
  dialogsSendingIconFgOver: '708499',
  dialogsSendingIconFgActive: 'cce3f3',
  dialogsSentIconFg: '5dc452',
  dialogsSentIconFgOver: '5dc452',
  dialogsSentIconFgActive: 'cce5ff',
  dialogsUnreadBg: '5288c1',
  dialogsUnreadBgOver: '5288c1',
  dialogsUnreadBgActive: '79c4fc',
  dialogsUnreadBgMuted: '37485c',
  dialogsUnreadBgMutedOver: '37485c',
  dialogsUnreadBgMutedActive: '79c4fc',
  dialogsUnreadFg: 'ffffff',
  dialogsUnreadFgOver: 'ffffff',
  dialogsUnreadFgActive: '17212b',
  dialogsOnlineBadgeFg: '5dc452',
  dialogsScamFg: 'e14d4d',
  dialogsForwardBg: '276ca1',
  dialogsForwardFg: 'ffffff',
  
  // Search
  searchedBarBg: '202b36',
  searchedBarFg: 'e9e9e9',
  
  // Archive
  dialogsArchiveFg: '708499',
  dialogsArchiveFgOver: '708499',
  dialogsArchiveBg: '37485c',
  dialogsArchiveBgOver: '37485c',
  
  // History
  historyPeerArchiveUserpicBg: '708499',
  historyScrollBarBg: '5b8fb37a',
  historyScrollBarBgOver: '5b8fb3bc',
  historyScrollBg: 'ffffff14',
  historyScrollBgOver: 'ffffff29',
  historyForwardChooseBg: '00000066',
  historyForwardChooseFg: 'ffffff',
  
  // Message bubbles
  msgOutBg: '2b5278',
  msgOutBgSelected: '3b6389',
  msgOutShadow: '1d374e29',
  msgOutShadowSelected: '285e8029',
  msgOutServiceFg: '68b8f6',
  msgOutServiceFgSelected: '8ac4f2',
  msgOutDateFg: '76b9f6',
  msgOutDateFgSelected: '8ac4f2',
  msgInBg: '182533',
  msgInBgSelected: '2e4057',
  msgInShadow: '1c1f2229',
  msgInShadowSelected: '1c3e5329',
  msgInServiceFg: '71bafa',
  msgInServiceFgSelected: '71bafa',
  msgInDateFg: '6a8faa',
  msgInDateFgSelected: '7ab0d5',
  
  // Service messages
  msgServiceBg: '0b3650a7',
  msgServiceBgSelected: '0d3e5aab',
  msgServiceFg: 'ffffff',
  
  // Selection
  msgSelectOverlay: '3b719866',
  msgStickerOverlay: '3b71987f',
  
  // Reply bars
  msgInReplyBarColor: '5288c1',
  msgInReplyBarSelColor: '428fc1',
  msgOutReplyBarColor: '68c9f0',
  msgOutReplyBarSelColor: '73c8ec',
  msgInMonoFg: '8fbfea',
  msgInMonoFgSelected: '8fbfea',
  msgOutMonoFg: '92c0f0',
  msgOutMonoFgSelected: '92c0f0',
  
  // Media date
  msgDateImgBg: '0000007a',
  msgDateImgFg: 'ffffff',
  
  // File types
  msgFile1Bg: '5eb6f2',
  msgFile1BgDark: '5aa9e1',
  msgFile1BgOver: '508ec8',
  msgFile1BgSelected: '4b8eb8',
  msgFile2Bg: '61b96e',
  msgFile2BgDark: '4da859',
  msgFile2BgOver: '44a050',
  msgFile2BgSelected: '46a07e',
  msgFile3Bg: 'e47272',
  msgFile3BgDark: 'cd5b5e',
  msgFile3BgOver: 'c35154',
  msgFile3BgSelected: 'c75f74',
  msgFile4Bg: 'efc274',
  msgFile4BgDark: 'e6a561',
  msgFile4BgOver: 'dc9c5a',
  msgFile4BgSelected: 'e6bf83',
  
  // Voice waveform
  msgWaveformInActive: '68b8f6',
  msgWaveformInInactive: '2b5278',
  msgWaveformOutActive: '81d3f1',
  msgWaveformOutInactive: '376c99',
  
  // Compose area
  historyComposeAreaBg: '17212b',
  historyComposeAreaFg: 'e9e9e9',
  historyComposeAreaFgService: '708499',
  historyComposeIconFg: '6b8eae',
  historyComposeIconFgOver: '89bde3',
  historySendIconFg: '6eb2e4',
  historySendIconFgOver: '89bde3',
  historyPinnedBg: '202b36',
  historyReplyBg: '202b36',
  historyReplyIconFg: '6eb2e4',
  historyReplyCancelFg: '6b8eae',
  historyReplyCancelFgOver: '89bde3',
  
  // Scroll to bottom
  historyToDownBg: '17212b',
  historyToDownBgOver: '202b36',
  historyToDownBgRipple: '1c2731',
  historyToDownFg: '6eb2e4',
  historyToDownFgOver: '6eb2e4',
  historyToDownShadow: '00000040',
  
  // History text
  historyTextInFg: 'e9e9e9',
  historyTextInFgSelected: 'e9e9e9',
  historyTextOutFg: 'e9e9e9',
  historyTextOutFgSelected: 'e9e9e9',
  historyLinkInFg: '58b6ed',
  historyLinkInFgSelected: '58b6ed',
  historyLinkOutFg: '6eb2e4',
  historyLinkOutFgSelected: '6eb2e4',
  
  // Read markers
  historyOutIconFg: '6cc26b',
  historyOutIconFgSelected: '6cc26b',
  historyIconFgInverted: 'ffffffc8',
  
  // Profile
  topBarBg: '17212b',
  profileBg: '17212b',
  profileOtherAdminStarFg: 'ffa60d',
  profileVerifiedCheckBg: '5288c1',
  profileVerifiedCheckFg: '17212b',
  profileAdminStartFg: 'ffa60d',
  
  // Emoji panel
  emojiPanBg: '17212b',
  emojiPanCategories: '17212b',
  emojiPanHeaderBg: '17212b',
  emojiPanHeaderFg: '708499',
  stickerPanDeleteBg: '17212bcc',
  stickerPanDeleteFg: 'e9e9e9',
  stickerPreviewBg: '17212beb',
  
  // Box/Dialog
  boxBg: '17212b',
  boxTextFg: 'e9e9e9',
  boxTextFgGood: '4ab44a',
  boxTextFgError: 'e48383',
  boxTitleFg: 'e9e9e9',
  boxSearchBg: '232f3d',
  boxTitleAdditionalFg: '708499',
  boxTitleCloseFg: '708499',
  boxTitleCloseFgOver: '8aa3bd',
  
  // Buttons
  activeButtonBg: '5288c1',
  activeButtonBgOver: '4a85bf',
  activeButtonBgRipple: '357ebd',
  activeButtonFg: 'ffffff',
  activeButtonFgOver: 'ffffff',
  activeButtonSecondaryFg: 'b9d1e7',
  activeButtonSecondaryFgOver: 'b9d1e7',
  activeLineFg: '61a5d9',
  activeLineFgError: 'e48383',
  lightButtonBg: '17212b',
  lightButtonBgOver: '232f3d',
  lightButtonBgRipple: '1c2731',
  lightButtonFg: '71bafa',
  lightButtonFgOver: '71bafa',
  cancelIconFg: '708499',
  cancelIconFgOver: '8aa3bd',
  
  // Checkbox/Slider
  checkboxFg: '4c6f92',
  sliderBgInactive: '4c6f92',
  sliderBgActive: '5288c1',
  
  // Input
  inputBorderFg: '4c6f92',
  
  // Media player
  mediaPlayerBg: '17212b',
  mediaPlayerActiveFg: '71bafa',
  mediaPlayerInactiveFg: '232f3d',
  mediaPlayerDisabledFg: '1c2731',
  mediaviewFileBg: '00000066',
  mediaviewFileNameFg: 'ffffff',
  mediaviewFileSizeFg: 'ffffffb2',
  mediaviewFileRedCornerFg: 'db5856',
  mediaviewFileYellowCornerFg: 'e8a556',
  mediaviewFileGreenCornerFg: '5fb76e',
  mediaviewFileBlueCornerFg: '49a8d8',
  mediaviewFileExtFg: 'ffffff',
  mediaviewMenuBg: '232f3d',
  mediaviewMenuBgOver: '2e3d4e',
  mediaviewMenuFg: 'e9e9e9',
  mediaviewBg: '000000eb',
  mediaviewVideoBg: '000000',
  mediaviewControlBg: '00000066',
  mediaviewControlFg: 'ffffff',
  mediaviewCaptionBg: '00000066',
  mediaviewCaptionFg: 'ffffff',
  mediaviewTextLinkFg: '90d0ff',
  mediaviewSaveMsgBg: '00000066',
  mediaviewSaveMsgFg: 'ffffff',
  mediaviewPlaybackActive: 'ffffff',
  mediaviewPlaybackInactive: '666666',
  mediaviewPlaybackActiveOver: 'ffffff',
  mediaviewPlaybackInactiveOver: 'a0a0a0',
  mediaviewPlaybackProgressFg: 'ffffffc7',
  mediaviewPlaybackIconFg: 'ffffff',
  mediaviewPlaybackIconFgOver: 'ffffff',
  mediaviewTransparentBg: 'ffffff',
  mediaviewTransparentFg: 'cccccc',
  
  // Notification
  notificationBg: '17212b',
  
  // Calls
  callBg: '26282cf2',
  callNameFg: 'ffffff',
  callFingerprintBg: 'ffffff12',
  callStatusFg: 'ffffff',
  callIconFg: 'ffffff',
  callAnswerBg: '5db961',
  callAnswerRipple: 'a5cf9b',
  callAnswerBgOuter: '5db96166',
  callHangupBg: 'd75a5a',
  callHangupRipple: 'e69898',
  callCancelBg: 'ffffff',
  callCancelFg: '777777',
  callCancelRipple: 'e9e9e9',
  callMuteRipple: 'ffffff40',
  callBarBg: '5db961',
  callBarMuteRipple: '66db70',
  callBarBgMuted: '999999',
  callBarUnmuteRipple: 'aaaaaa',
  callBarFg: 'ffffff',
  
  // Intro
  introBg: '17212b',
  introTitleFg: 'ffffff',
  introDescriptionFg: '8c9da7',
  introErrorFg: 'e35353',
  introCoverTopBg: '4b7eb3',
  introCoverBottomBg: '2c5e8c',
  introCoverIconsFg: '4a9edb',
  introCoverPlaneTrace: '3b79ab48',
  introCoverPlaneOuter: '5299cd',
  introCoverPlaneInner: 'c3d9ed',
  introCoverPlaneTop: 'ffffff',
  
  // Settings sidebar
  sideBarBg: '0e1621',
  sideBarBgActive: '2b5278',
  sideBarBgRipple: '1c2731',
  sideBarTextFg: 'e9e9e9',
  sideBarTextFgActive: 'ffffff',
  sideBarIconFg: '708499',
  sideBarIconFgActive: 'ffffff',
  sideBarBadgeBg: '5288c1',
  sideBarBadgeBgMuted: '37485c',
  sideBarBadgeFg: 'ffffff',
  
  // Placeholder
  placeholderFg: '708499',
  placeholderFgActive: '8aa3bd',
  
  // Photos
  photosPhotoFg: 'ffffff',
  photosPrimaryBg: '5288c1',
  photosIconBg: '5288c1',
  photosSelectBg: '5288c1',
  
  // Report spam
  reportSpamBg: '1d2a36',
  reportSpamFg: '8da1b2',
};
