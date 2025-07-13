'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignOutButton } from '@/components/sign-out-button';

interface Problem {
  id: string;
  problem_name: string;
  difficulty: string;
  tags: string[];
}

export default function DashboardPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Example: Query for problems tagged with "arrays"
        const q = query(collection(db, 'problems'), where('tags', 'array-contains', 'arrays'));
        const querySnapshot = await getDocs(q);
        
        // If you want to fetch all problems, use this instead:
        // const querySnapshot = await getDocs(collection(db, 'problems'));

        const problemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Problem[];
        setProblems(problemsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch problems. Make sure you have seeded the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <h1 className="text-2xl font-bold font-headline">Synapse Arena</h1>
        <SignOutButton />
      </header>
      <main className="p-4 sm:p-6">
        <h2 className="text-3xl font-bold font-headline mb-4">
          Coding Problems
        </h2>
        {loading && <p>Loading problems...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {problems.length > 0 ? (
              problems.map(problem => (
                <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{problem.problem_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
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
                    {problem.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No problems found. Did you run the seed script?</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
