import { createTool } from "@inngest/agent-kit";
import z from "zod";

export const doneTool = createTool({
    name:"done",
    description:"",
    parameters:z.object({
        reason:z.string().describe("The reason for routing")
    }),
    handler: async({reason}) =>{

        console.log("the reason it stop",reason);
         return undefined
    }


})