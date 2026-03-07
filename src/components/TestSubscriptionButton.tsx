import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

const TestSubscriptionButton = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4">
      <Button 
        onClick={() => {
          console.log('Test button clicked');
          setShowForm(true);
        }}
        className="bg-blue-500 text-white"
      >
        <Crown className="w-4 h-4 mr-2" />
        Test Subscription Form
      </Button>
      
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Test Form</h2>
            <p>إذا هاد يبان، فالمشكلة ما فالـ hook</p>
            <Button 
              onClick={() => setShowForm(false)}
              className="mt-4 w-full"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSubscriptionButton;
