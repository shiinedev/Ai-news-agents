"use client"
import ResultList from '@/components/ResultList';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';


const HistoryPage = () => {



    const { data, isLoading } = useQuery({
        queryKey: ["results"],
        queryFn: async () => {
          const response = await fetch(`/api/results`);
          return response.json();
        },
        staleTime:3000,
        retry:1
      });

      const results = data?.results

      console.log("results",results);


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
        <Button asChild>
          <Link href="/"> Search</Link>
        </Button>
       
      </div>

      <ResultList />
    </div>
  </main>
  )
}

export default HistoryPage
