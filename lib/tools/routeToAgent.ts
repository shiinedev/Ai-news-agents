import { createTool } from "@inngest/agent-kit";
import z from "zod";

export const routeToAgent = createTool({
    name:"route_to_agent",
    description:"",
    parameters:z.object({
        agentName:z.string().describe("The name of the agent to route to"),
        reason:z.string().describe("The reason for routing")
    }),
    handler: async({reason,agentName},{network}) =>{

        console.log("the reason it chooses this tool",reason);
        

        if(!network){
            throw new Error("No network found");
        
        }

        const agent = network.agents.get(agentName);

        if(!agent){
            throw new Error(`Agent ${agentName} not found`);
        }

        return agent.name
    }

})