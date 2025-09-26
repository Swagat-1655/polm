// Performance optimization utilities

// Debounce function to limit the rate of function calls
export const debounce = (func, wait) => {
  let timeout;
  const executedFunction = function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  executedFunction.cancel = () => {
    clearTimeout(timeout);
  };
  
  return executedFunction;
};

// Throttle function to limit function calls per time period
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }
  
  // Fallback for browsers without IntersectionObserver
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };
};

// Memory usage monitoring (development only)
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'performance' in window && 'memory' in performance) {
    const memory = performance.memory;
    console.log({
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    });
  }
};

// Cleanup function for component unmount
export const createCleanupHandler = () => {
  const handlers = [];
  
  return {
    add: (handler) => handlers.push(handler),
    cleanup: () => {
      handlers.forEach(handler => {
        try {
          handler();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      });
      handlers.length = 0;
    }
  };
};

// Check if device has good performance capabilities
export const isHighPerformanceDevice = () => {
  // Check for hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 1;
  
  // Check for device memory (in GB)
  const memory = navigator.deviceMemory || 1;
  
  // Consider device high performance if it has 4+ cores and 4+ GB RAM
  return cores >= 4 && memory >= 4;
};

// Optimize animations based on device performance
export const getOptimizedAnimationConfig = () => {
  const isHighPerf = isHighPerformanceDevice();
  const reduceMotion = prefersReducedMotion();
  
  return {
    enabled: !reduceMotion,
    duration: reduceMotion ? 0 : (isHighPerf ? 'normal' : 'reduced'),
    complexity: isHighPerf ? 'high' : 'low'
  };
};
