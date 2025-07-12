
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { SignOutButton } from '@/components/sign-out-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Problem {
  id: string;
  problem_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

const problemCategories = [
  "All", "arrays", "dynamic programming", "hashing ds", "linked lists", "math", "other", "strings", "trees"
];

const programmingLanguages = ["Python", "JavaScript", "C++"];

export default function DashboardPage() {
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'problems'));
        const problemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Problem[];
        setAllProblems(problemsData);
        setFilteredProblems(problemsData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch problems. Make sure you have seeded the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    let newFilteredProblems = [...allProblems];

    if (selectedCategory !== 'All') {
      newFilteredProblems = newFilteredProblems.filter(problem => 
        problem.tags.map(t => t.toLowerCase()).includes(selectedCategory.toLowerCase())
      );
    }
    
    // Note: Language filter is not functional as language is not a field in the data.
    // This is a placeholder for when the data model is updated.
    
    setFilteredProblems(newFilteredProblems);

  }, [selectedCategory, selectedLanguage, allProblems]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <h1 className="text-2xl font-bold font-headline">Synapse Arena</h1>
        <SignOutButton />
      </header>
      <main className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold font-headline">
            Coding Problems
          </h2>
          <div className="flex items-center gap-2">
            <Select onValueChange={setSelectedLanguage} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {programmingLanguages.map(lang => (
                  <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {problemCategories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory.toLowerCase() === category.toLowerCase() ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>

        {loading && <p>Loading problems...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Problem</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProblems.length > 0 ? (
                  filteredProblems.map(problem => (
                    <TableRow key={problem.id}>
                      <TableCell className="font-medium">{problem.problem_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                           {problem.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                           ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/problems/${problem.id}`}>
                           <Button variant="outline">Solve Now</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No problems found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
