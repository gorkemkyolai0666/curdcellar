import { Module } from '@nestjs/common';
import { AgingRoomController } from './aging-room.controller';
import { AgingRoomService } from './aging-room.service';

@Module({
  controllers: [AgingRoomController],
  providers: [AgingRoomService],
})
export class AgingRoomModule {}
