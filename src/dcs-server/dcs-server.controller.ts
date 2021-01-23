import { Controller, Get } from '@nestjs/common';
import { DcsServerProcessMonitorService } from './dcs-server-process-monitor.service';

@Controller('server')
export class DcsServerController {
  constructor(private pms: DcsServerProcessMonitorService) {}

  @Get('stop')
  async stop() {
    return await this.pms.stop();
  }

  @Get('start')
  async start() {
    return await this.pms.start();
  }
}
