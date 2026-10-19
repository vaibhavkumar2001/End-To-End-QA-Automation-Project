import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from './schemas'

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async getToken(): Promise<string> {
    const response = await this.login(process.env.API_USER!, process.env.API_PASSWORD!);
    const body = await response.json();
    return body.token;
  }

  async create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async remove(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
}