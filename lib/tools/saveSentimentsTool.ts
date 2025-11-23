import { createTool } from "@inngest/agent-kit";
import z from "zod";

export const saveSentimentsTool = createTool({
  name: "save_sentiments",
  description: "",
  parameters: z.object({
    sentiments: z.array(
      z.object({
        sentiment: z.enum(["positive", "negative", "neutral"]),
        Score: z.number().min(0).max(1),
        Reasoning: z.string(),
      })
    ),
  }),

  handler: async (input, { network, step }) => {
    
    network.state.data.sentiments = input.sentiments;
    
    await step?.run("save_sentiments", async () => {
      
        const {getDB} = await import("@/lib/db");
        const db = await getDB();
        const runId = network.state.data.runId;

        if (runId) {
            const result = await db.collection('results').updateOne(
                {
                    runId, status: 'running'
                },
                {
                    $set: {
                        'state.sentiments': input.sentiments,
                        'progress.sentimentAnalyzer': 'completed',
                        updatedAt: new Date()
                    }
                }
            );

            return result;
        } else {
            console.error('No runId found');
        }

    });
    return { success: true ,count:input.sentiments.length};
  }
  

});
