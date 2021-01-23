import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DcsServerClientService } from './dcs-server-client.service';
import { exec, spawn } from 'child_process';
import { pathExistsSync } from 'fs-extra';
import { ConfigService } from '@nestjs/config';

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
    const stopResult = await this.stop();
    stopResult.stdout && this.logger.log(stopResult.stdout);
    stopResult.stderr && this.logger.warn(stopResult.stderr);
    this.logger.log('Starting DCS.exe');
    await this.start();
  }

  async stop(): Promise<{ stdout: any; stderr: any; error?: any }> {
    return new Promise((resolve) => {
      exec(
        `taskkill /F /IM "${this.configService.get('dcsServer.processName')}"`,
        (error, stdout, stderr) => {
          if (error) {
            resolve({ stdout, stderr, error });
          } else {
            resolve({ stdout, stderr });
          }
        },
      );
    });
  }

  async start(): Promise<boolean> {
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
      resolve(true);
    });
  }
}
