import { Outlet, Link, useLocation } from 'react-router';
import { Home, BookOpen, Wallet, Gift, Settings, Heart, LogOut, Lock, FileText, Copy, ChevronRight, Target, Bell } from 'lucide-react';
import { mockUser } from '@/app/data/mockData';
import { useUser } from '@/app/contexts/UserContext';
import { Logo } from '@/app/components/Logo';
import { FloatingBubbles } from '@/app/components/FloatingBubbles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useState } from 'react';
import { useInactivityLogout } from '@/app/hooks/useInactivityLogout';

// Notification type
interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon?: 'reward' | 'finance' | 'learning' | 'goal' | 'system';
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'You earned 50 points for completing the "Budgeting Basics" module!',
    timestamp: '2 hours ago',
    isRead: false,
    icon: 'reward'
  },
  {
    id: '2',
    message: 'Your water bill is due in 3 days. Don\'t forget to pay R350.',
    timestamp: '5 hours ago',
    isRead: false,
    icon: 'finance'
  },
  {
    id: '3',
    message: 'New learning module available: Understanding Credit Scores',
    timestamp: '1 day ago',
    isRead: false,
    icon: 'learning'
  },
  {
    id: '4',
    message: 'Great job! You\'re 75% towards your "Emergency Fund" goal.',
    timestamp: '1 day ago',
    isRead: true,
    icon: 'goal'
  },
  {
    id: '5',
    message: 'Your monthly budget reset. You have R15,000 available this month.',
    timestamp: '2 days ago',
    isRead: true,
    icon: 'finance'
  },
  {
    id: '6',
    message: 'You\'ve been awarded the "Savings Champion" badge!',
    timestamp: '3 days ago',
    isRead: true,
    icon: 'reward'
  },
  {
    id: '7',
    message: 'Reminder: Review your spending categories to stay on track.',
    timestamp: '4 days ago',
    isRead: true,
    icon: 'system'
  },
  {
    id: '8',
    message: 'Your credit score improved by 15 points this month!',
    timestamp: '5 days ago',
    isRead: true,
    icon: 'finance'
  },
];

