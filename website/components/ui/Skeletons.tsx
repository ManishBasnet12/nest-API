// website/src/components/shared/skeletons/Skeletons.tsx

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[122.4px] w-full md:min-w-0 animate-pulse">
      <div className="relative aspect-square  min-w-[122.4px] overflow-hidden rounded-2xl bg-gray-200" />
      <div className="h-4 w-16 rounded bg-gray-100 mt-1" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex w-[160px] flex-col rounded-2xl border border-gray-100 p-3 md:w-[200px] animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-3 w-2/3 rounded bg-gray-100" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-10 rounded bg-gray-100" />
        <div className="h-8 w-16 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
