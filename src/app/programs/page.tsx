"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgramCard } from '@/components/program-card';
import { programs } from '@/lib/data';
import type { Program } from '@/lib/types';

const categories = ['All', ...new Set(programs.map(p => p.category))];

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [duration, setDuration] = useState('All');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            program.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'All' || program.category === category;
      const matchesDuration = duration === 'All' || program.duration === duration;

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [searchTerm, category, duration]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Explore Our Programs</h1>
        <p className="mt-4 text-lg text-muted-foreground">Find the right path to accelerate your career in tech.</p>
      </div>

      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Durations</SelectItem>
              <SelectItem value="10 Weeks">10 Weeks</SelectItem>
              <SelectItem value="12 Weeks">12 Weeks</SelectItem>
              <SelectItem value="16 Weeks">16 Weeks</SelectItem>
              <SelectItem value="20 Weeks">20 Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-medium text-muted-foreground">No programs match your criteria.</p>
          <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
