import { newsAnalysisNetwork } from "@/lib/agents/network";
import { inngest } from "./client";



export const newsAnalysisWorkflow = inngest.createFunction(
    {id:"news-analysis-workflow",retries:2},
    {
        event:"new.agents/run"
    },
    async ({event}) =>{
        
        const {input,runId,limit} = event.data;

        console.log(input,runId,limit);
        

       try {


        const result = await newsAnalysisNetwork.run(input,{
            state:{
                data:{
                    runId,
                    limit:limit | 1
                }
            }
        });


        return {
            success:true,
            result:result.state.data
        }
        
       } catch (error) {
        console.log("error failed network");


        try {
            
            const {getDB} = await import("@/lib/db");
            const db = await getDB();
             await db.collection("results").updateOne(
                {
                    runId,
                    status:"running"
                },
                {
                    $set:{
                            status:"failed",
                            error:error instanceof Error ? error.message : "unknown error",
                            failedAt:new Date(),
                            
                    }
                })
        } catch (error) {
           console.log("failed to save error");
           
        }
        
        throw error;
        
       }
    }

)