import { Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'src/common/public.decorator';
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-251d1463123a41e0add3d3566f5782ce'
});

async function main(content = '') {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "deepseek-chat",
    stream: false,
  });
  // console.log(completion);
  console.log(completion.choices[0].message.content);
  return completion
}

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

  @Get('system')
  @Public()
  async getAi(@Query() query) {
    const { content } = query;
    return await main(content);
  }
}
