function asyncErrorBoundary(delegate, defaultStatus) {
  // Use a try/catch and a named function so the tracebacks are actually useful!
  return async function _errorBoundary(request, response, next) {
    try {
      return await delegate(request, response, next)
    } catch (err) {
      const { status = defaultStatus, message = err } = err;
      console.error(err)
      next({ status, message })
    }
  };
}

module.exports = asyncErrorBoundary;
