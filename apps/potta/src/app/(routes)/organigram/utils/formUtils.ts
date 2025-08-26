/**
 * Utility function to clean form data by removing empty values
 * @param formData - The form data object
 * @returns Cleaned form data with empty values removed
 */
export const cleanFormData = (
  formData: Record<string, any>
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(formData).filter(([key, value]) => {
      // Keep all non-empty values
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (typeof value === 'number' && value === 0) return true; // Keep 0 values
      return true;
    })
  );
};
