// Apple AI Privacy-Guard: The Core Watchman Engine
// This script intercepts outgoing network payloads to third-party AI models local on-device.

const SENSITIVE_PATTERNS = {
  aadhaar: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/, // 12-digit Indian Aadhaar pattern
  creditCard: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/,
  email: /[a-zA-O0-9._%+-]+@[a-zA-O0-9.-]+\.[a-zA-Z]{2,}/
};

// Listen to network requests sent to Generative AI endpoints (ChatGPT, Claude, etc.)
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === "POST" && details.requestBody && details.requestBody.formData) {
      let rawPromptText = JSON.stringify(details.requestBody.formData);
      
      // Real-time local security scanning
      for (let key in SENSITIVE_PATTERNS) {
        if (SENSITIVE_PATTERNS[key].test(rawPromptText)) {
          console.warn(`[PRIVACY SHIELD BLOCK]: Unauthorized ${key} upload intercepted!`);
          
          // Trigger local browser notification and log event on our dashboard UI
          chrome.runtime.sendMessage({
            event: "LEAK_INTERCEPTED",
            type: key,
            timestamp: Date.now()
          });

          // BLOCK THE REQUEST NATIVELY BEFORE LEAVING THE SAFARI BROWSER LAYER
          return { cancel: true }; 
        }
      }
    }
    return { cancel: false };
  },
  { urls: ["*://*://*", "*://*://*", "*://*.claude.ai/*", "*://*://*"] },
  ["blocking", "requestBody"]
);
