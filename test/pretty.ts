const zero = '0';

export function pretty(value: any) {
    switch (typeof value) {
        case 'number':
            if (Math.trunc(value) !== value) {
                return value.toString();
            }

            const digits = value.toString(16).substr(value < 0 ? 1 : 0);
            return `${value < 0 ? '-' : ''}0x${zero.substr((digits.length + 1) % 2)}${digits}`;
        case 'undefined':
            return 'undefined';
        default:
            return JSON.stringify(value);
    }
}
