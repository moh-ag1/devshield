'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuditFinding } from '@/types';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuditResultPage() {
  const [findings, setFindings] = useState<AuditFinding[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const auditText = localStorage.getItem('pendingAuditText');

    const performAudit = async () => {
      try {
        // 1. Check Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        if (!auditText) {
          setError('No contract text found. Please upload a file first.');
          setLoading(false);
          return;
        }

        // 2. Call Audit API with userId
        const response = await fetch('/api/audit', {
          method: 'POST',
          body: JSON.stringify({
            text: auditText,
            userId: user.id
          }),
        });

        if (!response.ok) throw new Error('Audit failed');
        const data = await response.json();
        setFindings(data.findings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    performAudit();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Audit Report</h1>
              <p className="text-slate-400">Developer Risk Analysis</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/upload'} className="gap-2">
            <RotateCcw className="w-4 h-4" /> New Upload
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Hunting for Traps...</h3>
              <p className="text-slate-400 max-w-xs mx-auto italic">"Checking IP ownership clauses and scope creep indicators..."</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Audit Failed</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button variant="danger" size="lg" onClick={() => window.location.href = '/upload'}>
              Return to Upload
            </Button>
          </div>
        )}

        {!loading && !error && findings && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center items-center text-center">
                <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Risk Level</p>
                <p className={cn(
                  "text-4xl font-black",
                  findings.length > 5 ? "text-red-500" : findings.length > 2 ? "text-yellow-500" : "text-green-500"
                )}>
                  {findings.length > 5 ? 'CRITICAL' : findings.length > 2 ? 'MODERATE' : 'LOW'}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center items-center text-center">
                <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Issues Found</p>
                <p className="text-4xl font-black text-white">{findings.length}</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center items-center text-center">
                <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Critical Flags</p>
                <p className="text-4xl font-black text-red-500">
                  {findings.filter(f => f.severity === 'Critical').length}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {findings.map((finding, i) => (
                <div key={i} className="group p-6 rounded-3xl bg-slate-900 border border-slate-800 transition-all hover:border-blue-500/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        finding.severity === 'Critical' ? "bg-red-500/10 text-red-500" :
                        finding.severity === 'Warning' ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {finding.severity === 'Safe' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <span className="text-lg font-bold text-white">{finding.clauseType} Risk</span>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                      finding.severity === 'Critical' ? "bg-red-500/20 text-red-500" :
                      finding.severity === 'Warning' ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-green-500/20 text-green-500"
                    )}>
                      {finding.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Original Clause</p>
                      <p className="text-sm text-slate-300 italic leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                        "{finding.originalText}"
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">The Risk</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {finding.issue}
                      </p>
                    </div>
                  </div >

                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Proposed Safe Rewrite</p>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        Copy Rewrite
                      </Button>
                    </div>
                    <p className="text-sm text-slate-200 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 italic leading-relaxed">
                      {finding.suggestion}
                    </p>
                  </div >
                </div>
              ))}

              {findings.length === 0 && (
                <div className="text-center py-24 bg-slate-900 rounded-3xl border border-slate-800">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Your contract is safe!</h3>
                  <p className="text-slate-400">No critical developer traps were found in this document.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
