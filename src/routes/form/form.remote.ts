import { form } from '$app/server';
import z from 'zod';

const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
    createPassword: z.string().min(8),
    text: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    file: z.file(),
    color: z.string(),
    toggle: z.boolean(),
    checkbox: z.boolean(),
    select: z.string()
});

export const remoteForm = form(schema, () => {});
