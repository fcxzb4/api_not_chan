import { Module } from '@nestjs/common';
import { JwtStrategy } from './events.gateaway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [JwtStrategy]
})
export class EventsModule {}