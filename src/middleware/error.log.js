export function errorHandler(error, req, res, next) {
    req.logger.error(error.message)
    next(error)
  }