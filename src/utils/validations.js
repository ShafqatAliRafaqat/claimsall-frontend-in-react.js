import validator from 'validator';

export const required = value => (value ? undefined : 'Required');

export const requiredPassword = edit => edit ? () => undefined : required;

export const fixLength = max => value =>
    value && (value.length > max || value.length < max) ? `Must be ${max} characters` : undefined;

export const fixLength3 = fixLength(3);

export const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const maxLength = max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength6 = minLength(6);

export const number = value =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const minValue = min => value =>
    value && value < min ? `Must be at least ${min}` : undefined;

export const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined;

export const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Only alphanumeric characters'
        : undefined;

export const alpha = value => /^[a-z ,.'-]+$/i.test(value) ? undefined : 'Only alphabetical characters are allowed';

export const phoneNumber = value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
        ? 'Invalid phone number, must be 10 digits'
        : undefined;

export const pakistanPhone = value => value && !/^[+]\d{2}?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/i.test(value) ? "Invalid Phone Number" : undefined;

export const pakistanCnic = value => value && !/^[1-7]{1}[0-9]{4}(-)?[0-9]{7}(-)?[0-9]{1}$/i.test(value) ? "Invalid CNIC" : undefined;

export const mapPoint = value => !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/i.test(value) ? "Must be a valid value" : undefined;

export const latitude = value => (value <= 90 && value >= -90) ? undefined : "Must be a valid latitude";

export const longitude = value => (value <= 180 && value >= -180) ? undefined : "Must be a valid longitude";

export const website = value => !value || validator.isURL(value + "") ? undefined : "Must be a URL";

export const integer = value => !value || validator.isInt(value + "") ? undefined : "Must be an Integer value";

