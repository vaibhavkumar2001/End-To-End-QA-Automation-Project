import { test as base } from '@playwright/test'
import { BookingClient } from '../api/BookingClient'


type ApiFixtures = {
    bookingClient: BookingClient;
    authToken: string;
}

export const test = base.extend<ApiFixtures>({
    bookingClient: async ({ request }, use) => {
        await use(new BookingClient(request))
    },
    authToken: async ({ bookingClient }, use) => {
        await use(await bookingClient.getToken())
    }
})


export { expect } from '@playwright/test';