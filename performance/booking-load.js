import http from 'k6/http'
import { check, sleep } from 'k6'


const BASE_URL = __ENV.API_BASE_URL || 'https://restful-booker.herokuapp.com';

export const options = {
  // Keep the load small: this is a shared public demo API
    vus: 5, // Ek saath 4 virtual users honge
    duration: '30s',
    thresholds: {
    http_req_failed: ['rate<0.05'],     // less than 5% failed requests
    http_req_duration: ['p(95)<1500'],  // 95% of requests under 1.5 s
  },
};


export default function () {
    //Read the Booking list
    const listRes = http.get(`${BASE_URL}/booking`);
    check(listRes, { 'list returns 200': (r) => r.status === 200 });

    // Write booking creation
    const payload = JSON.stringify({
        firstname: 'Load',
        lastname: 'Test',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
        additionalneeds: 'Breakfast',
    })
    const createRes = http.post(`${BASE_URL}/booking`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(createRes, {
        'create returns 200': (r) => r.status === 200,
        'create returns a booking id': (r) => String(r.body).includes('bookingid'),
    });

    sleep(1) // Har request ke baad 1 second wait karega
}