import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger, level } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info', // 默认日志级别
            format: format.combine(
                format.timestamp({ // 设置时间戳格式
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.printf(({ timestamp, level, message, ...metadata }) => {
                    // 确保时间戳在日志的最前面，并且处理metadata（如params）
                    let logMessage  = `${timestamp} ${level}: ${message}`;

                    // 如果有 metadata（附加的对象），将它们格式化为 JSON
                    if (Object.keys(metadata).length > 0) {
                        if (metadata.message !== 'message') {
                            logMessage += ` | ${JSON.stringify(metadata, null, 2)}`;
                        }
                    }
                    return logMessage;
                })
            ),
            transports: [
                // 控制台输出
                new transports.Console({
                    format: format.combine(
                        format.colorize(), // 控制台输出带颜色
                        format.simple() // 简单格式
                    )
                }),
                // 使用 daily-rotate-file 来实现按日期生成不同日志文件
                new transports.DailyRotateFile({
                    filename: 'logs/%DATE%.log', // 文件中包含日期
                    datePattern: 'YYYY-MM-DD', // 日期格式
                    // zippedArchive: true,
                    // maxSize: '20m',
                    maxFiles: '7d', // 最多保存7天的日志
                    level: 'info', // 日志级别
                    format: format.combine(
                        format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss'
                        }),
                        format.printf((info) => {
                            const paramsInfo = JSON.parse(JSON.stringify(info));
                            // 避免 message 字段在日志中作为 key 出现
                            delete paramsInfo.message;
                            return `${info.timestamp} [${info.level}] : ${info.message} 
                            ${Object.keys(info).length > 0 ? JSON.stringify(paramsInfo, null, 2) : ''}`;
                        })
                    )
                })
            ]
        });
    }

    log(message: string, params: object = {}) {
        if (typeof params === 'object' && Object.keys(params).length > 0) {
            // 如果 params 对象存在，则将日志以自定义格式输出
            const logMessage = {
                message,
                ...params,
                level: 'info'
            }
            this.logger.info(logMessage);
        } else {
            this.logger.info(message);
        }
    }

    error(message: string, params: object = {}, trace: string = '') {
        if (typeof params === 'object' && Object.keys(params).length > 0) {
            const logMessage = {
                message,
                ...params,
                level: 'error',
                trace // 如果有异常堆栈信息，可以添加到日志中
            }
            this.logger.error(logMessage);
        } else {
            this.logger.error(message);
        }
    }

    warn(message: string, params: object = {}) {
        if (typeof params === 'object' && Object.keys(params).length > 0) {
            const logMessage = {
                message,
                ...params,
                level: 'warn'
            }
            this.logger.warn(logMessage);
        } else {
            this.logger.warn(message);
        }
    }

    debug(message: string, params: object = {}) {
        if (typeof params === 'object' && Object.keys(params).length > 0) {
            const logMessage = {
                message,
                ...params,
                level: 'debug'
            }
            this.logger.debug(logMessage);
        } else {
            this.logger.debug(message);
        }
    }

    info(message: string, params: object = {}) {
        if (typeof params === 'object' && Object.keys(params).length > 0) {
            const logMessage = {
                message,
                ...params,
                level: 'info'
            }
            this.logger.info(logMessage);
        } else {
            this.logger.info(message);
        }
    }
}
