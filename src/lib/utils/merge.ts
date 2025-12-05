import clsx, { type ClassArray } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** `twMerge(clsx(classes))` */
export const merge = (...classes: ClassArray) => {
    return twMerge(clsx(classes));
};
