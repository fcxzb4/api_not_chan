import { Controller, Get } from '@nestjs/common';
import { PostService } from "./post.service"

@Controller()
export class AppController {
  constructor(private readonly appService: PostService ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
