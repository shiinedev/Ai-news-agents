import { createTool } from "@inngest/agent-kit";
import z from "zod";



export const savePostsTool = createTool({
  name: "save_posts",
  description: "Save the social media posts to the database",
  parameters: z.object({
    posts: z.array(
      z.object({
        type: z.enum(["linked", "twitter"]),
        content: z.string(),
        hashtags: z.array(z.string()),
      })
    ),
  }),
  handler: async (input, { network, step }) => {
  
    network.state.data.posts = input.posts;

   
    await step?.run("save_posts_to_db", async () => {
        
        const { getDB } = await import("../db");
    
        const runId = network.state.data.runId;
    
      const db = await getDB();

      if (runId) {
        const result = await db.collection("results").updateOne(
          {
            runId,
            status: "running",
          },
          {
            $set: {
              "state.posts": input.posts,
              "progress.contentCreator": "completed",
               updatedAt: new Date(),
            },
          }
        );

        return {
          success: true,
          message: "posts saved successfully",
          count: result.modifiedCount,
        };
      } else {
        console.log("failed to save posts ");
      }
    });

    return {
      success: true,
      count: input.posts.length,
    };
  },
});
