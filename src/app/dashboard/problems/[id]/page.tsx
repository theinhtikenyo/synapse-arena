
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProblemPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'problems', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProblem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Problem not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the problem.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Button>
        </Link>
      </div>
      {problem && (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-headline">{problem.problem_name}</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                    <Badge
                      variant={
                        problem.difficulty === 'easy'
                          ? 'default'
                          : problem.difficulty === 'medium'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="capitalize"
                    >
                      {problem.difficulty}
                    </Badge>
                    {problem.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose max-w-none text-foreground">
                    <p>{problem.content}</p>
                    
                    <h3 className="font-semibold mt-4">Instruction</h3>
                    <p>{problem.instruction}</p>

                    <h3 className="font-semibold mt-4">Input Format</h3>
                    <p>{problem.input_format}</p>

                    <h3 className="font-semibold mt-4">Output Format</h3>
                    <p>{problem.output_format}</p>
                    
                    {problem.constraints && problem.constraints.length > 0 && (
                        <>
                            <h3 className="font-semibold mt-4">Constraints</h3>
                            <ul className="list-disc pl-5">
                                {problem.constraints.map((c: string, i: number) => <li key={i}>{c}</li>)}
                            </ul>
                        </>
                    )}

                    {problem.examples && problem.examples.length > 0 && (
                         <>
                            <h3 className="font-semibold mt-4">Examples</h3>
                            {problem.examples.map((ex: {input: string, output: string}, i: number) => (
                                <div key={i} className="bg-muted p-4 rounded-md mt-2">
                                    <p className="font-mono"><strong>Input:</strong> {ex.input}</p>
                                    <p className="font-mono"><strong>Output:</strong> {ex.output}</p>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
