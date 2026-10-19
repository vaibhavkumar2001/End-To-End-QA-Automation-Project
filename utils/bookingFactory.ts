import { faker } from '@faker-js/faker';
//faker real coustomer nhi h yeh testing ke liye imaginary data banata h
import { Booking } from '../api/schemas';

const toDate = (d: Date) => d.toISOString().split('T')[0];

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.future();
  const checkout = new Date(checkin.getTime() + 3 * 24 * 60 * 60 * 1000);

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 100, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: { checkin: toDate(checkin), checkout: toDate(checkout) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}