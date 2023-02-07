// @ts-nocheck
global.console = {
    log: console.log, // console.log are kept in tests for debugging

    // Mock other console functions so they don't pollute the console when running test
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

jest.setTimeout(20000);
