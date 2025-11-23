import { createAgent, gemini } from "@inngest/agent-kit";
import { saveSentimentsTool } from "../tools/saveSentimentsTool";


export const sentimentAnalyzerAgent = createAgent({
    name:"sentiment-analyzer",
    description:"",
    system:({network}) =>{
        const articles = network?.state.data.articles;
        return `
        
        You are a sentiment analysis expert. Analyze these articles:
        ${JSON.stringify(articles, null, 2)}

        For each article, determine:
        1. Sentiment (positive, negative, neutral)
        2. Score (0-1)
        3. Brief reasoning

        MUST use the save_sentiments tool to store your analysis.
        `
    },
    model:gemini({model:"gemini-2.5-flash",apiKey:process.env.GOOGLE_API_KEY!}),
    tools:[saveSentimentsTool],
    tool_choice:"save_sentiments"
})
