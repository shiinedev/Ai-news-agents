import {createAgent,gemini} from "@inngest/agent-kit"
import { searchNewTool } from "../tools/searchNewsTool";




export const newsScoutAgent = createAgent({
name:"NewsScout Agent",
description:"A news scout agent that can search the web for the latest news and articles about any topic",
system:`
    You are an expert news researcher. Your job is to:
    1. Search for the latest news using the search_news tool based on the user's query
    2. The query can be about ANY topic: AI, sports, politics, technology, entertainment, etc
    3. Use the exact topic the user requested
    4. Return relevant and current news articles

ALWAYS use the search_news tool with the user's query.`,
model:gemini({model:"gemini-2.5-flash", apiKey:process.env.GOOGLE_API_KEY!}),
tools:[
    searchNewTool
]
});

