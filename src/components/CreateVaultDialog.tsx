
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createVault } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface CreateVaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVaultCreated: () => void;
}

export function CreateVaultDialog({ 
  open, 
  onOpenChange,
  onVaultCreated 
}: CreateVaultDialogProps) {
  const [vaultName, setVaultName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateVault = async () => {
    if (!vaultName.trim()) {
      toast({
        title: 'Vault name required',
        description: 'Please enter a name for your vault',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be signed in to create a vault',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await createVault(vaultName, user.id, ['sepia']);
      toast({
        title: 'Vault created',
        description: `"${vaultName}" has been created successfully`,
      });
      setVaultName('');
      onOpenChange(false);
      onVaultCreated();
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: 'Vault creation failed',
        description: 'An error occurred while creating your vault',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-legacy-cream border-legacy-sepia">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-legacy-mahogany">Create New Vault</DialogTitle>
          <DialogDescription className="text-legacy-ink/70">
            Give your memory vault a meaningful name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-legacy-ink">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Family Stories"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              className="col-span-3 bg-white border-legacy-sepia"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleCreateVault} 
            disabled={isLoading}
            className="bg-legacy-copper hover:bg-legacy-mahogany"
          >
            {isLoading ? 'Creating...' : 'Create Vault'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
