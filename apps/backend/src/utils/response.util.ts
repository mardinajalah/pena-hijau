import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary?: Record<string, any>;
  error?: string;
  details?: any[];
}

export class ResponseUtil {
  static sendSuccess<T>(
    res: Response,
    statusCode: number = 200,
    message: string,
    data?: T,
    meta?: { pagination?: ApiResponse['pagination']; summary?: Record<string, any> },
  ) {
    const payload: ApiResponse<T> = {
      success: true,
      statusCode,
      message,
      ...(data !== undefined && { data }),
      ...(meta?.pagination && { pagination: meta.pagination }),
      ...(meta?.summary && { summary: meta.summary }),
    };

    return res.status(statusCode).json(payload);
  }

  static sendError(
    res: Response,
    statusCode: number = 400,
    message: string,
    error: string = 'Bad Request',
    details?: any[],
  ) {
    const payload: ApiResponse = {
      success: false,
      statusCode,
      error,
      message,
      ...(details && { details }),
    };

    return res.status(statusCode).json(payload);
  }
}
