import { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Kindergarten } from '@/data/kindergartens';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  kindergarten: Kindergarten;
  onSuccess?: () => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  kindergarten,
  onSuccess
}: PaymentModalProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          kindergarten_id: kindergarten.id,
          amount: kindergarten.price || 0,
          status: 'completed',
          payment_method: 'card',
          transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment successful!');
      onSuccess?.();
      onClose();
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(language === 'ar' ? 'فشل في معالجة الدفع' : 'Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {language === 'ar' ? 'معالجة الدفع' : 'Payment Processing'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{kindergarten.name}</h3>
            <p className="text-2xl font-bold text-green-600">{kindergarten.price || 0} MAD</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardHolderName">
                {language === 'ar' ? 'اسم صاحب البطاقة' : 'Card Holder Name'}
              </Label>
              <Input
                id="cardHolderName"
                value={formData.cardHolderName}
                onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">
                {language === 'ar' ? 'رقم البطاقة' : 'Card Number'}
              </Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">
                  {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                </Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cvv">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'ادفع الآن' : 'Pay Now'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;