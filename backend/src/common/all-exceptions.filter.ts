import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

// TEMPORARY: surfaces the real error message in the JSON response (instead
// of the generic "Internal server error") so it shows up directly in the
// browser console via the frontend's fetch error, without needing to dig
// through Vercel's runtime logs. Remove once the production DB connection
// issue is diagnosed.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    this.logger.error(exception);
    const message = exception instanceof Error ? `${exception.name}: ${exception.message}` : 'Unknown error';
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}
