import { z } from 'zod/v3';

// Required String
export const requiredString = (fieldName: string) =>
    z.string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(255, "Too long, must be at most 255 characters")

// Optional String
export const optionalString = (fieldName: string) => 
    z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '' ? null : val),
        z.string()
        .trim()
        .max(255, "Too long, must be at most 255 characters")
        .nullable()
        .optional()
    ).describe('Optional string, stored as null if empty string');

// Required Integer Number
export const requiredIntegerNumber = (fieldName: string) =>
    z.coerce.number({
        // invalid_type_error: `${fieldName} must be a number`,
    })
    .int(`${fieldName} must be an integer`)
    .min(0, `${fieldName} must be greater or equal to 0`)
    .refine((val) => !isNaN(val), {
        message: `${fieldName} is required`,
    });

// Optional Integer Number
export const optionalIntegerNumber = (fieldName: string) => 
    z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '' ? null : val),
        z.coerce.number({
            invalid_type_error: `${fieldName} must be a number`,
        })
        .int(`${fieldName} must be an integer`)
        .min(0, `${fieldName} must be greater or equal to 0`)
        .nullable()
        .optional()
    ).describe('Optional integer number, stored as null if empty string');
    

// Required Enum
export const requiredEnum = <T extends Record<string, string>>(
    enumValues: T, 
    fieldName: string
) =>
    z.nativeEnum(enumValues, {
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be one of: ${Object.values(enumValues).join(', ')}`,
    });

// Optional Enum
export const optionalEnum = <T extends Record<string, string>>(
    enumValues: T, 
    fieldName: string
) => 
    z.nativeEnum(enumValues, {
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be one of: ${Object.values(enumValues).join(', ')}`,
    })
    .optional();

// Required Url
export const requiredUrl = (fieldName: string) =>
    z.string()
    .trim()
    .min(1, `${fieldName} is required`)
    .url()
    .max(255, "Too long, must be at most 255 characters")

// Optional Url
export const optionalUrl = (fieldName: string) =>
    z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '' ? null : val),
        z.string()
        .trim()
        .url()
        .max(255, "Too long, must be at most 255 characters")
        .nullable()
        .optional()
    ).describe('Optional Url, stored as null if empty string');

// Optional String Array
export const optionalStringArray = (fieldName: string) => z
    .array(z
        .string({
            invalid_type_error: `Each item in ${fieldName} must be a string`,
        })
        .trim()
        .min(1, `Each item must contain non-space character(s)`)
        .max(255, "Item must be at most 255 characters"),
        {
            invalid_type_error: `${fieldName} must be an array of strings`,
        }
    )   
    .optional()

// Required Number Array
export const requiredNumberArray = (fieldName: string) => z
    .array(z
        .number({
            invalid_type_error: `Each item in ${fieldName} must be an integer number`,
        })
        .int()
        .positive(),
        {
            required_error: `${fieldName} is required`,
            invalid_type_error: `${fieldName} must be an array of numbers`,
        }
    )
    .min(1, `At least one ${fieldName} is required`);

// Optional Number Array
export const optionalNumberArray = (fieldName: string) => z
    .array(z
        .number({
            invalid_type_error: `Each item in ${fieldName} must be an integer number`,
        })
        .int()
        .positive(), 
        {
            invalid_type_error: `${fieldName} must be an array of numbers`,
        }
    )
    .optional();

export const email = (fieldName: string) => 
    z.string()
    .email()
    .min(1, `${fieldName} is required`)
    .max(255, "Too long, must be at most 255 characters");