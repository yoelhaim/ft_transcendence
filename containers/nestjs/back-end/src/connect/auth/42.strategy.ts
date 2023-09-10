import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done: Function,
  ): Promise<any> {
    try {
        accessToken;
        refreshToken;
        const user = {
          firstName: profile.name.givenName,
          email: profile.emails[0].value,
          lastName: profile.name.familyName,
          avatar: profile._json.image.link,
          username: profile.username,
        };
        if (user == undefined || user == null) {
            throw new BadRequestException();
            }
        done(null, user);
      } catch (error) {
        throw new BadRequestException({
          statusCode: 403,
          message: 'error login Or sign up try again',
        });
      }
    }
}

