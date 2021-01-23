import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { DcsServerClientService } from './dcs-server-client.service';

@Injectable()
export class DcsServerHealthIndicator extends HealthIndicator {
  constructor(private dcsServerClient: DcsServerClientService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let isHealthy;
    let errors;
    try {
      isHealthy = await this.dcsServerClient.isRunning();
    } catch (e) {
      isHealthy = false;
      errors = e.message;
    }

    const result = this.getStatus('dcs-server', isHealthy, { errors });

    if (isHealthy) {
      return result;
    } else {
      throw new HealthCheckError('DCS Server Check Failed', result);
    }
  }
}
