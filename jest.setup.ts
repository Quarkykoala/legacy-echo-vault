import '@testing-library/jest-dom';
import { URL } from 'url';
import 'cross-fetch/polyfill';

// Mock window.URL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(),
    revokeObjectURL: jest.fn(),
  },
});

// Mock the MediaRecorder API
class MockMediaRecorder {
  start() {}
  stop() {}
  addEventListener() {}
  removeEventListener() {}
}

global.MediaRecorder = MockMediaRecorder as any;

// Suppress console errors during tests
console.error = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as any;

// JSDOM 20+ finally includes URL but many CI nodes are older
// So force it:
(global as any).URL = URL;

// Setup any additional test environment configuration here 