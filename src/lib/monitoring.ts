// Simple monitoring and logging utility
interface FallbackEvent {
  component: string;
  scenario: string;
  timestamp: number;
  data?: any;
}

class FallbackMonitor {
  private events: FallbackEvent[] = [];
  private maxEvents = 1000;

  log(component: string, scenario: string, data?: any) {
    const event: FallbackEvent = {
      component,
      scenario,
      timestamp: Date.now(),
      data
    };
    
    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    
    // Console log for development
    console.log(`[Fallback] ${component}: ${scenario}`, data);
  }

  getStats() {
    const stats: Record<string, Record<string, number>> = {};
    
    this.events.forEach(event => {
      if (!stats[event.component]) {
        stats[event.component] = {};
      }
      if (!stats[event.component][event.scenario]) {
        stats[event.component][event.scenario] = 0;
      }
      stats[event.component][event.scenario]++;
    });
    
    return stats;
  }

  getRecentEvents(limit = 50) {
    return this.events.slice(0, limit);
  }
}

export const fallbackMonitor = new FallbackMonitor();

// Safe slice utility
export const safeSlice = (arr: any[] | undefined | null, start?: number, end?: number): any[] => {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  return arr.slice(start, end);
};

// Safe string slice utility
export const safeStringSlice = (str: string | undefined | null, start?: number, end?: number): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.slice(start, end);
};