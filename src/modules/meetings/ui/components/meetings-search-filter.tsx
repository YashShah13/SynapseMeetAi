import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <div className="relative w-full max-w-xs">
      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none"
        strokeWidth={2}
      />

      {/* Input Field */}
      <Input
        placeholder="Search agents..."
        className="h-10 w-full pl-10 pr-4 text-sm rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        value={filters.Search}
        onChange={(e) => setFilters({ Search: e.target.value })}
      />
    </div>
  );
};
