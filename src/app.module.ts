import { HealthModule } from '@app/health';
import { SentryModule } from '@app/sentry';
import { getVersionInfo } from '@app/version';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino/dist';

import Config, { AppConfig } from './config';
import { DiscordBotModule } from './discord/discord.module';

const devOptions = {
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
  },
};

const prodOptions = {
  autoLogging: false,
};

const version = getVersionInfo(__dirname);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => Config.getProperties()],
      isGlobal: true,
    }),
    DiscordBotModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        token: configService.get('discord.token'),
        commandPrefix: configService.get('discord.commandPrefix'),
        allowGuilds: configService.get('discord.allowGuilds').split(','),
      }),
    }),
    HealthModule.register({ version }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        dsn: configService.get('sentryDsn'),
        environment: configService.get('env'),
        release: version.version,
      }),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: configService.get<string>('env') === 'development' ? devOptions : prodOptions,
      }),
    }),
  ],
})
export class AppModule {}
