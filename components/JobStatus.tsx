import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type JobStatusProps = {
    status: 'running' | 'success' | 'failed';
    articles?: number;
    sentiments?: number;
    posts?: number;
    posters?: number;
    approved?: boolean;
    reason?:string,
    error?:string
  };

const JobStatus = ({ status, articles, sentiments, posts, posters, approved,reason,error }: JobStatusProps) => {
  return (

    <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Job Status</CardTitle>
        <span className={`text-sm font-medium px-3 py-1 rounded ${
          status === 'running' ? 'bg-blue-100 text-blue-700' :
          status === 'success' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {status === 'running' ? '🔄 Running' : 
           status === 'success' ? '✅ Complete' : 
           '❌ Failed'}
        </span>
      </div>
    </CardHeader>


    <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Articles Found:</span>
            <span className="font-medium">{articles}</span>
          </div>
          <div className="flex justify-between">
            <span>Sentiments Analyzed:</span>
            <span className="font-medium">{sentiments}</span>
          </div>
          <div className="flex justify-between">
            <span>Posts Created:</span>
            <span className="font-medium">{posts}</span>
          </div>
          <div className="flex justify-between">
            <span>Poster Generated:</span>
            <span className="font-medium">{posters ? '✓' : '—'}</span>
          </div>
          {error && (
            <div className='mt-3 pt-3 border-t text-red-600'>
              <p><span className='font-medium'>Error:</span> {error.split(":")[0]}</p>
            </div>
          )}
          {approved !== undefined && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Approved:</span>
                <span className={approved ? 'text-green-600' : 'text-red-600'}>
                  {approved ? '✓ Yes' : '✗ No'}
                </span>
               
              </div>
            </div>
          )}
          {reason && (
            <div>
              <p><span className='font-medium'>Reason:</span> {reason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default JobStatus