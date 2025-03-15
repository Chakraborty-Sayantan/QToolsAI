import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Build the prompt with Mistral-7B format
    let prompt = '<|system|>You are a helpful AI assistant</s>';
    for (const message of messages) {
      prompt += message.role === 'user' 
        ? `<|user|>${message.content}</s>`
        : `<|assistant|>${message.content}</s>`;
    }
    prompt += '<|assistant|>';

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) throw new Error('Missing API key');

    // Create a streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
          {
            headers: {
              'Authorization': `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 1024,
                temperature: 0.7,
                return_full_text: false
              },
              stream: true
            })
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || error.message);
        }

        // Handle SSE response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Process SSE lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                await writer.close();
                return;
              }

              try {
                const json = JSON.parse(data);
                const token = json.token?.text || '';
                if (token) {
                  await writer.write(new TextEncoder().encode(token));
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }
        }

        await writer.close();
      } catch (error) {
        console.error('Error:', error);
        await writer.write(new TextEncoder().encode(
          JSON.stringify({
            error: error instanceof Error ? error.message : 'API Error'
          })
        ));
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}