export function AppLayout() {
  const location = useLocation();
  const { user } = useUser();
  const [copiedId, setCopiedId] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Initialize inactivity logout tracking (10-minute rule)
  useInactivityLogout();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Get user display name and initials
  const displayName = user ? `${user.firstName} ${user.surname}` : mockUser.name;
  const initials = user 
    ? `${user.firstName.charAt(0)}${user.surname.charAt(0)}`.toUpperCase()
    : mockUser.name.substring(0, 2).toUpperCase();
  
  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/finances', label: 'Finances', icon: Wallet },
    { path: '/learning', label: 'Learning', icon: BookOpen },
    { path: '/investments', label: 'Clinic', icon: Heart },
    { path: '/goals-and-todos', label: 'Goals', icon: Target },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Desktop navigation items (excluding Settings)
  const desktopNavItems = navItems.filter(item => item.path !== '/settings');
  
  const handleCopyId = () => {
    // Try modern clipboard API first, fallback to older method
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mockUser.pakoId)
        .then(() => {
          setCopiedId(true);
          setTimeout(() => setCopiedId(false), 2000);
        })
        .catch(() => {
          // Fallback method for when clipboard API is blocked
          fallbackCopyTextToClipboard(mockUser.pakoId);
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      fallbackCopyTextToClipboard(mockUser.pakoId);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
    } catch (err) {
      console.log('Fallback: Unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const handleLogout = () => {
    // Simulate logout - in real app would clear auth tokens, etc.
    // Navigate to landing page
    window.location.href = '/';
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  // Get icon for notification
  const getNotificationIcon = (iconType?: string) => {
    switch (iconType) {
      case 'reward':
        return <Gift className="h-4 w-4 text-[#FFD60A]" />;
      case 'finance':
        return <Wallet className="h-4 w-4 text-[#A855F7]" />;
      case 'learning':
        return <BookOpen className="h-4 w-4 text-[#4361EE]" />;
      case 'goal':
        return <Target className="h-4 w-4 text-[#5F0F40]" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Logo size="md" />
          </div>

          {/* Center-Left: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative flex items-center justify-center"
                >
                  {/* Icon Container with shift animation */}
                  <div className={`flex items-center gap-0 transition-all duration-500 ease-out ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  } group-hover:-translate-x-1`}>
                    {/* Icon background */}
                    <div className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-500 ${
                      isActive 
                        ? 'bg-primary/10' 
                        : 'group-hover:bg-muted'
                    }`}>
                      <Icon className="h-5 w-5 transition-colors duration-500 group-hover:text-foreground" />
                    </div>
                    
                    {/* Expanding text label */}
                    <span className={`
                      overflow-hidden whitespace-nowrap text-sm font-medium
                      transition-all duration-500 ease-out
                      max-w-0 opacity-0
                      group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2
                      ${isActive ? 'text-primary' : 'group-hover:text-foreground'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Right: Notifications + Profile Header */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with Hover Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsNotificationPanelOpen(true)}
              onMouseLeave={() => setIsNotificationPanelOpen(false)}
            >
              {/* Bell Icon Button */}
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {/* Unread Badge */}
                {unreadCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Notification Panel - Hover Dropdown */}
              {isNotificationPanelOpen && (
                <div className="absolute right-0 top-full mt-2 w-[380px] bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Fixed Header */}
                  <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Scrollable Notification List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      /* Empty State */
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Bell className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-center">You're all caught up!</p>
                        <p className="text-xs text-muted-foreground text-center mt-1">No new notifications</p>
                      </div>
                    ) : (
                      /* Notification Items */
                      <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                              !notification.isRead 
                                ? 'bg-primary/5 hover:bg-primary/10' 
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            {/* Unread Indicator Dot */}
                            <div className="flex-shrink-0 mt-1">
                              {!notification.isRead ? (
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                              ) : (
                                <div className="h-2 w-2" /> /* Spacer for alignment */
                              )}
                            </div>

                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                {getNotificationIcon(notification.icon)}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-relaxed ${
                                !notification.isRead ? 'font-medium' : 'text-muted-foreground'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {initials}
                  </div>
                  <div className="hidden md:block text-left">
                    <h2 className="text-sm font-bold">{displayName}</h2>
                    <p className="text-xs text-muted-foreground">{mockUser.points.toLocaleString()} points</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[340px]">
                {/* Profile Header Section - Clickable */}
                <div 
                  onClick={() => window.location.href = '/profile'} 
                  className="cursor-pointer p-4 space-y-3 hover:bg-primary/10 transition-colors rounded-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base">{displayName}</h3>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">
                          My Profile
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Username and PAKO ID */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">USERNAME</p>
                      <p className="text-sm font-medium">{mockUser.username}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">PAKO ID</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId();
                        }}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                      >
                        <span>{mockUser.pakoId}</span>
                        <Copy className={`h-3 w-3 ${copiedId ? 'text-green-500' : ''}`} />
                      </button>
                      {copiedId && (
                        <p className="text-xs text-green-500 mt-0.5">Copied!</p>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Security & Legal */}
                <DropdownMenuItem onClick={() => window.location.href = '/privacy-policy'} className="cursor-pointer py-3 hover:bg-[#2F7F7A] hover:text-white focus:bg-[#2F7F7A] focus:text-white data-[highlighted]:bg-[#2F7F7A] data-[highlighted]:text-white group">
                  <FileText className="mr-3 h-4 w-4 group-hover:text-white group-focus:text-white" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => window.location.href = '/terms-of-service'} className="cursor-pointer py-3 hover:bg-[#2F7F7A] hover:text-white focus:bg-[#2F7F7A] focus:text-white data-[highlighted]:bg-[#2F7F7A] data-[highlighted]:text-white group">
                  <FileText className="mr-3 h-4 w-4 group-hover:text-white group-focus:text-white" />
                  <span>Terms of Service</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer py-3 hover:bg-[#2F7F7A] hover:text-white focus:bg-[#2F7F7A] focus:text-white data-[highlighted]:bg-[#2F7F7A] data-[highlighted]:text-white group">
                  <Settings className="mr-3 h-4 w-4 group-hover:text-white group-focus:text-white" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem onClick={() => setShowLogoutConfirm(true)} className="cursor-pointer py-3 text-red-600 hover:bg-red-600 hover:text-white focus:text-white group">
                  <LogOut className="mr-3 h-4 w-4 text-red-600 group-hover:text-white" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          {/* Mobile nav: Show 5 core items - Home, Finances, Learning, Clinic, Settings */}
          {[
            navItems[0], // Home
            navItems[1], // Finances
            navItems[2], // Learning
            navItems[3], // Clinic (Investments)
            navItems[6], // Settings
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Bubbles Button */}
      <FloatingBubbles />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg shadow-xl max-w-xs w-full mx-4 p-5 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm text-center mb-4 dark:text-white">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm dark:text-white"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}