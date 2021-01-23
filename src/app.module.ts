import { HttpModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { DcsServerHealthIndicator } from './dcs-server/dcs-server-health.indicator';
import { DcsServerClientService } from './dcs-server/dcs-server-client.service';
import { DcsServerProcessMonitorService } from './dcs-server/dcs-server-process-monitor.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DcsServerController } from './dcs-server/dcs-server.controller';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [HealthController, DcsServerController],
  providers: [
    HealthService,
    DcsServerHealthIndicator,
    DcsServerClientService,
    DcsServerProcessMonitorService,
  ],
})
export class AppModule {}
