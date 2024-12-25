import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

    // 1. 固定路径：
  // 可以匹配到 get请求，http://localhost:3000/app/list
  @Get("list")
  getHello(): string {return 'Get'}

  @Post("list")
  create(): string {return 'Post'}

  // 2.通配符路径(?+* 三种通配符 )
  // 可以匹配到 get请求, http://localhost:3000/app/user_xxx
  @Get("user_*")
  getUser(){return "getUser"}

  // 3.带参数路径
  // 可以匹配到put请求，http://localhost:3000/app/list/xxxx
  @Put("list/:id")
  update(){ return "update"}
}
