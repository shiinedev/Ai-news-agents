import { createAgent, gemini } from "@inngest/agent-kit";
import { generatePosterTool } from "../tools/generatePosterTool";

export const posterDesigner = createAgent({
    name:"poster-designer",
    description:"Generate social media posters for the social media posts",
    system:({network}) =>{
    
        const articles = network?.state.data.articles;
        return `
         You are a creative designer. Generate ONE single poster that represents ALL the content:
        Articles: ${JSON.stringify(articles, null, 2)}
       

        Use generate_poster tool ONCE to create a single, eye-catching poster.
        Create ONE nano-banana prompt that captures the essence of all the content in a professional, modern design.
        use fewer words in the prompt.
        IMPORTANT: Call generate_poster only ONE time with a comprehensive prompt.`
    },
    model:gemini({model:"gemini-2.5-flash",apiKey:process.env.GOOGLE_API_KEY!}),
    tools:[generatePosterTool],
    tool_choice:"generate_poster"
})

