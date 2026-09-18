import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  // No CR/LF: without this, a subject containing "\r\n" could be used for
  // email header injection once it reaches the mail API.
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200)
    .refine((v) => !/[\r\n]/.test(v), 'Subject cannot contain line breaks'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
