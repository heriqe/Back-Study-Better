/**
 * Utility to standardize API responses.
 *
 * Usage:
 *   response(res, 200, true, "Ok", { user });
 *   response(res, 400, false, "Erro", { errors: [...] });
 */
const response = (res, status = 200, success = true, message = "", data = null, extras = {}) => {
  const payload = { success, message, ...extras };
  if (data != null) payload.data = data;
  return res.status(status).json(payload);
};

module.exports = response;
