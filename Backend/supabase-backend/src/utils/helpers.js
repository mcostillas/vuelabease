export const formatResponse = (data) => {
  return {
    status: 'success',
    data: data,
  };
};

export const validateInput = (input) => {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be a non-empty object');
  }
  // Additional validation logic can be added here
};