'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Please upload a PDF or DOCX file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from document');
      }

      const data = await response.json();
      setExtractedText(data.text);
      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleProceedToAudit = async () => {
    if (!extractedText) return;

    // In a production app, we'd save the text to a DB and pass an ID
    // For the POC, we'll pass the text via a query param or local storage
    localStorage.setItem('pendingAuditText', extractedText);
    router.push('/audit');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Upload Your Contract</h1>
          <p className="text-slate-400">Our AI will scan for developer traps and IP risks.</p>
        </div>

        <div className={cn(
          "relative p-12 rounded-3xl border-2 border-dashed transition-all duration-300 text-center",
          status === 'idle' && !file ? "border-slate-800 bg-slate-900/50 hover:border-blue-500/50" : "border-blue-500/50 bg-blue-500/5"
        )}>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.docx"
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-slate-800 text-blue-500 group-hover:scale-110 transition-transform">
              {status === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            </div>

            {file ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {file.name}
                </div>
                <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-white font-medium">Click or drag to upload</p>
                <p className="text-slate-500 text-sm">PDF or DOCX (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {status === 'idle' && file && (
            <Button onClick={handleUpload} size="lg" className="gap-2">
              Start Extraction <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {status === 'uploading' || status === 'extracting' ? (
            <Button disabled size="lg" className="gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </Button>
          ) : null}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Text extracted successfully!</span>
              </div>
              <Button onClick={handleProceedToAudit} size="lg" className="bg-green-600 hover:bg-green-700">
                Proceed to Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {extractedText && (
          <div className="mt-12 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Extracted Text Preview</h3>
            <div className="text-xs font-mono text-slate-500 h-48 overflow-y-auto p-4 bg-slate-950 rounded-lg border border-slate-800 whitespace-pre-wrap">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
