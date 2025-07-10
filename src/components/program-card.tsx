import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import type { Program, ProgramCategory } from '@/lib/types';

interface ProgramCardProps {
  program: Program;
}

const categoryImageHints: Record<ProgramCategory, string> = {
  'Web Development': 'web development code',
  'Data Science': 'data visualization chart',
  'UI/UX Design': 'user interface wireframe',
  'Cybersecurity': 'cyber security lock'
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link href={`/programs/${program.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out bg-secondary/20 hover:bg-secondary/40 border-transparent hover:border-primary">
        <CardHeader className="flex-grow">
           <div className="relative h-40 w-full mb-4">
            <Image
              src={program.image}
              alt={program.title}
              fill
              style={{objectFit: 'cover'}}
              className="rounded-t-lg"
              data-ai-hint={categoryImageHints[program.category]}
            />
          </div>
          <Badge variant="secondary" className="w-fit">{program.category}</Badge>
          <CardTitle className="pt-2">{program.title}</CardTitle>
          <CardDescription className="h-12 text-sm">{program.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{program.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
