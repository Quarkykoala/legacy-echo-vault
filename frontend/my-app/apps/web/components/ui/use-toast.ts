interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export interface ToastApi {
  toast: (props: ToastProps) => void;
}

export const useToast = (): ToastApi => {
  return {
    toast: () => {}
  };
}; 