import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { LoggerService } from '../../../logger/logger.service';
import * as moment from 'moment';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) { } // 注入 LoggerService，引入日志服务

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, params, query, body, headers } = request;
    const dates = ['createTime', 'updateTime', 'publishTime']

    // 记录请求的基本信息
    this.logger.log('请求信息', {
      method,
      url,
      params,
      query,
      body,
      headers,
      message: '请求信息',
    });

    return next.handle().pipe(
      tap((data) => {
        // 记录请求的响应时间和状态
        this.logger.log('响应信息', {
          url,
          method,
          statusCode: data?.statusCode || 200, // 默认 200 状态码
          responseTime: `${Date.now() - now}ms`,
          code: 200,
          message: '请求成功',
        });
      }),

      map(data => {
        const obj = data
        if (obj && typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              if (dates.includes(key)) {
                obj[key] = moment(value).format('YYYY-MM-DD HH:mm:ss')
              }
            }
          }
        }
        return {
          code: 200,
          data: obj,
          message: '请求成功',
        }
      })
    );
  }
}
