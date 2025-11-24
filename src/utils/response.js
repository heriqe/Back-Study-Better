/**
 * Utility to standardize API responses.
 * Exports: sendSuccess(res, data, status = 200, message = "")
 *          sendError(res, message, status = 400, data = null, extras = {})
 */
const response = (res, status = 200, success = true, message = "", data = null, extras = {}) => {
  const payload = { success, message, ...extras };
  if (data != null) payload.data = data;
  return res.status(status).json(payload);
};

const sendSuccess = (res, data = null, status = 200, message = "") => {
  return response(res, status, true, message, data);
};

const sendError = (res, message = "Erro", status = 400, data = null, extras = {}) => {
  return response(res, status, false, message, data, extras);
};

// export the response function as default for backward compatibility
response.sendSuccess = sendSuccess;
response.sendError = sendError;

module.exports = response;
