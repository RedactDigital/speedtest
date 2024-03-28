export default async (url: string): Promise<ReadableStreamDefaultReader> => {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  if (response.body === null) throw new Error('Response body is null');
  return response.body.getReader();
};
