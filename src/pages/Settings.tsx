
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSaveProfile = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-serif text-legacy-mahogany mb-8 text-center">Account Settings</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <Card className="bg-white border-legacy-sepia">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-legacy-mahogany">Profile Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
                className="bg-legacy-sepia/10"
              />
              <p className="text-xs text-legacy-ink/70">
                Your email cannot be changed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                className="resize-none h-20"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile} 
              className="ml-auto bg-legacy-copper hover:bg-legacy-mahogany"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-white border-legacy-sepia">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-legacy-mahogany">Notification Settings</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-legacy-ink/70">
                  Receive notifications about new contributions
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                toast({
                  title: 'Notification settings saved',
                  description: 'Your notification preferences have been updated',
                });
              }}
              variant="outline" 
              className="ml-auto border-legacy-copper text-legacy-copper hover:bg-legacy-copper/10"
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
