import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../common/public.decorator';
import { JwtService } from '@nestjs/jwt';

// 用于全局守卫，将未携带 token 的接口进行拦截
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['token'];
    if (!accessToken) throw new UnauthorizedException('请先登录');
    const decode = this.jwtService.decode(accessToken); // 解析token
    if (!decode) throw new UnauthorizedException('token不正确');
    
    return super.canActivate(context);
  }
}