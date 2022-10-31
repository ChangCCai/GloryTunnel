import { NextFunction, Request, Response } from 'express';
import * as xml2js from 'xml2js';

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class XMLMiddleware implements NestMiddleware {
  private typeRegEx = /^(text\/xml|application\/([\w!#\$%&\*`\-\.\^~]+\+)?xml)$/i;

  constructor(
  ) {
  }

  use(req: Request, res: Response, next: NextFunction) {
    let data = '';

    if (!this.hasBody(req) || !this.isXML(req)) {
      return next();
    }

    req.setEncoding('utf-8');
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      if (data.trim().length === 0) {
        next(new HttpException(`${XMLMiddleware.name} error`, HttpStatus.LENGTH_REQUIRED));
      }

      req.body = this.xml2JSON(data);
      next();
    });
  }

  private hasBody(req: Request) {
    const encoding = 'transfer-encoding' in req.headers;
    const length = 'content-length' in req.headers && req.headers['content-length'] !== '0';
    return encoding || length;
  }

  private isXML(req: Request) {
    const contentType = req.headers['content-type'] || '';
    const contentTypesArray = contentType.split(';')[0];
    return this.typeRegEx.test(contentTypesArray);
  }

  private xml2JSON(xml: string) {
    let body;
    const rawXML: string = xml.substring(xml.indexOf('<SOAP-ENV:Body>') + 15, xml.indexOf('</SOAP-ENV:Body>'));
    const parser = new xml2js.Parser();

    parser.parseString(rawXML, function (err, result) {
      body = result;
    });

    const eventType = Object.keys(body['ns2:BbxEventRequest']).filter(key => key.includes('Event') || key.includes('Response'));

    body[eventType[0]] = body['ns2:BbxEventRequest'];
    delete body['ns2:BbxEventRequest'];

    console.log(`post processed body: ${JSON.stringify(body)}, eventType: ${eventType}`);
    return { eventType: eventType[0], payload: body };
  }
}
