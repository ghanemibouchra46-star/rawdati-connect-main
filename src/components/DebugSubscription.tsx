import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, AlertCircle } from 'lucide-react';

const DebugSubscription = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    console.log('🔍 Starting database test...');
    
    try {
      // Test 1: Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 User:', { user, error: userError });
      
      if (!user) {
        setDebugInfo({ error: 'No user logged in' });
        setLoading(false);
        return;
      }

      // Test 2: Check if table exists using raw SQL
      const { data: tables, error: tableError } = await supabase
        .rpc('check_table_exists', { table_name: 'platform_subscriptions' });
      
      console.log('📊 Table exists:', { tables, error: tableError });
      
      if (tableError) {
        setDebugInfo({ error: 'Table check failed', details: tableError });
        setLoading(false);
        return;
      }
      
      if (!tables) {
        setDebugInfo({ error: 'Table platform_subscriptions does not exist' });
        setLoading(false);
        return;
      }

      // Test 3: Try simple query
      const { data: subscriptions, error: subError } = await supabase
        .from('platform_subscriptions')
        .select('count')
        .eq('user_id', user.id);
      
      console.log('📋 Subscriptions count:', { subscriptions, error: subError });
      
      if (subError) {
        setDebugInfo({ 
          error: 'Query failed', 
          details: subError,
          step: 'simple_count_query'
        });
        setLoading(false);
        return;
      }

      // Test 4: Try full query
      const { data: fullSubs, error: fullError } = await supabase
        .from('platform_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .limit(5);
      
      console.log('📄 Full subscriptions:', { fullSubs, error: fullError });

      setDebugInfo({
        success: true,
        user: { id: user.id, email: user.email },
        tableExists: true,
        subscriptionsCount: subscriptions?.[0]?.count || 0,
        subscriptions: fullSubs
      });

    } catch (err) {
      console.error('❌ Debug test failed:', err);
      setDebugInfo({ error: 'Unexpected error', details: err });
    } finally {
      setLoading(false);
    }
  };

  const createTestSubscription = async () => {
    setLoading(true);
    console.log('🧪 Creating test subscription...');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please login first');
        setLoading(false);
        return;
      }

      const testSubscription = {
        id: crypto.randomUUID(),
        user_id: user.id,
        plan_type: 'monthly' as const,
        price: 2999,
        status: 'pending' as const,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: 'ccp',
        payment_proof_url: null,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('platform_subscriptions')
        .insert(testSubscription)
        .select()
        .single();
      
      console.log('📝 Insert result:', { data, error });
      
      if (error) {
        setDebugInfo({ error: 'Insert failed', details: error });
      } else {
        setDebugInfo({ success: true, message: 'Test subscription created successfully!', data });
        alert('✅ Test subscription created! Check the database.');
      }

    } catch (err) {
      console.error('❌ Create test failed:', err);
      setDebugInfo({ error: 'Create failed', details: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Debug Subscription System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDatabase} disabled={loading}>
                {loading ? 'Testing...' : 'Test Database'}
              </Button>
              <Button onClick={createTestSubscription} disabled={loading} variant="outline">
                {loading ? 'Creating...' : 'Create Test Subscription'}
              </Button>
            </div>
            
            {debugInfo && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  debugInfo.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {debugInfo.success ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h3 className={`font-bold ${
                      debugInfo.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {debugInfo.success ? 'Success' : 'Error'}
                    </h3>
                  </div>
                  
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugSubscription;
