import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册用户
   * @param name 
   * @param password
   */
  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Public() // 忽略token验证
  @Post('/register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  /**
   * 登录
   * @param name 
   * @param password
   */
  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 201, type: [User] })
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('/login')
  login(@Body() user: CreateUserDto, @Req() req) {
    // return req.user;
    return this.userService.login(user);
  }

  /**
   * 获取用户信息
   */
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 201, type: [User] })
  @ApiBearerAuth() // swagger文档设置token
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/info')
  getUserInfo(@Req() req) {
    return req.user;
  }

}
