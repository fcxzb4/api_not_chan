import { Module } from '@nestjs/common';
import { PostsModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PostsModule, CommentsModule],
})
export class AppModule {}
