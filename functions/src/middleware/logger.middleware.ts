import { Request, Response, NextFunction } from "express";
import * as logger from "firebase-functions/logger";

/**
 * Middleware to log incoming requests
 *
 * @export
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export const loggerMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    logger.info(`${request.method} ${request.path}`, { structuredData: true });
    next();
};
