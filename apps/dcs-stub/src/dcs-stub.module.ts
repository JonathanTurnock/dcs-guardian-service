import { Module } from '@nestjs/common';
import { DcsStubController } from './dcs-stub.controller';

@Module({
  imports: [],
  controllers: [DcsStubController],
  providers: [],
})
export class DcsStubModule {}
