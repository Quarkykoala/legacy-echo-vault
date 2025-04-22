import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateUserProfile } from '@/services/api';
import { User, userSchema } from '@/lib/types';

const profileFormSchema = userSchema.pick({
  name: true,
  email: true,
  avatar_url: true,
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await updateUserProfile(user.id, data);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Profile updated successfully');
      onSuccess?.();
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          type="url"
          {...register('avatar_url')}
          aria-invalid={!!errors.avatar_url}
          aria-describedby={errors.avatar_url ? 'avatar-error' : undefined}
        />
        {errors.avatar_url && (
          <p id="avatar-error" className="text-sm text-red-500">
            {errors.avatar_url.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
} 