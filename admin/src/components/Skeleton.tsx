

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export function Skeleton({ className = "", variant = "rectangular", width, height }: SkeletonProps) {
  const baseClasses = "skeleton";
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={baseClasses + " " + variantClasses[variant] + " " + className}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={"space-y-2 " + className} aria-hidden="true">
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? "60%" : "100%" } height="1rem" />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={"bg-white border border-outline-variant rounded-xl overflow-hidden " + className} aria-hidden="true">
      <Skeleton variant="rectangular" className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-4">
        <SkeletonText lines={2} />
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <div className="flex gap-3">
          <Skeleton variant="text" width="50%" height="2.5rem" />
          <Skeleton variant="text" width="30%" height="2.5rem" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 5, className = "" }: { columns?: number; className?: string }) {
  return (
    <tr className={className} aria-hidden="true">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton variant="text" width="80%" height="1rem" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5, className = "" }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={"overflow-x-auto " + className} aria-hidden="true">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-outline-variant">
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="text-left py-4 px-6 text-sm font-medium text-outline">
                <Skeleton variant="text" width="60%" height="0.875rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <SkeletonTableRow key={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonStatCard({ className = "" }: { className?: string }) {
  return (
    <div className={"bg-white rounded-xl border border-outline-variant p-6 " + className} aria-hidden="true">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" width="60%" height="0.875rem" />
          <Skeleton variant="text" width="40%" height="2rem" className="mt-1" />
        </div>
        <Skeleton variant="circular" width="3rem" height="3rem" className="p-3 bg-surface-dim rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ items = 4, className = "" }: { items?: number; className?: string }) {
  return (
    <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 " + className} aria-hidden="true">
      {[...Array(items)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5, className = "" }: { items?: number; className?: string }) {
  return (
    <div className={"space-y-4 " + className} aria-hidden="true">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-outline-variant">
          <Skeleton variant="rectangular" className="w-24 h-24 flex-shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3">
            <SkeletonText lines={2} />
            <div className="flex gap-3">
              <Skeleton variant="text" width="50%" height="1.5rem" />
              <Skeleton variant="text" width="30%" height="1.5rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

