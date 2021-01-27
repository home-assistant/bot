import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { DiscordModule } from 'discord-nestjs';
import { GithubModule } from 'libs/github/src/github.module';
import { CommandEnforceAdr } from './commands/enforce_adr/enforce_adr.command';
import { CommandInfo } from './commands/info/info.command';

interface DiscordModuleConfigParams {
  token: string;
  commandPrefix: string;
  allowGuilds: string[];
}

interface DiscordModuleAsyncParams extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (...args: any[]) => DiscordModuleConfigParams | Promise<DiscordModuleConfigParams>;
  inject?: any[];
}

@Module({
  providers: [CommandEnforceAdr, CommandInfo],
  imports: [GithubModule],
})
export class DiscordBotModule {
  static forRootAsync(options: DiscordModuleAsyncParams): DynamicModule {
    return {
      module: DiscordBotModule,
      imports: [
        DiscordModule.forRootAsync({
          useFactory: options.useFactory,
          inject: options.inject || [],
        }),
      ],
    };
  }
}
