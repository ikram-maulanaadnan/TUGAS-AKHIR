import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function TestDataButton() {
  const handleTestData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
      });
      
      if (response.ok) {
        console.log('Test data generated successfully');
      } else {
        console.error('Failed to generate test data');
      }
    } catch (error) {
      console.error('Error generating test data:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleTestData}
      className="flex items-center space-x-2"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Generate Test Data</span>
    </Button>
  );
}
