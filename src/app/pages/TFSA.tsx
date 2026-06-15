import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function TFSA() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Back Button */}
      <div className="px-4 py-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/investments')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clinic
        </Button>
      </div>

      {/* Centered Coming Soon Message */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Coming Soon</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working on bringing you Tax-Free Savings Account options. 
            Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}