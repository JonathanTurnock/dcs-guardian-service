import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DcsServerClientService } from './dcs-server-client.service';
import { spawn } from 'child_process';
import { pathExistsSync } from 'fs-extra';
import { ConfigService } from '@nestjs/config';

const psList = require('ps-list');
const fkill = require('fkill');

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

  async stop(): Promise<boolean> {
    const dcsProcess = await this.getDcsProcess();
    if (dcsProcess) {
      await fkill(dcsProcess.pid, { force: true });
      this.logger.log('Successfully killed DCS.exe');
      return true;
    } else {
      this.logger.log('No DCS.exe process running');
      return false;
    }
  }

  async start(): Promise<{
    pid: number;
    ppid: number;
    name: string;
  } | void> {
    if (await this.getDcsProcess()) {
      return;
    }

    return new Promise((resolve, reject) => {
      const pathToDcs = this.configService.get('dcsServer.launcher');

      this.logger.debug(`DCS Exe Path: ${pathToDcs}`);
      const exeExists = pathExistsSync(pathToDcs);
      if (!exeExists) {
        this.logger.error(
          `${pathToDcs} is not a valid application path, failed to launch`,
        );
        reject(
          new Error(
            `${pathToDcs} is not a valid application path, failed to launch`,
          ),
        );
      }
      const child = spawn(pathToDcs, {
        detached: true,
        stdio: [
          'ignore' /* stdin */,
          'ignore' /* stdout */,
          'ignore' /* stderr */,
        ],
      });
      child.unref();
      this.getDcsProcess().then(resolve);
    });
  }

  public async getDcsProcess(): Promise<{
    pid: number;
    ppid: number;
    name: string;
  } | void> {
    const processes = await psList({ all: true });
    return processes.find(
      ({ name }) => name === this.configService.get('dcsServer.processName'),
    );
  }
}
