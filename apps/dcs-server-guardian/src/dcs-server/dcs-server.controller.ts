import { Controller, Get } from '@nestjs/common';
import { DcsServerProcessMonitorService } from './dcs-server-process-monitor.service';

@Controller('server')
export class DcsServerController {
  constructor(private pms: DcsServerProcessMonitorService) {}

  @Get('stop')
  async stop() {
    const stopResult = await this.pms.stop();
    return {
      result: stopResult
        ? 'Successfully Stopped DCS.exe'
        : 'DCS.exe Not Running',
    };
  }

  @Get('start')
  async start() {
    const startResult = await this.pms.start();
    return {
      result: startResult
        ? 'Successfully Started DCS.exe'
        : 'DCS.exe is already running',
      processInfo: startResult,
    };
  }
}
