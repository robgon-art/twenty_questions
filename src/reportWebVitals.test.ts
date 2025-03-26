import reportWebVitals from './reportWebVitals';

// Mock the dynamic import
jest.mock('web-vitals', () => ({
    getCLS: jest.fn(),
    getFID: jest.fn(),
    getFCP: jest.fn(),
    getLCP: jest.fn(),
    getTTFB: jest.fn()
}));

// Get the mocked functions
const webVitals = jest.requireMock('web-vitals');

describe('reportWebVitals', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not call web-vitals functions when no callback is provided', () => {
        reportWebVitals();
        expect(webVitals.getCLS).not.toHaveBeenCalled();
        expect(webVitals.getFID).not.toHaveBeenCalled();
        expect(webVitals.getFCP).not.toHaveBeenCalled();
        expect(webVitals.getLCP).not.toHaveBeenCalled();
        expect(webVitals.getTTFB).not.toHaveBeenCalled();
    });

    it('should not call web-vitals functions when callback is not a function', () => {
        reportWebVitals('not a function' as any);
        expect(webVitals.getCLS).not.toHaveBeenCalled();
        expect(webVitals.getFID).not.toHaveBeenCalled();
        expect(webVitals.getFCP).not.toHaveBeenCalled();
        expect(webVitals.getLCP).not.toHaveBeenCalled();
        expect(webVitals.getTTFB).not.toHaveBeenCalled();
    });
}); 