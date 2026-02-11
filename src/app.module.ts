import { Module } from '@nestjs/common';
import { PostsModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';
import {PrismaModule} from './prisma/prisma.module'

@Module({
  imports: [PostsModule, CommentsModule , PrismaModule],
})
export class AppModule {}
