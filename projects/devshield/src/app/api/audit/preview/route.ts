import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
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

Return your findings as a JSON array of objects with this exact structure. Every finding MUST follow this sequence: [Red Flag] -> [Safe Rewrite] -> [Justification].

[
  {
    "clauseType": "IP" | "Payment" | "Scope" | "Liability",
    "severity": "Critical" | "Warning" | "Safe",
    "originalText": "The exact snippet from the contract",
    "issue": "The [Red Flag]: Why this is a risk for a developer",
    "suggestion": "The [Safe Rewrite]: A safer, professional alternative",
    "justification": "The [Justification]: A concise explanation of why the rewrite is safer"
  }
]

If a contract is perfectly safe, return an empty array [].
`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided for preview' }, { status: 400 });
    }

    const result = await generateText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      prompt: `Perform a PREVIEW audit of this contract text. Only return the most critical findings (up to 2). \n\n${text}`,
    });

    let findings: AuditFinding[] = [];
    try {
      findings = JSON.parse(result.text);
    } catch (parseError) {
      return NextResponse.json({ error: 'AI failed to return a structured preview' }, { status: 500 });
    }

    // Limit to top 2 findings for the preview "hook"
    const previewFindings = findings.slice(0, 2);

    return NextResponse.json({
      findings: previewFindings,
      totalFound: findings.length,
      isPartial: findings.length > 2
    });
  } catch (error: any) {
    console.error('Preview Audit Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
