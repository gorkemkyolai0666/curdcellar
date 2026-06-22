import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AgingRoomService } from './aging-room.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('aging-rooms')
@UseGuards(JwtAuthGuard)
export class AgingRoomController {
  constructor(private agingRoomService: AgingRoomService) {}

  @Get()
  findAll() {
    return this.agingRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agingRoomService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.agingRoomService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.agingRoomService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agingRoomService.remove(id);
  }
}
