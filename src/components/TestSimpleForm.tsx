import { useState } from 'react';
import { Button } from '@/components/ui/button';

const TestSimpleForm = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Test Simple Form</h2>
      
      <Button 
        onClick={() => {
          console.log('Test button clicked');
          setShowForm(!showForm);
        }}
        className="mb-4"
      >
        {showForm ? 'Hide Form' : 'Show Form'}
      </Button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Test Form Works!</h3>
            <p>إذا هاد يبان، فالمشكلة في SimpleSubscriptionForm</p>
            <Button onClick={() => setShowForm(false)} className="w-full">
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSimpleForm;
