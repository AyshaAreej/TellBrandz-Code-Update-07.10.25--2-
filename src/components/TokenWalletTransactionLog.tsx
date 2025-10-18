import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export function TokenWalletTransactionLog({ brandId }: { brandId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, [brandId]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(50);

    setTransactions(data || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {tx.amount > 0 ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={tx.amount > 0 ? 'default' : 'secondary'}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} Tokens
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
