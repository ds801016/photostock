// class ErrorResponse extends Error {
//   constructor(message, statusCode) {
//     super();
//     this.statusCode = statusCode || 500;
//     this.message = message;
//   }
// }

// module.exports = ErrorResponse;

const ErrorResponse = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  ErrorResponse,
};
