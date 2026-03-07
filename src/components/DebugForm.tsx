import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebugForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Debug Form</h2>
      
      <Button 
        onClick={() => {
          console.log('Debug button clicked');
          setIsOpen(true);
        }}
        className="mb-4"
      >
        {isOpen ? 'Hide Form' : 'Show Form'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Test Form Works!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم الأول</label>
                  <input type="text" className="w-full border rounded p-2" placeholder="أحمد" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اللقب</label>
                  <input type="text" className="w-full border rounded p-2" placeholder="محمد" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الاشتراك</label>
                  <select className="w-full border rounded p-2">
                    <option value="monthly">شهري - 2,999 دج</option>
                    <option value="yearly">سنوي - 29,990 دج</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الحساب CCP</label>
                  <input type="text" className="w-full border rounded p-2" value="007 99999 99 000000 00" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رفع الوصل</label>
                  <input type="file" className="w-full border rounded p-2" accept="image/*" />
                </div>
              </div>
              <Button onClick={() => setIsOpen(false)} className="w-full mt-4">
                إغلاق
              </Button>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugForm;
