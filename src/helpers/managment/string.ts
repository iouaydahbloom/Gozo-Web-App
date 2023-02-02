export function ellipsisTruncate(input: string, maxChar: number) {
    if (input.length > maxChar) {
        return input.substring(0, maxChar) + '...';
    }
    return input;
};