import '@testing-library/jest-dom';
import i18n from '../i18n';

// Tests assert on English copy; the app itself defaults to Italian.
i18n.changeLanguage('en');

/** jsdom does not provide IntersectionObserver; stub it for infinite-scroll hook tests. */
if (typeof IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}
