import { SearchX, Upload } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-4 text-center max-w-xs">
      <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center">
        {hasFilters ? (
          <SearchX className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Upload className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="space-y-1.5">
        <h2 className="text-sm font-semibold text-foreground">
          {hasFilters ? "No matching data" : "No player data"}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasFilters
            ? "No players match the current filters. Try adjusting or clearing them."
            : "Upload a JSON file to visualize player journeys on the map."}
        </p>
      </div>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;
