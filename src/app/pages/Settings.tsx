import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useTheme } from 'next-themes';
import { useBubbles } from '@/app/contexts/BubblesContext';
import { useNavigate } from 'react-router';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Type,
  Sun,
  Moon,
  HelpCircle,
  Mail,
  LogOut,
  Sparkles
} from 'lucide-react';
import { mockUser } from '@/app/data/mockData';
import { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';

export function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isFloatingBubbleEnabled, setFloatingBubbleEnabled } = useBubbles();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    budgetAlerts: true,
    learningReminders: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showToggleFeedback, setShowToggleFeedback] = useState(false);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleFloatingBubbleToggle = (checked: boolean) => {
    setFloatingBubbleEnabled(checked);
    setShowToggleFeedback(true);
    setTimeout(() => setShowToggleFeedback(false), 3000);
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        <Separator />
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Name</Label>
            <p className="text-base mt-1">{mockUser.name}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-base mt-1">{mockUser.email}</p>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
          {isEditing && (
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>
        <Separator />
        
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          {/* Text Size */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Text Size</Label>
              <p className="text-sm text-muted-foreground">Adjust for comfortable reading</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Type className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Type className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Type className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select defaultValue="english" disabled={false} onValueChange={() => {}}>
              <SelectTrigger className="w-[180px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="afrikaans">Afrikaans</SelectItem>
                <SelectItem value="zulu">Zulu</SelectItem>
                <SelectItem value="xhosa">Xhosa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* AI & Assistance */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold text-lg">AI & Assistance</h3>
        </div>
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1 pr-4">
              <Label>Floating Bubbles Assistant</Label>
              <p className="text-sm text-muted-foreground">
                Show or hide the floating Bubbles assistant across the app. You can still access Bubbles from the Bubbles page.
              </p>
              {showToggleFeedback && (
                <p className="text-sm text-primary mt-1">
                  You can turn this back on anytime.
                </p>
              )}
            </div>
            <Switch 
              checked={isFloatingBubbleEnabled}
              onCheckedChange={handleFloatingBubbleToggle}
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications on this device</p>
            </div>
            <Switch 
              checked={notifications.push}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, push: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Get updates via email</p>
            </div>
            <Switch 
              checked={notifications.email}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, email: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">Notify when approaching budget limits</p>
            </div>
            <Switch 
              checked={notifications.budgetAlerts}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, budgetAlerts: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Learning Reminders</Label>
              <p className="text-sm text-muted-foreground">Gentle nudges to continue learning</p>
            </div>
            <Switch 
              checked={notifications.learningReminders}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, learningReminders: checked})
              }
            />
          </div>
        </div>
      </Card>

      {/* Security & Privacy */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h3 className="font-bold text-lg">Security & Privacy</h3>
        </div>
        <Separator />
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Manage Connected Accounts
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download My Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/privacy-policy', { state: { from: 'settings' } })}
          >
            Privacy Policy
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/terms-of-service', { state: { from: 'settings' } })}
          >
            Terms of Service
          </Button>
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <h3 className="font-bold text-lg">Help & Support</h3>
        </div>
        <Separator />
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/help-center')}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help Center & Tutorials
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/contact')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            About PAKO
          </Button>
        </div>
      </Card>

      {/* Sign Out */}
      <Card className="p-6">
        <Button variant="destructive" className="w-full" onClick={() => navigate('/logout')}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </Card>

      {/* Branding Footer */}
      <div className="flex flex-col items-center text-center py-6 space-y-4">
        <Logo size="lg" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">PAKO v1.0.0</p>
          <p className="italic">Blow bubbles, not your budget</p>
          <p>Making financial wellness accessible to all</p>
        </div>
      </div>
    </div>
  );
}