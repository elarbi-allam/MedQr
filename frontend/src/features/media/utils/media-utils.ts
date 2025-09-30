export const getMediaUrl = (filePath: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
  return `${baseUrl}/${filePath}`;
};
