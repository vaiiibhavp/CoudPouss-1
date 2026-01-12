/**
 * Validation utilities
 */

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const mobileRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isValidMobile(mobile: string): boolean {
  return mobileRegex.test(mobile.replace(/\s/g, ''));
}

export function isValidEmailOrMobile(value: string): boolean {
  return isValidEmail(value) || isValidMobile(value);
}

export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateLoginForm(emailOrMobile: string, password: string): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!emailOrMobile.trim()) {
    errors.emailOrMobile = 'Email or Mobile Number is required';
  } else if (!isValidEmailOrMobile(emailOrMobile)) {
    errors.emailOrMobile = 'Please enter a valid email or mobile number';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const parseMobile = (value: string) => {
  const validCountryCodes = ["1", "44", "91", "61", "81"]; // add all you want

  const cleaned = value.replace(/\s|-/g, "");

  if (cleaned.startsWith("+")) {
    for (let code of validCountryCodes.sort((a, b) => b.length - a.length)) {
      // try longest codes first
      if (cleaned.startsWith(`+${code}`)) {
        return {
          countryCode: `+${code}`,
          mobile: cleaned.slice(code.length + 1), // remove + and code
        };
      }
    }
  }

  // Case 2: plain 10-digit mobile → default country (India)
  if (/^\d{10}$/.test(cleaned)) {
    return {
      countryCode: "+91",
      mobile: cleaned,
    };
  }

  return null;
};

export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
}

export const buildInputData = (emailOrMobile: string) => {
  if (isValidEmail(emailOrMobile)) {
    return { email: emailOrMobile };
  }

  const mobileData = parseMobile(emailOrMobile);
  if (mobileData) {
    return {
      mobile: mobileData.mobile,
      phone_country_code: mobileData.countryCode,
    };
  }

  throw new Error("Invalid email or mobile input");
};

export function validateSignupForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  mobileNo?: string;
  name?: string;
}): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (data.mobileNo && !isValidMobile(data.mobileNo)) {
    errors.mobileNo = 'Please enter a valid mobile number';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = isValidPassword(data.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (data.name && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResetPasswordForm(email: string): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

