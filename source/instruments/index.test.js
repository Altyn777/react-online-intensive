// Core
import {sum, delay, getUniqueID, getFullApiUrl} from './';

// jest.setTimeout(10000);

describe('instruments:', () => {
    test('sum function should be a function', () => {
        expect(sum).toBeInstanceOf(Function);
    });

    test('sum f should throw, when called with non-number type as second arg', () => {
        expect(()=> sum(2, 'hello')).toThrow();
    });

    test('sum f should throw, when called with non-number type as first arg', () => {
        expect(()=> sum('hello', 2)).toThrow();
    });

    test('sum f should return an addition of 2 args', () => {
        expect(sum(2, 3)).toBe(5);
        // expect(sum(1, 8)).toBe(9);
        expect(sum(1, 8)).toMatchSnapshot();
    });

    test('delay f should return a resolved promise', async () => {
        await expect(delay()).resolves.toBeUndefined();
    });

    test('getUniqueID f should be a f', () => {
        expect(getUniqueID).toBeInstanceOf(Function);
    });

    test('getUniqueID f should throw, when called with non-number type as an argument', () => {
        expect(()=> getUniqueID('hi')).toThrow();
    });

    test('getUniqueID f should produce a string of a desired given length', () => {
        expect(typeof getUniqueID()).toBe('string');
        expect(getUniqueID(5)).toHaveLength(5);
        expect(getUniqueID(13)).toHaveLength(13);
    });

    test('getFullApiUrl should be a func', () => {
        expect(getFullApiUrl).toBeInstanceOf(Function);
    });

    test('getFullApiUrl should throw when 1 arg is not sting', () => {
        expect(() => getFullApiUrl(4, 'abc')).toThrow();
    });

    test('getFullApiUrl should throw when 2 arg is not sting', () => {
        expect(() => getFullApiUrl('abc', 4)).toThrow(); // теперь есть что коммитить
    });

    test('getFullApiUrl should return proper url', () => {
        expect(getFullApiUrl('123', 'abc')).toBe('123/abc');
        expect(getFullApiUrl('api', 'group_id')).toBe('api/group_id');
    });
});
