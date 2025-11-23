import { createNetwork, createRoutingAgent, gemini } from "@inngest/agent-kit";
import { routeToAgent } from "../tools/routeToAgent";
import { doneTool } from "../tools/doneTool";
import { newsScoutAgent } from "./newScout";
import { sentimentAnalyzerAgent } from "./sentimentAnalyzer";
import { contentCreator } from "./contentCreator";
import { moderatorAgent } from "./moderator";
import { posterDesigner } from "./posterDesigner";


export const supervisorAgent = createRoutingAgent({
    name:"supervisor",
    description:"AI supervisor that orchestrates the news analysis workflow",
    system:({network}) =>{
        const state = network?.state.data;
        console.log(state);
        const agents = Array.from(network?.agents.values() || []);
        console.log("agents",agents);
        
        
        return `
        You are an intelligent supervisor managing a news analysis workflow.
        **Current State:**
        - Articles found: ${state?.articles?.length || 0}  
        - Sentiments analyzed: ${state?.sentiments?.length || 0} 
        - Posts created: ${state?.posts?.length || 0}  
        - Posters generated: ${state?.posters?.length || 0}  
        - Content approved: ${state?.approved !== undefined ? (state.approved ? 'Yes' : 'No') : 'Not yet reviewed'}  // Show approval status

        **Available Agents:**
        ${agents.map(a => `- ${a.name}: ${a.description}`).join('\n')}  

        **Your Job:**
        1. Analyze the current state  
        2. Decide which agent should run next to progress the workflow 
        3. Use route_to_agent tool to select the next agent 
        4. Use done tool when all steps are complete and content is approved  

        **Workflow Logic:**
        - If no articles: route to "News Scout"  
        - If articles but no sentiments: route to "Sentiment Analyzer" 
        - If sentiments but no posts: route to "Content Creator"  
        - If posts but no posters: route to "Poster Designer" 
        - If everything done but not approved: route to "Moderator"  
        - If approved: call done 

        Think step by step and make the best decision!
        `
        
    },
    model:gemini({model:"gemini-2.5-flash",  apiKey:process.env.GOOGLE_API_KEY!}),
    tools:[routeToAgent,doneTool],
    tool_choice:"auto",
    lifecycle:{
        onRoute:({result}) =>{

            if(!result.toolCalls || result.toolCalls.length === 0){
                return undefined
            }


            const tool = result.toolCalls[0];

            if(tool.tool.name === "done"){
                return undefined
            }


            if(tool.tool.name === "route_to_agent"){

                const agentName = (tool.content as any)?.data || (tool.content as string);
                console.log("tool content",tool.content);
                console.log("agent name",agentName);
                
                return [agentName]

            }

            return undefined

        }
    },

})


export const newsAnalysisNetwork = createNetwork({
    name:"news-analysis-network",
    description:"Multi-agent system for news analysis and social media content creation",
    agents:[
        newsScoutAgent,
        sentimentAnalyzerAgent,
        contentCreator,
        posterDesigner,
        moderatorAgent
    ],
    router:supervisorAgent,
    maxIter:20
})