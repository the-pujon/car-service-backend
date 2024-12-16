"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationData = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paginationData = (page, limit, total, result) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentlyShowingData: result.length,
        totalData: total,
    };
};
exports.paginationData = paginationData;
