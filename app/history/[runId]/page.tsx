"use client"
import ArticleCard from "@/components/ArticleCard"
import JobStatus from "@/components/JobStatus"
import PosterCard from "@/components/PosterCard"
import PostsCard from "@/components/PostsCard"
import SentimentCard from "@/components/SentimentCard"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"



const DetailsPage = () => {

    const params = useParams();
const runId = params.runId;

    const { data: result, isLoading } = useQuery({
        queryKey: ["results", runId],
        queryFn: async () => {
          const response = await fetch(`/api/results/${runId}`);
          return response.json();
        },
        enabled: !!runId,
        retry:1
      });


    const state = result?.state || null;

  return (
    <main className="min-h-screen bg-white p-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4" >
        <div>
        <h1 className="text-3xl font-bold text-gray-900">AI News Agents</h1>
        <p className="text-gray-600 mt-1">
          Multi-agent system with intelligent routing
        </p>
        </div>
        <div className="flex items-center gap-2" >
        <Button asChild variant={"outline"}>
          <Link href="/history">History</Link>
        </Button>
        <Button asChild>
          <Link href="/"> Search</Link>
        </Button>
        </div>
      
       
      </div>

      {/* Input Form */}
   

      {result && (
        <>
          <JobStatus
            status={result.status}
            articles={state.articles?.length}
            sentiments={state.sentiments?.length}
            posts={state.posts?.length}
            posters={state.poster?.length}
            approved={state.approved}
            reason={state.moderatorNotes}
            error={result.error}
          />

          {/* Data Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <ArticleCard articles={state.articles || []} />
            <SentimentCard sentiments={state.sentiments || []} />
            <PostsCard posts={state.posts || []} />
            <PosterCard posters={state.poster || []} />
          </div>
        </>
      )}
    </div>
  </main>
  )
}

export default DetailsPage
