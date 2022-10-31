import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RealIP } from 'nestjs-real-ip';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly http: HttpService,
  ) { }

  @Post()
  async getHello(
    @Body() body: any,
    @RealIP() ip: string,
  ) {
    console.log(`post body: ${JSON.stringify(body)}`);
    const { payload, eventType } = body;
    // await this.http.axiosRef.post(process.env.FXG_URL, { eventType, payload, ip: ip.substring(7) })
    return `${JSON.stringify({ tinyCode: "C-C5AC", body: body })}`;
  }
}