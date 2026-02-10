import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];

  findByPost(postId: number) {
    return this.comments.filter(
      (comment) => comment.postId === postId,
    );
  }

  create(createCommentDto: CreateCommentDto) {
    const newComment: Comment = {
      id: Date.now(),
      ...createCommentDto,
    };

    this.comments.push(newComment);
    return newComment;
  }
}
