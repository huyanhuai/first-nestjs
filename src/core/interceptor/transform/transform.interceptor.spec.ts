import { TransformInterceptor } from './transform.interceptor';
import { LoggerService } from '../../../logger/logger.service';

describe('TransformInterceptor', () => {
  it('should be defined', () => {
    expect(new TransformInterceptor(new LoggerService())).toBeDefined();
  });
});
