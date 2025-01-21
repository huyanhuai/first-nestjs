import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        // 获取路由角色
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        // 读取user
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        // 判断用户的角色是否包含和roles相同的角色列表，返回一个布尔类型
        const hasRoles = roles.some((role) => role === user.role);
        if (!hasRoles) {
            throw new UnauthorizedException('您没有权限');
        }
        return hasRoles;
    }
}