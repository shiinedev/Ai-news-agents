import { createTool } from "@inngest/agent-kit";
import z from "zod";


export const approveContentTool = createTool({
    name:"approve_content",
    description:"",
    parameters:z.object({
        approved:z.boolean(),
        notes:z.string()
    }),
    handler: async(input,{network,step}) =>{


        network.state.data.approved = input.approved;

        if(input.notes){
            network.state.data.notes = input.notes;
        }
      
    await step?.run("approve_content",async () =>{
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
                        "state.approved":input.approved,
                        "state.moderatorNotes":input.notes,
                        "progress.moderator":"completed",
                        status: `${input.approved ? "success":"failed"}`,
                        updatedAt:new Date(),
                        completedAt:new Date()
                    }   
                    }
                
            );
        }else{
            console.log("failed to approve content");
        }
        
    })


    return {success:true, approved:input.approved}

}

});