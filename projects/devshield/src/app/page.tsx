import Link from 'next/link';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">DevShield</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            <span>Now optimized for AI & Data Science contracts</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Stop signing your <span className="text-blue-500">rights away.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The first AI-powered contract auditor built specifically for developers.
            Detect scope creep, IP traps, and payment risks before you sign.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/upload" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Audit My Contract <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/audit" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Sample Audit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The "Wall of Fear" / Pain Points */}
      <section className="px-6 py-24 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Common Developer Traps</h2>
            <p className="text-slate-400">We find the loopholes that cost you thousands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "The Scope Trap",
                desc: "Undefined 'out-of-scope' work leading to infinite free features.",
                icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
                color: "border-yellow-500/20 bg-yellow-500/5"
              },
              {
                title: "The IP Trap",
                desc: "Ownership transfers before final payment is received.",
                icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                color: "border-red-500/20 bg-red-500/5"
              },
              {
                title: "The Payment Trap",
                desc: "Payments tied to 'Client Satisfaction' instead of technical delivery.",
                icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                color: "border-orange-500/20 bg-orange-500/5"
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-2xl border ${item.color} transition-all hover:scale-[1.02]`}>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Audit your contracts <br />
                <span className="text-blue-500">in seconds, not days.</span>
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Secure Upload",
                    desc: "Drag and drop your PDF or Docx. Your data is encrypted and private.",
                    icon: <FileText className="w-5 h-5" />
                  },
                  {
                    title: "AI-Powered Analysis",
                    desc: "Our legal-tech engine scans for 50+ known developer traps.",
                    icon: <ShieldCheck className="w-5 h-5" />
                  },
                  {
                    title: "Risk Report",
                    desc: "Get a clear Risk Score and a list of exactly what to change.",
                    icon: <CheckCircle2 className="w-5 h-5" />
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-900/50 transition-colors group">
                    <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                      <p className="text-slate-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl flex items-center justify-center overflow-hidden group">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-slate-800 rounded-full mx-auto animate-pulse" />
                    <div className="h-3 w-24 bg-slate-800 rounded-full mx-auto animate-pulse delay-75" />
                    <div className="h-3 w-28 bg-slate-800 rounded-full mx-auto animate-pulse delay-150" />
                  </div>
                  <p className="text-slate-500 text-sm font-mono mt-8">await devshield.audit(contract);</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2026 DevShield. Built for the developer community.</p>
      </footer>
    </div>
  );
}
