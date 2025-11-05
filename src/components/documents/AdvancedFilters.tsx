import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClear: () => void;
}

export function AdvancedFilters({ onFiltersChange, onClear }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    confidenceMin: 0,
    fileSizeMax: 50, // MB
    hasExtractedData: undefined as boolean | undefined,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      dateRange: { from: undefined, to: undefined },
      confidenceMin: 0,
      fileSizeMax: 50,
      hasExtractedData: undefined,
    };
    setFilters(clearedFilters);
    onClear();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs">Upload Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    format(filters.dateRange.from, "PPP")
                  ) : (
                    <span>From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? (
                    format(filters.dateRange.to, "PPP")
                  ) : (
                    <span>To</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, to: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="space-y-2">
          <Label className="text-xs">Minimum Confidence: {filters.confidenceMin}%</Label>
          <Slider
            value={[filters.confidenceMin]}
            onValueChange={([value]) => handleFilterChange('confidenceMin', value)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* File Size */}
        <div className="space-y-2">
          <Label className="text-xs">Maximum File Size: {filters.fileSizeMax}MB</Label>
          <Slider
            value={[filters.fileSizeMax]}
            onValueChange={([value]) => handleFilterChange('fileSizeMax', value)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Extracted Data Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Extracted Data</Label>
          <div className="flex gap-2">
            <Button
              variant={filters.hasExtractedData === true ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('hasExtractedData', true)}
            >
              Has Data
            </Button>
            <Button
              variant={filters.hasExtractedData === false ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('hasExtractedData', false)}
            >
              No Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}