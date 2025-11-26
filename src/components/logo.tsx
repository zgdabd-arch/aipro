import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg font-headline">
      <GraduationCap className="h-6 w-6 text-primary" />
      <span>ProAi</span>
    </div>
  );
}
