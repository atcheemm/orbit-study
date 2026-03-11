import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const AEROSPACE_SYSTEM_PROMPT = `You are OrbitStudy AI, an expert aerospace engineering tutor helping college students with ADHD master complex concepts.

Your teaching style:
- Break everything into clear, numbered steps
- Use concrete examples with real aerospace applications
- Keep explanations concise but complete
- Use LaTeX for all mathematical expressions (inline: $...$, block: $$...$$)
- Encourage and motivate students
- Flag key formulas with 📐 and key concepts with 🎯
- Keep each step focused on ONE idea

Aerospace topics you excel at:
- Fluid mechanics and aerodynamics
- Thermodynamics and propulsion
- Orbital mechanics and astrodynamics
- Structural analysis and materials
- Flight dynamics and controls
- Avionics and systems engineering`;

export async function stepByStepSolver(
  problem: string,
  context: string = ''
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = AEROSPACE_SYSTEM_PROMPT + `

Your task: Solve the given aerospace engineering problem step by step.
Format your response as numbered steps. Each step should:
1. Have a clear title on the first line (e.g., "**Step 1: Identify Given Variables**")
2. Show the work and reasoning
3. Include LaTeX math where needed
4. End with a brief summary of what was accomplished in that step

Make steps digestible for ADHD students - not too long, very clear.`;

  const userContent = context
    ? `Context from uploaded materials:\n${context}\n\nProblem to solve:\n${problem}`
    : problem;

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function generatePracticeProblems(
  topic: string,
  difficulty: number,
  uploadedContent: string = ''
): Promise<string> {
  const difficultyLabels = ['', 'Introductory', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
  const difficultyLabel = difficultyLabels[difficulty] || 'Intermediate';

  const contextSection = uploadedContent
    ? `\n\nStudent's uploaded study material for context:\n${uploadedContent.slice(0, 2000)}`
    : '';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: AEROSPACE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate a single ${difficultyLabel} practice problem on the topic: "${topic}" in aerospace engineering.

Format your response exactly as:
**Problem:**
[The problem statement with all given values, using LaTeX for math]

**What to Find:**
[Clearly state what the student needs to calculate/determine]

**Hint:**
[One helpful hint without giving away the solution]

**Answer:**
||HIDDEN|| [The numerical answer with units] ||HIDDEN||

Make it realistic and relevant to aerospace engineering. Include specific numerical values.${contextSection}`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function extractFormulas(pdfText: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: AEROSPACE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Extract and organize all mathematical formulas and equations from this aerospace engineering text.

Group them by topic (e.g., Aerodynamics, Thermodynamics, Orbital Mechanics, Structures, Controls).

For each formula:
1. Give it a clear name
2. Write it in LaTeX (block math: $$...$$)
3. Briefly define each variable

Format as:
## [Topic Name]

### [Formula Name]
$$[LaTeX formula]$$
Where: [variable definitions]

---

Text to process:
${pdfText.slice(0, 8000)}`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function socraticTutor(
  question: string,
  conversationHistory: Message[]
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = AEROSPACE_SYSTEM_PROMPT + `

You are using the Socratic method. Instead of giving direct answers:
- Ask guiding questions that lead the student to discover the answer
- Acknowledge what they got right before addressing errors
- Break down their thinking process
- Use aerospace examples to make concepts concrete
- Celebrate progress enthusiastically (you know ADHD students need positive reinforcement)
- If they're really stuck after 3 exchanges, provide more direct guidance

Keep responses concise - 2-4 questions or guiding statements max.`;

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function explainConcept(
  concept: string,
  context: string = ''
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = AEROSPACE_SYSTEM_PROMPT + `

Your task: Explain the concept in bite-sized, numbered chunks optimized for ADHD students.

Structure your explanation as:
1. 🎯 **Core Idea** (1-2 sentences max)
2. 🔍 **Why It Matters** (real aerospace application)
3. 📐 **The Math** (key formula with LaTeX, explained simply)
4. 💡 **Intuition** (a simple analogy or mental model)
5. ✅ **Key Takeaway** (what to remember)

Keep each section SHORT. Use LaTeX for all math. Make it engaging!`;

  const userContent = context
    ? `Context:\n${context.slice(0, 2000)}\n\nExplain this concept: ${concept}`
    : `Explain this aerospace engineering concept: ${concept}`;

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function checkWork(
  problem: string,
  userAttempt: string,
  context: string = ''
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = AEROSPACE_SYSTEM_PROMPT + `

Your task: Review the student's work and provide detailed, constructive feedback.

Structure your feedback as:
1. ✅ **What's Correct** - specifically praise correct steps/concepts
2. ⚠️ **Issues Found** - clearly identify errors (numbered if multiple)
3. 🔧 **How to Fix It** - step-by-step correction for each error
4. 📐 **Correct Solution** - show the right approach with LaTeX math
5. 💪 **Encouragement** - positive closing message

Be specific about line/step numbers when referencing errors. Use LaTeX for all math.`;

  const userContent = `Problem:\n${problem}\n\nStudent's attempt:\n${userAttempt}${context ? `\n\nContext:\n${context.slice(0, 1000)}` : ''}`;

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
