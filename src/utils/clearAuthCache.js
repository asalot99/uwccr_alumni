// Utility to clear all authentication and user data caches
export const clearAllAuthCache = () => {
  console.log('🧹 Clearing all authentication cache...');
  
  // Clear all localStorage items related to Auth0 and user data
  const keysToRemove = [];
  
  // Find all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      // Remove Auth0 related keys
      if (key.includes('auth0') || 
          key.includes('@@auth0spajs@@') ||
          key.includes('userLocation_') ||
          key.includes('alumni_') ||
          key.includes('uwccr_')) {
        keysToRemove.push(key);
      }
    }
  }
  
  // Remove all identified keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed: ${key}`);
  });
  
  // Clear sessionStorage as well
  const sessionKeysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      if (key.includes('auth0') || 
          key.includes('@@auth0spajs@@') ||
          key.includes('userLocation_') ||
          key.includes('alumni_') ||
          key.includes('uwccr_')) {
        sessionKeysToRemove.push(key);
      }
    }
  }
  
  sessionKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`🗑️ Removed from session: ${key}`);
  });
  
  console.log(`✅ Cleared ${keysToRemove.length} localStorage items and ${sessionKeysToRemove.length} sessionStorage items`);
  
  // Force reload to ensure clean state
  window.location.reload();
};

// Function to clear cache and redirect to login
export const forceReauthentication = () => {
  clearAllAuthCache();
  // The page will reload and redirect to login due to the cleared auth state
};

// Auto-clear cache on app load (one-time cleanup)
export const performOneTimeCleanup = () => {
  console.log('🔄 Performing authentication cleanup...');
  
  // Clear all localStorage items related to Auth0 and user data
  const keysToRemove = [];
  
  // Find all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      // Remove Auth0 related keys
      if (key.includes('auth0') || 
          key.includes('@@auth0spajs@@') ||
          key.includes('userLocation_') ||
          key.includes('alumni_') ||
          key.includes('uwccr_') ||
          key.includes('auth_cleanup_performed')) {
        keysToRemove.push(key);
      }
    }
  }
  
  // Remove all identified keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed: ${key}`);
  });
  
  // Clear sessionStorage as well
  const sessionKeysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      if (key.includes('auth0') || 
          key.includes('@@auth0spajs@@') ||
          key.includes('userLocation_') ||
          key.includes('alumni_') ||
          key.includes('uwccr_')) {
        sessionKeysToRemove.push(key);
      }
    }
  }
  
  sessionKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`🗑️ Removed from session: ${key}`);
  });
  
  console.log(`✅ Cleared ${keysToRemove.length} localStorage items and ${sessionKeysToRemove.length} sessionStorage items`);
};
