import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchController {
  constructor(private batchService: BatchService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.batchService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.batchService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.batchService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.batchService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchService.remove(id);
  }
}
