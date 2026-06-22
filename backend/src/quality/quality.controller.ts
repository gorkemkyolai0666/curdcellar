import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QualityService } from './quality.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quality-checks')
@UseGuards(JwtAuthGuard)
export class QualityController {
  constructor(private qualityService: QualityService) {}

  @Get()
  findAll(@Query('batchId') batchId?: string) {
    if (batchId) return this.qualityService.findByBatch(batchId);
    return this.qualityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualityService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.qualityService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualityService.remove(id);
  }
}
