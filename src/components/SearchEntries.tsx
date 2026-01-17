import { useEffect, useState, useCallback, useRef } from "react"
import type { Entry } from "@/types/diary.types";
import EntryComponent from "@/components/Entry";
import { api } from "@/services/apiClient";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback, useInfiniteScroll } from "@/utils/actions.utils";
import { Search, Calendar, Loader, Inbox, ChevronRight, SlidersHorizontal } from "lucide-react";

export default function SearchEntries() {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Entry[]>([])
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [hasMore, setHasMore] = useState(true)
    const LIMIT = 10;
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLUListElement | null>(null);
    const loadingRef = useRef(false);
    const searchResultsRef = useRef<Entry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<number | null>(null);

    // Keep ref in sync with state for access in stable callbacks
    useEffect(() => {
        searchResultsRef.current = searchResults;
    }, [searchResults]);

    const performSearch = useCallback(async (reset: boolean = false) => {
        // Use ref for immediate blocking of concurrent requests
        if (loadingRef.current || (!reset && !hasMore)) return;

        loadingRef.current = true;
        setLoading(true);

        if (reset) {
            setSearchResults([]);
            // Update ref immediately 
            searchResultsRef.current = [];
        }

        try {
            const currentOffset = reset ? 0 : searchResultsRef.current.length;

            const results = await api.entries.list({
                q: searchQuery,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                offset: currentOffset,
                limit: LIMIT
            }) || [];

            setSearchResults(prev => {
                const newEntries = reset ? results : [...prev, ...results];
                // Deduplicate by ID
                const uniqueEntries = Array.from(new Map(newEntries.map(item => [item.id, item])).values());
                return uniqueEntries;
            });

            setHasMore(results.length === LIMIT);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [searchQuery, startDate, endDate]);

    // Debounced search for query text changes
    const debouncedSearch = useDebouncedCallback(() => {
        performSearch(true);
    }, 500);

    // Effect for non-text filters (dates)
    useEffect(() => {
        performSearch(true);
    }, [startDate, endDate, performSearch]);

    // Handle text change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedSearch();
    };

    const handleLoadMore = useCallback(() => {
        performSearch(false);
    }, [performSearch]);
    const loadMoreRef = useInfiniteScroll(handleLoadMore, containerRef.current);

    return (
        <div className="bg-bg-subtle w-full max-w-3xl mx-auto space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Header & Controls */}
            <div className="bg-surface-raised rounded-xl shadow-lg border border-border-subtle overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* Search Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-100">
                            <Search className="h-5 w-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                        </div>
                        <input
                            id="search"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === 'Enter' && performSearch(true)}
                            placeholder="Search your memories..."
                            className="w-full pl-11 pr-4 py-3 bg-bg-subtle border border-border-subtle rounded-lg 
                                     text-text-primary placeholder:text-text-muted
                                     focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-surface-default
                                     outline-none transition-all duration-200"
                        />
                    </div>
                    {/* filter toggle button */}
                    <div className="flex justify-end">
                        <button onClick={() => setShowFilters(!showFilters)} className="text-sm text-text-muted hover:text-text-primary transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                        <div className="space-y-1.5">
                            <label htmlFor="startDate" className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">
                                From
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Calendar className="h-4 w-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 bg-bg-subtle border border-border-subtle rounded-md
                                             text-sm text-text-primary
                                             focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-surface-default
                                             outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="endDate" className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">
                                To
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <Calendar className="h-4 w-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                                </div>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 bg-bg-subtle border border-border-subtle rounded-md
                                             text-sm text-text-primary
                                             focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:bg-surface-default
                                             outline-none transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

            {/* Results Area */}
            <div className="space-y-4">
                {/* Empty State */}
                {searchResults.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-bg-subtle/50 rounded-xl border border-dashed border-border-subtle">
                        <div className="bg-bg-muted p-4 rounded-full mb-4">
                            <Inbox className="h-8 w-8 text-text-muted" />
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-1">No entries found</h3>
                        <p className="text-sm text-text-muted max-w-xs">
                            Try adjusting your search terms or date range to find what you're looking for.
                        </p>
                    </div>
                )}

                {/* Results List */}
                <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-150px)]" ref={containerRef}  >
                    {searchResults.map((entry) => (
                        // <EntryComponent entry={entry} />
                        <div
                            key={entry.id}
                            onDoubleClick={() => {
                                setActiveEntryId(prev => {
                                    if(!prev) return entry.id;
                                    return null;
                                })
                            }}
                                                   >
                            {(entry.id === activeEntryId) ? <EntryComponent entry={entry} /> :

                                <div
                                className="group relative flex flex-col sm:flex-row gap-4 p-5 
                                     bg-surface-default border border-border-subtle rounded-xl 
                                     hover:border-accent-primary/30 hover:shadow-md hover:bg-surface-raised
                                     cursor-pointer transition-all duration-300 ease-out"
                                    title="Double click to start/stop editing"
                                >

                                    {/* Date Badge */}
                                    <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-24"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/day/${entry.entry_date}`);
                                        }}
                                        title="Go to this day"
                                    >
                                        <span className="text-xs font-bold text-text-primary bg-accent-soft/50 px-2.5 py-1 rounded-lg border border-accent-soft">
                                            {entry.entry_date}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base text-text-primary font-body leading-relaxed line-clamp-2 group-hover:text-text-primary/90 transition-colors">
                                            {entry.content}
                                        </p>
                                    </div>

                                    {/* Chevron Action */}
                                    <div className="shrink-0 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ChevronRight className="h-5 w-5 text-text-primary" />
                                    </div>
                                </div>}
                        </div>
                    ))}
                    {
                        hasMore && (
                            <div ref={loadMoreRef} className="flex justify-center">
                                <Loader className="animate-spin" />
                            </div>
                        )
                    }
                </ul>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader className="animate-spin" />
                    </div>
                )}
            </div>
        </div>
    )
}