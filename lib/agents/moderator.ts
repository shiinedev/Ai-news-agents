import { createAgent, gemini } from "@inngest/agent-kit";
import { approveContentTool } from "../tools/approveContentTool";


export const moderatorAgent = createAgent({
    name:"moderator",
    description:"Reviews and approves content",
    system:({network}) =>{
        const posts = network?.state.data.posts;
        const articles = network?.state.data.articles;
        const posters = network?.state.data.posters
        return `   
            You are a content moderator. Review all content:
            Articles (${articles?.length}): ${JSON.stringify(articles.slice(0, 1), null, 2)}...
            Posts (${posts?.length}): ${JSON.stringify(posts.slice(0, 1), null, 2)}...
            Posters (${posters?.length}): Generated

            Check:
            1. Is content accurate?
            2. Are posts appropriate?
            3. Is everything ready to publish?

            MUST use approve_content tool to approve the content.`

    },
    model:gemini({model:"gemini-2.5-flash",apiKey:process.env.GOOGLE_API_KEY!}),
    tools:[approveContentTool],
    tool_choice:"approve_content"
    })

    
