import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import { DcsServerHealthIndicator } from '../dcs-server/dcs-server-health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private hcs: HealthCheckService,
    private dcsServerIndicator: DcsServerHealthIndicator,
  ) {}

  getHealth() {
    return this.hcs.check([async () => this.dcsServerIndicator.isHealthy()]);
  }
}
