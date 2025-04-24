export interface SimulateLLMStreamOptions {
    prompt: string;
    delayPerChunkMs?: number;
    chunkSize?: number;
    fullResponse?: string;
}

export async function* simulateLLMStream(
    options: SimulateLLMStreamOptions
): AsyncGenerator<string, void, unknown> {
    const {
        prompt,
        delayPerChunkMs = 100,
        chunkSize = 10,
        fullResponse = `This is a simulated response to the prompt: "${prompt}". Here's some more text to simulate tokenized output.`
    } = options;

    for (let i = 0; i < fullResponse.length; i += chunkSize) {
        const chunk = fullResponse.slice(i, i + chunkSize);
        yield chunk;
        await new Promise((resolve) => setTimeout(resolve, delayPerChunkMs));
    }
}
