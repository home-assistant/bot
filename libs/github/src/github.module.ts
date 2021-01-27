import { Module } from '@nestjs/common';
import { GithubService } from './github.service';

@Module({
  exports: [GithubService],
  providers: [GithubService],
})
export class GithubModule {}
