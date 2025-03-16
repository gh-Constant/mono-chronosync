// Cookie consent types
export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Default cookie consent (only necessary cookies allowed)
const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false
};

/**
 * Cookie Service - Manages cookie consent and provides utility functions
 */
class CookieService {
  private readonly CONSENT_KEY = 'cookie-consent';
  
  /**
   * Get the current cookie consent settings
   */
  getConsent(): CookieConsent {
    try {
      const savedConsent = localStorage.getItem(this.CONSENT_KEY);
      if (!savedConsent) return { ...defaultConsent };
      
      return { ...defaultConsent, ...JSON.parse(savedConsent) };
    } catch (e) {
      console.error('Error parsing cookie consent:', e);
      return { ...defaultConsent };
    }
  }
  
  /**
   * Save cookie consent settings
   */
  saveConsent(consent: CookieConsent): void {
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
  }
  
  /**
   * Check if a specific cookie category is allowed
   */
  isAllowed(category: keyof CookieConsent): boolean {
    const consent = this.getConsent();
    return consent[category];
  }
  
  /**
   * Clear all cookies except necessary ones
   * This should be called when a user revokes consent
   */
  clearNonEssentialCookies(): void {
    const consent = this.getConsent();
    
    // If analytics is not allowed, clear analytics cookies
    if (!consent.analytics) {
      // Clear analytics cookies (e.g., Google Analytics)
      this.deleteCookie('_ga');
      this.deleteCookie('_gid');
      this.deleteCookie('_gat');
    }
    
    // If marketing is not allowed, clear marketing cookies
    if (!consent.marketing) {
      // Clear marketing cookies (examples)
      this.deleteCookie('_fbp');
      this.deleteCookie('_gcl_au');
    }
    
    // If preferences is not allowed, clear preferences cookies
    if (!consent.preferences) {
      // Clear preferences cookies (examples)
      this.deleteCookie('theme');
      this.deleteCookie('language');
    }
  }
  
  /**
   * Delete a specific cookie by name
   */
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  /**
   * Set a cookie with the specified name, value, and expiration days
   */
  setCookie(name: string, value: string, days: number = 30, category: keyof CookieConsent = 'necessary'): boolean {
    // Only set the cookie if the category is allowed
    if (!this.isAllowed(category) && category !== 'necessary') {
      return false;
    }
    
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    return true;
  }
  
  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  /**
   * Check if consent has been given
   */
  hasConsent(): boolean {
    return localStorage.getItem(this.CONSENT_KEY) !== null;
  }
}

export const cookieService = new CookieService(); 