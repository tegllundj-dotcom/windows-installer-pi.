/**
 * Debug utilities for the trading dashboard
 */

export interface DebugInfo {
  kvStore: {
    connected: boolean;
    errors: string[];
    lastAttempt?: Date;
  };
  environment: {
    isDev: boolean;
    sparkConnected: boolean;
    version: string;
  };
  performance: {
    loadTime: number;
    errorCount: number;
    warningCount: number;
  };
}

class DebugManager {
  private errors: string[] = [];
  private warnings: string[] = [];
  private startTime = Date.now();
  private kvErrors: string[] = [];
  private lastKVAttempt?: Date;

  constructor() {
    // Intercept console errors to track them
    this.interceptConsoleErrors();
  }

  private interceptConsoleErrors() {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      this.errors.push(message);
      
      // Track KV store specific errors
      if (message.includes('Failed to fetch KV key') || message.includes('Failed to set key')) {
        this.kvErrors.push(message);
        this.lastKVAttempt = new Date();
      }
      
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      this.warnings.push(message);
      originalWarn.apply(console, args);
    };
  }

  getDebugInfo(): DebugInfo {
    return {
      kvStore: {
        connected: this.kvErrors.length === 0,
        errors: this.kvErrors,
        lastAttempt: this.lastKVAttempt,
      },
      environment: {
        isDev: import.meta.env.DEV,
        sparkConnected: typeof (window as any).spark !== 'undefined',
        version: import.meta.env.PACKAGE_VERSION || '1.0.0',
      },
      performance: {
        loadTime: Date.now() - this.startTime,
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
      },
    };
  }

  printDebugReport() {
    const info = this.getDebugInfo();
    
    console.group('🔧 Trading Dashboard Debug Report');
    console.log('Environment:', info.environment);
    console.log('KV Store Status:', info.kvStore);
    console.log('Performance:', info.performance);
    
    if (info.kvStore.errors.length > 0) {
      console.group('⚠️ KV Store Issues');
      console.log('The application is running in development mode without GitHub Spark KV store access.');
      console.log('This is normal for local development - mock data will be used instead.');
      console.log('To connect to KV store, deploy to GitHub Spark or configure authentication.');
      console.groupEnd();
    }
    
    if (info.performance.errorCount > 0) {
      console.group('🚨 Recent Errors');
      this.errors.slice(-5).forEach(error => console.log('- ' + error));
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  clearErrors() {
    this.errors = [];
    this.warnings = [];
    this.kvErrors = [];
  }

  // Get suggestions for common issues
  getSuggestions(): string[] {
    const suggestions: string[] = [];
    const info = this.getDebugInfo();

    if (!info.kvStore.connected) {
      suggestions.push('KV Store access is forbidden - this is normal for local development');
      suggestions.push('Mock data is being used instead of persistent storage');
    }

    if (info.performance.errorCount > 10) {
      suggestions.push('High error count detected - check console for details');
    }

    if (info.performance.loadTime > 5000) {
      suggestions.push('Slow load time - consider optimizing assets or network requests');
    }

    return suggestions;
  }
}

export const debugManager = new DebugManager();

// Auto-print debug info in development mode after a delay
if (import.meta.env.DEV) {
  setTimeout(() => {
    debugManager.printDebugReport();
    const suggestions = debugManager.getSuggestions();
    if (suggestions.length > 0) {
      console.group('💡 Debug Suggestions');
      suggestions.forEach(suggestion => console.log('- ' + suggestion));
      console.groupEnd();
    }
  }, 3000);
}

// Add to window for manual debugging
if (typeof window !== 'undefined') {
  (window as any).debug = debugManager;
}