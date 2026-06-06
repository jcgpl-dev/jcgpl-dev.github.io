
export async function getEnhancedDeviceInfo() {
  const parser = new UAParser(navigator.userAgent);
  const result = parser.getResult();

  return {
    // Basic
    ip: "pending",                    
    timestamp: new Date().toISOString(),
    

    device: {
      model: result.device.model || "Unknown",
      type: result.device.type || "desktop",        
      vendor: result.device.vendor || "Unknown",
    },
    os: {
      name: result.os.name || "Unknown",
      version: result.os.version || "Unknown",
    },
    browser: {
      name: result.browser.name || "Unknown",
      version: result.browser.version || "Unknown",
      major: result.browser.major || "Unknown",
    },
    
    // Raw fallback
    userAgent: navigator.userAgent,
    
    // Screen & Display
    screen: {
      resolution: `${window.screen.width}x${window.screen.height}`,
      availResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation ? screen.orientation.type : "Unknown"
    },
    
    // Additional useful info
    language: navigator.language || navigator.userLanguage,
    languages: navigator.languages || [],
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || "Unknown", // CPU cores
    deviceMemory: navigator.deviceMemory || "Unknown",               // RAM (GB)
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    
    // Connection (if available)
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null
  };
}