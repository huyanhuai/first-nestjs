import { HttpExceptionFilter } from './http-exception.filter';
import { LoggerService } from '../../../logger/logger.service';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter(new LoggerService())).toBeDefined();
  });
});
