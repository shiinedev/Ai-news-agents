import z from "zod";
import {createTool} from "@inngest/agent-kit";

export const searchNewTool = createTool({
    name:"Search_news",
    description:"",
    parameters:z.object({
        query:z.string().describe("The search query"),
    
    }), 
     handler: async(input,{network,step}) => {
      
      

        const response = await step?.run("search_news",async () =>{

            const res = await fetch("https://google.serper.dev/search",{
                method:"POST",
                headers:{
                    "X-API-KEY": process.env.SERPER_API!,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    q:input.query,
                    page:1
                })
            });


            if(!res.ok){
                throw new Error("Failed to search news");
            }

        const result = await res.json();

        return result;

        });


        const articles:any[] = [];

        if(response.knowledgeGraph){
            articles.push({
                title: response.knowledgeGraph.title,
                link: response.knowledgeGraph.descriptionLink || '',
                summary: response.knowledgeGraph.description,
                source: response.knowledgeGraph.descriptionSource || 'Knowledge Graph',
                imageUrl: response.knowledgeGraph.imageUrl,
            })
        }

        if(response.organic){
            response.organic.map((item:any )=>(
                articles.push({
                    title: item.title,
                    link: item.link,
                    summary: item.snippet,
                    source: item.source,
                    imageUrl: item.imageUrl,
                })
            ))
          
        };

        if(response.topStories){
            response.topStories.map((item:any) => (
                articles.push({
                    title: item.title,
                    link: item.link,
                    summary: item.snippet || `Latest news from ${item.source}`,
                    source: item.source,
                    imageUrl: item.imageUrl,
                })
            ))
        }
       
        if (articles.length === 0 && response.news) {
            response.news.forEach((item: any) => {
                articles.push({
                    title: item.title,
                    link: item.link,
                    summary: item.snippet,
                    source: item.source,
                    imageUrl: item.imageUrl,
                });
            });
        }

        // update the network
         network.state.data.articles = articles;

        //Todo:save to dB
          // ✅ Save to MongoDB immediately!
    await step?.run('save_to_db', async () => {
        const { getDB } = await import('../db');
        const db = await getDB();
        const runId = network.state.data.runId;
        
        if (runId) {
          const result = await db.collection('results').updateOne(
            { runId, status: 'running' },
            {
              $set: {
                'state.articles': articles,
                'progress.newsScout': 'completed',
                updatedAt: new Date(),
              },
            }
          );
          console.log('✅ [News Scout] DB Update Result:', {
            matched: result.matchedCount,
            modified: result.modifiedCount,
          });
        } else {
          console.error('❌ [News Scout] No runId in state!');
        }
      });

        return {success:true,count:articles.length}
        
      
    },
})