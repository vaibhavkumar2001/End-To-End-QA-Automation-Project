import { z } from 'zod';

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});

export const authResponseSchema = z.object({
  token: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;