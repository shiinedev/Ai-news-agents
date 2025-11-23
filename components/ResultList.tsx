"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import axios from "axios";

interface Result {
    _id:string,
    runId: string;
    input: string;
    status: string;
    state: {
        moderatorNotes:string
    }
}
  
interface Results {
    results: Result[];
}


const ResultList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const response = await axios.get<Results>(`/api/results`);
      return response.data
    },
    staleTime: 3000,
    retry: 1,
  });


  const results = data?.results || []
 

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-auto">
          {results?.map((res:Result) => (
            <Link
              href={`/history/${res?.runId}`}
              key={res?._id}
              className="border p-3 rounded flex gap-3">
              <div className="flex-1 min-w-0 ">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium capitalize">{res?.input}</h4>
                  <span
                    className={`text-sm  px-2 py-1 rounded ${
                      res?.status === "running"
                        ? "bg-blue-100 text-blue-700"
                        : res?.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {res?.status === "running"
                      ? "🔄 Running"
                      : res?.status === "success"
                      ? "✅ Complete"
                      : "❌ Failed"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {res.state.moderatorNotes}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultList;
