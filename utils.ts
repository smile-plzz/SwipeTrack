/**
 * Parses a runtime string into hours.
 * Supports: "120 min", "2 h 30 min", "20h", "45 m"
 */
export const parseDurationToHours = (runtimeStr?: string): number => {
  if (!runtimeStr) return 0;
  
  const lowerStr = runtimeStr.toLowerCase();
  
  // Handle games "20h" or "20 hours"
  if (lowerStr.includes('h')) {
      const parts = lowerStr.split('h');
      const hours = parseFloat(parts[0]) || 0;
      return hours;
  }
  
  // Handle movies "120 min" or "120 m"
  if (lowerStr.includes('min') || lowerStr.includes('m')) {
      const minutes = parseFloat(lowerStr) || 0;
      return minutes / 60;
  }

  // Fallback if just number (assume minutes for movies/series, hours for games? difficult without context, assume min)
  return (parseFloat(lowerStr) || 0) / 60;
};

export const formatHours = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
};
