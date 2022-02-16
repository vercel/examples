export const createPagination = (items: any[], perPage: number) => {
  const paginated = items.reduce((acc, current, index) => {
    const chunkIndex = Math.floor(index / perPage);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }
    acc[chunkIndex].push(current);
    return acc;
  }, []);

  const paginationDict: { [key: string]: any } = {};
  paginated.forEach((chunk: any, i: number) => {
    paginationDict[i + 1] = chunk;
  });
  return paginationDict;
};
