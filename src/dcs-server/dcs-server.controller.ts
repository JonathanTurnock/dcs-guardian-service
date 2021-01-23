import { Controller, Get } from '@nestjs/common';
import { DcsServerProcessMonitorService } from './dcs-server-process-monitor.service';

@Controller('server')
export class DcsServerController {
  constructor(private pms: DcsServerProcessMonitorService) {}

  @Get('stop')
  async stop() {
    await this.pms.stop();
  }

  @Get('start')
  async start() {
    await this.pms.start();
  }
}
