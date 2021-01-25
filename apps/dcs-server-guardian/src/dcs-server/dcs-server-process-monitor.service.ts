import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DcsServerClientService } from './dcs-server-client.service';
import { ConfigService } from '@nestjs/config';
import {
  ProcessInfo,
  startDcs,
  stopDcs,
  TaskActionResult,
} from './processActions';

@Injectable()
export class DcsServerProcessMonitorService {
  private readonly logger = new Logger(DcsServerProcessMonitorService.name);

  constructor(
    private dcsServerClientService: DcsServerClientService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkRunning() {
    this.logger.debug('Checking if DCS Server is Running');
    try {
      const isRunning = await this.dcsServerClientService.isRunning();
      if (!isRunning) {
        this.logger.warn('DCS Server is not running, attempting to start');
        await this.kick();
      } else {
        this.logger.debug('DCS Server is Running');
      }
    } catch (e) {
      this.logger.error(
        `Failed to get the DCS Server Status due to ${e.message}, attempting to restart`,
      );
      await this.kick();
      this.logger.log('Kicked DCS Server 🦶');
    }
  }

  async kick() {
    this.logger.log('Killing DCS.exe');
    await this.stop();
    this.logger.log('Starting DCS.exe');
    await this.start();
  }

  async stop(): Promise<TaskActionResult<'STOPPED' | 'NOT_RUNNING', void>> {
    const stopResult = await stopDcs();
    switch (stopResult.resultInfo) {
      case 'NOT_RUNNING':
        this.logger.log('Failed to Stop DCS Server, not currently running');
        break;
      case 'STOPPED':
        this.logger.log('Successfully Stopped DCS Server');
    }
    return stopResult;
  }

  async start(): Promise<TaskActionResult<'STARTED' | 'RUNNING', ProcessInfo>> {
    const startResult = await startDcs(
      this.configService.get('dcsServer.launcher'),
    );
    switch (startResult.resultInfo) {
      case 'RUNNING':
        this.logger.log('Failed to Start DCS Server, already running');
        break;
      case 'STARTED':
        this.logger.log('Successfully Started DCS Server');
        break;
    }
    return startResult;
  }
}
