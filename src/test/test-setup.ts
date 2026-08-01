import '@testing-library/jest-dom';
import '../i18n';

/** jsdom does not provide IntersectionObserver; stub it for infinite-scroll hook tests. */
if (typeof IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}
