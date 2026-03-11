// validator-url.js – Asynchronous URL validation

function isValidUrlFormat(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function browserSafeCheck(urlCheck) {
  // Placeholder / simulation – replace YOUR_API_KEY with real Google Safe Browsing key
  // In production, handle rate limits, caching, fallback
  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=YOUR_API_KEY`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'project-engine', clientVersion: '1.0.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url: urlCheck }]
          }
        })
      }
    );

    if (!response.ok) return false;
    const data = await response.json();
    return !data.matches || data.matches.length === 0;
  } catch (err) {
    console.warn('Safe Browsing check failed:', err);
    return false; // fail-closed
  }
}

async function validateUrl(urlCheck) {
  if (typeof urlCheck !== 'string' || !isValidUrlFormat(urlCheck)) {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Invalid URL format – must be http(s)://...']
    };
  }

  const sanitized = urlCheck.trim();
  const isSafe = await browserSafeCheck(sanitized);

  return {
    isValid: isSafe,
    sanitized,
    errors: isSafe ? [] : ['URL flagged as potentially unsafe']
  };
}
