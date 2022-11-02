import { Body, Controller, Post } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly http: HttpService,
  ) { }

  @Post()
  async getBody(
    @Body() body: any,
    @RealIP() ip: string,
  ) {
    const { payload, eventType } = body;
    await this.http.axiosRef.post(process.env.FXG_URL, { payload: body, ip: ip.substring(7) })
    console.log(`post body: ${JSON.stringify(body)}, ip: ${ip}`);
    return `${JSON.stringify({ tinyCode: "C-C5AC", body: body })}`;
  }
}