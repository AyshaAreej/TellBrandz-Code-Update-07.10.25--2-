/**
 * DOB Age Calculator Utility
 * Converts date of birth to age range for privacy compliance
 */

export interface AgeRange {
  range: string;
  category: 'under-18' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
}

export function calculateAgeFromDOB(dob: string | Date): number {
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getAgeRangeFromDOB(dob: string | Date): AgeRange {
  const age = calculateAgeFromDOB(dob);
  
  if (age < 18) return { range: 'Under 18', category: 'under-18' };
  if (age <= 24) return { range: '18-24', category: '18-24' };
  if (age <= 34) return { range: '25-34', category: '25-34' };
  if (age <= 44) return { range: '35-44', category: '35-44' };
  if (age <= 54) return { range: '45-54', category: '45-54' };
  if (age <= 64) return { range: '55-64', category: '55-64' };
  return { range: '65+', category: '65+' };
}

export function maskDOB(dob: string | Date): string {
  // Returns only the year for privacy
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
  return birthDate.getFullYear().toString();
}
