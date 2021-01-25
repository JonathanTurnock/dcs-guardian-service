import { Controller, Get } from '@nestjs/common';
import { DcsServerProcessMonitorService } from './dcs-server-process-monitor.service';

const messages: Record<string, string> = {
  STOPPED: 'DCS Stopped',
  NOT_RUNNING: 'DCS Not Running',
  STARTED: 'DCS Server Started',
  RUNNING: 'DCS Server Already Running',
};

@Controller('server')
export class DcsServerController {
  constructor(private pms: DcsServerProcessMonitorService) {}

  @Get('stop')
  async stop() {
    const stopResult = await this.pms.stop();
    return {
      result: messages[stopResult.resultInfo],
    };
  }

  @Get('start')
  async start() {
    const startResult = await this.pms.start();
    return {
      result: messages[startResult.resultInfo],
      data: startResult.data,
    };
  }
}
