import { test, expect } from '../../fixtures/api';
import { buildBooking } from '../../utils/bookingFactory';
import {
  authResponseSchema,
  bookingSchema,
  createBookingResponseSchema,
} from '../../api/schemas';

test.describe('Booking API', () => {
  test('creates a booking and matches schema @smoke', async ({ bookingClient }) => {
    const payload = buildBooking();
    const response = await bookingClient.create(payload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(createBookingResponseSchema.safeParse(body).success).toBe(true);
    expect(body.booking.firstname).toBe(payload.firstname);
    expect(body.booking.totalprice).toBe(payload.totalprice);
  });

  test('fetches a created booking by id', async ({ bookingClient }) => {
    const payload = buildBooking();
    const created = await (await bookingClient.create(payload)).json();

    const response = await bookingClient.getById(created.bookingid);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(bookingSchema.safeParse(body).success).toBe(true);
    expect(body).toMatchObject({ firstname: payload.firstname, lastname: payload.lastname });
  });

  test('updates a booking with a valid token', async ({ bookingClient, authToken }) => {
    const created = await (await bookingClient.create(buildBooking())).json();
    const updated = buildBooking({ firstname: 'Updated' });

    const response = await bookingClient.update(created.bookingid, updated, authToken);
    expect(response.status()).toBe(200);
    expect((await response.json()).firstname).toBe('Updated');
  });

  test('deletes a booking and then gets 404', async ({ bookingClient, authToken }) => {
    const created = await (await bookingClient.create(buildBooking())).json();

    const deleteResponse = await bookingClient.remove(created.bookingid, authToken);
    // restful-booker returns 201 for a successful delete
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingClient.getById(created.bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test('update without a token is forbidden', async ({ bookingClient }) => {
    const created = await (await bookingClient.create(buildBooking())).json();

    const response = await bookingClient.update(created.bookingid, buildBooking());
    expect(response.status()).toBe(403);
  });

  test('fetching a non-existent booking returns 404', async ({ bookingClient }) => {
    const response = await bookingClient.getById(999999999);
    expect(response.status()).toBe(404);
  });
});

test.describe('Auth API', () => {
  test('valid credentials return a token', async ({ bookingClient }) => {
    const response = await bookingClient.login(process.env.API_USER!, process.env.API_PASSWORD!);
    expect(response.status()).toBe(200);
    expect(authResponseSchema.safeParse(await response.json()).success).toBe(true);
  });

  test('invalid credentials do not return a token', async ({ bookingClient }) => {
    const response = await bookingClient.login('admin', 'wrong-password');
    // This API quirk: it returns 200 with a reason instead of 401
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});