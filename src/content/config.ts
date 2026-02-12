import { defineCollection, z } from 'astro:content';

const boardCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    photo: z.string().optional(), // path to image in public folder
    email: z.string().email().optional(),
    order: z.number().default(99),
  }),
});

const communityCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    image: z.string(), // path to image
    caption: z.string(),
    type: z.enum(['pet', 'person', 'both']).default('pet'),
  }),
});

export const collections = {
  'board': boardCollection,
  'community': communityCollection,
};
