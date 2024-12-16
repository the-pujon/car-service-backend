// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paginationData = (page: number, limit: number, total: number, result: any) => {
    const totalPages = Math.ceil(total / limit);
    return  {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentlyShowingData: result.length,
        totalData: total,
      }
}