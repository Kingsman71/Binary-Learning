"use client";

import { notFound, useParams } from 'next/navigation';
import { programs } from '@/lib/data';
import { ApplicationForm } from '@/components/application-form';

export default function ApplyPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const program = programs.find(p => p.id === id);

  if (!program) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Apply for {program.title}</h1>
          <p className="mt-2 text-muted-foreground">Complete the form below to start your journey.</p>
        </div>
        <ApplicationForm programId={program.id} />
      </div>
    </div>
  );
}
