import { Transform } from 'class-transformer';
export function MobileNumberTransform() {
    return Transform(({ value }) => {
        if (typeof value === 'string') {
            // Remove spaces and hyphens from the phone number
            return value.replace(/[\s-]/g, '');
        }
        return value;
    });
}