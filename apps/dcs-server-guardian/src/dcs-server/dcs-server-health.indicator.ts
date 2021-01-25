import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { DcsServerClientService } from './dcs-server-client.service';
import { DcsServerProcessMonitorService } from './dcs-server-process-monitor.service';
import { getDcsProcess } from './processActions';

@Injectable()
export class DcsServerHealthIndicator extends HealthIndicator {
  constructor(
    private serverClient: DcsServerClientService,
    private serverProcessMonitor: DcsServerProcessMonitorService,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let isRunning;
    let process;
    let errors;
    try {
      isRunning = await this.serverClient.isRunning();
    } catch (e) {
      isRunning = false;
      errors = { ...errors, endpointCheck: e.message };
    }

    try {
      process = await getDcsProcess();
    } catch (e) {
      process = false;
      errors = { ...errors, processCheck: e.message };
    }

    if (!process) {
      errors = { ...errors, processCheck: 'Not Found' };
    }

    const isHealthy = isRunning && process;

    const result = this.getStatus('dcs-server', isHealthy, { process, errors });

    if (isHealthy) {
      return result;
    } else {
      throw new HealthCheckError('DCS Server Check Failed', result);
    }
  }
}
