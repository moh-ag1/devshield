'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, Plus, LogOut, LayoutDashboard, History, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Contract } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setContracts(data || []);
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <aside className="w-64 border-r border-slate-900 bg-slate-950 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold text-white">DevShield</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
            <History className="w-4 h-4" /> Audit History
          </Button>
        </nav>

        <div className="pt-6 border-t border-slate-900">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-slate-500 hover:text-red-400" size="sm">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Welcome, {user.email?.split('@')[0]}</h1>
              <p className="text-slate-400">Manage your contract audits and risk reports.</p>
            </div>
            <Button onClick={() => router.push('/upload')} size="lg" className="gap-2">
              <Plus className="w-4 h-4" /> New Audit
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Audits', value: contracts.length, icon: <FileText className="w-5 h-5" /> },
              { label: 'Risk-Heavy', value: contracts.filter(c => c.riskScore > 50).length, icon: <ShieldCheck className="w-5 h-5 text-red-500" /> },
              { label: 'Safe Contracts', value: contracts.filter(c => c.riskScore <= 50).length, icon: <ShieldCheck className="w-5 h-5 text-green-500" /> },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-blue-500">{stat.icon}</div>
                  <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-bold text-white">Recent Audits</h3>
              <Button variant="ghost" size="sm" className="text-blue-500">View All</Button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading your audits...</div>
            ) : contracts.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-slate-500">No audits yet. Protect your first contract!</p>
                <Button onClick={() => router.push('/upload')} size="sm">Start First Audit</Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-4 flex items-center justify-between hover:bg-slate-900/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{contract.fileName || 'Untitled Contract'}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-widest",
                        contract.riskScore > 70 ? "bg-red-500/20 text-red-500" :
                        contract.riskScore > 40 ? "bg-yellow-500/20 text-yellow-500" :
                        "bg-green-500/20 text-green-500"
                      )}>
                        {contract.riskScore > 70 ? 'High Risk' : contract.riskScore > 40 ? 'Moderate' : 'Safe'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/audit/${contract.id}`)}
                        className="gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
