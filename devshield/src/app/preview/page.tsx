'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Lock, ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuditFinding } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function PreviewAuditPage() {
  const [findings, setFindings] = useState<AuditFinding[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ totalFound: 0, isPartial: false });
  const router = useRouter();

  useEffect(() => {
    const auditText = localStorage.getItem('pendingAuditText');

    const performPreview = async () => {
      try {
        if (!auditText) {
          setError('No contract text found. Please upload a file first.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/audit/preview', {
          method: 'POST',
          body: JSON.stringify({ text: auditText }),
        });

        if (!response.ok) throw new Error('Preview audit failed');
        const data = await response.json();
        setFindings(data.findings);
        setMeta({ totalFound: data.totalFound, isPartial: data.isPartial });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    performPreview();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Preview Report</h1>
              <p className="text-slate-400">Initial Risk Scan</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/upload'} className="gap-2">
            New Upload
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Scanning for Red Flags...</h3>
              <p className="text-slate-400 max-w-xs mx-auto italic">"Identifying high-risk clauses in your contract..."</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Preview Failed</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button variant="danger" size="lg" onClick={() => window.location.href = '/upload'}>
              Return to Upload
            </Button>
          </div>
        )}

        {!loading && !error && findings && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center mb-12">
              <p className="text-blue-400 font-medium mb-2">Quick Scan Complete</p>
              <h2 className="text-2xl font-bold text-white mb-4">
                We found {meta.totalFound} potential risks in your contract.
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You're seeing the top {findings.length} most critical flags. Create an account to unlock the full detailed report and safe rewrites.
              </p>
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
                  </div>

                  <div className="mt-8 p-6 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex items-start gap-4">
                      <Lock className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-white mb-1">Safe Rewrite Locked</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Create an account to get a professional, legally-sound rewrite of this clause.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {findings.length === 0 && (
                <div className="text-center py-24 bg-slate-900 rounded-3xl border border-slate-800">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No critical risks found!</h3>
                  <p className="text-slate-400">Your contract looks remarkably clean. Create an account to save this report.</p>
                </div>
              )}
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-center text-white shadow-2xl shadow-blue-500/20">
              <h3 className="text-3xl font-bold mb-4">Protect Your Business Fully</h3>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
                Stop guessing. Unlock your full report, including safe rewrites and detailed justifications for every risk found.
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/signup')}
                className="gap-2 text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 font-bold"
              >
                Get Full Report Now <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
