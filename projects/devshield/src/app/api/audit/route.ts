import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { AuditFinding } from '@/types';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are the Lead Counsel for the Freelance Developers Union. Your sole goal is to find every loophole, trap, and unfair clause in this contract that could lead to scope creep, non-payment, or loss of IP. Do not be polite. Be critical.

Focus on these 4 High-Risk Zones:
1. IP Ownership: Does the client take the code before final payment? Is there an exploitative "Work for Hire" clause?
2. Scope & Revisions: Are "Unlimited Revisions" mentioned? Is the "Change Request" process undefined?
3. Payment & Milestones: Are payments tied to "Client Satisfaction" (subjective) or "Technical Delivery" (objective)? Is there a late fee?
4. Liability & Warranties: Is the developer personally liable for "consequential damages"?

Return your findings as a JSON array of objects with this exact structure:
[
  {
    "clauseType": "IP" | "Payment" | "Scope" | "Liability",
    "severity": "Critical" | "Warning" | "Safe",
    "originalText": "The exact snippet from the contract",
    "issue": "Why this is a risk for a developer",
    "suggestion": "A safer, professional rewrite"
  }
]

If a contract is perfectly safe, return an empty array [].
`;

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided for audit' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 1. Perform the AI Audit
    const result = await generateText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      prompt: `Audit this contract text: \n\n${text}`,
    });

    let findings: AuditFinding[] = [];
    try {
      findings = JSON.parse(result.text);
    } catch (parseError) {
      return NextResponse.json({ error: 'AI failed to return a structured report' }, { status: 500 });
    }

    // 2. Save the Contract to Supabase
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert({
        user_id: userId,
        risk_score: findings.length > 5 ? 80 : findings.length > 2 ? 50 : 20,
        // Note: file_url and file_name would be passed from the upload step in a full impl
      })
      .select()
      .single();

    if (contractError) {
      console.error('DB Error (Contract):', contractError);
      throw new Error('Failed to save contract to database');
    }

    // 3. Save the individual findings
    if (findings.length > 0) {
      const findingsToInsert = findings.map(f => ({
        contract_id: contract.id,
        clause_type: f.clauseType,
        severity: f.severity,
        original_text: f.originalText,
        issue: f.issue,
        suggestion: f.suggestion,
      }));

      const { error: findingsError } = await supabaseAdmin
        .from('audit_findings')
        .insert(findingsToInsert);

      if (findingsError) {
        console.error('DB Error (Findings):', findingsError);
        throw new Error('Failed to save findings to database');
      }
    }

    return NextResponse.json({
      contractId: contract.id,
      findings
    });
  } catch (error: any) {
    console.error('Audit Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
