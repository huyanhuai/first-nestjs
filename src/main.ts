import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe  } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api"); // 设置全局路由前缀
  // 启用CORS
  app.enableCors();
  // app.enableCors({
  //   origin: '<http://example.com>', // 只有来自 <http://example.com> 的请求才被允许
  // });

  // 注册全局 logger 拦截器
  const loggerService = app.get(LoggerService);
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(loggerService));

  // 注册全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 设置swagger文档
  const options = new DocumentBuilder()
    .setTitle('管理后台API')
    .setDescription('管理后台API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
