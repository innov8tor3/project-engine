// validator-text.js – Synchronous plain text validation

function sanitizeText(input) {
  return input
    .replace(/<[^>]*>/g, '')                    // Strip HTML tags
    .replace(/script|alert|prompt|confirm/gi, '') // Block obvious script attempts
    .trim();
}

function validatePlainText(textCheck) {
  if (typeof textCheck !== 'string' || textCheck.length === 0) {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Input must be a non-empty string']
    };
  }

  const sanitized = sanitizeText(textCheck);
  const isValid = sanitized === textCheck && sanitized.length <= 500;

  return {
    isValid,
    sanitized,
    errors: isValid ? [] : ['Input contains invalid characters or exceeds length limit']
  };
}
