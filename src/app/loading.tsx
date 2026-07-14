import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Hero Skeleton */}
      <Skeleton className="h-10 w-48 rounded-full mb-8" />
      <Skeleton className="h-16 w-3/4 max-w-3xl rounded-xl mb-6" />
      <Skeleton className="h-16 w-2/3 max-w-2xl rounded-xl mb-10" />
      <Skeleton className="h-24 w-full max-w-2xl rounded-xl mb-12" />

      {/* Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full justify-center">
        <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
        <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col p-8 border border-border rounded-2xl">
            <Skeleton className="w-16 h-16 rounded-xl mb-6" />
            <Skeleton className="w-1/2 h-6 rounded-md mb-4" />
            <Skeleton className="w-full h-4 rounded-md mb-2" />
            <Skeleton className="w-3/4 h-4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
