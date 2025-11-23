import { createTool } from "@inngest/agent-kit";
import Replicate from "replicate";

import z from "zod";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });


export const generatePosterTool = createTool({
    name:"generate_poster",
    description:"Generate a single, eye-catching poster for the social media post",
    parameters:z.object({
        prompt:z.string().describe("A detailed description of the poster to generate")
     }),
     handler: async(input,{network,step}) => {
        const prompt = input.prompt;

        console.log("prompt",prompt);
        if(!prompt) throw new Error("No prompt provided");
        

        const imageUrl = await step?.run("generate_poster_image",async () =>{

            const input = {
                prompt,
                output_format: "jpg"
              };
            const res = await replicate.run("google/nano-banana", { input });

            const url ="https://replicate.delivery/xezq/2UFX7n9wvsJrAZ3MeDB8d27RwaN6HJxst85FdJGSHgBNterVA/tmp5vyifyce.jpeg"
            return url
        });

        if(!imageUrl) throw new Error("failed to generate poster");

        const poster ={
            prompt:input.prompt,
            url:imageUrl
        }
        const previousPoster = network.state.data.poster || [];

        network.state.data.poster = [...previousPoster,poster];

    
        await step?.run("save_poster_to_db",async () =>{
            const {getDB} = await import("../db");
            const db = await getDB();
            const runId = network.state.data.runId;

            if(runId){
                 await db.collection("results").updateOne(
                    {
                        runId,
                        status:"running"
                    },
                    {
                        $set:{
                            "state.poster":network.state.data.poster,
                            "progress.poster":"completed",
                            updatedAt:new Date()
                        }
                    })
            }else{
                console.error('❌ [Poster Designer] No runId in state!');
            }

        })

        return {
            success:true,
            imageUrl,
            prompt
        }
            
     }
})


