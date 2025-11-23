import { createAgent ,gemini} from "@inngest/agent-kit";
import { savePostsTool } from "../tools/savePostsTool";



export const contentCreator = createAgent({
    name:"content-creator",
    description:"make social media pots based on user articles",
    system:({network}) =>{
        const articles = network?.state.data.articles;
        const sentiments = network?.state.data.sentiments;
        return `
        You are a social media expert. Create engaging posts from these articles:
        Articles: ${JSON.stringify(articles, null, 2)}
        Sentiments: ${JSON.stringify(sentiments, null, 2)}

        Create 2-3 posts per article:
        - One Twitter post (max 280 chars)
        - One LinkedIn post (professional, ~200 chars)
        - Include relevant hashtags
        
        NOTE:do not add the hashtags in the content
        MUST use the save_posts tool to store your posts.`
    },
    model:gemini({model:"gemini-2.5-flash",apiKey:process.env.GOOGLE_API_KEY!}),
    tools:[savePostsTool],
    tool_choice:"save_posts"

})