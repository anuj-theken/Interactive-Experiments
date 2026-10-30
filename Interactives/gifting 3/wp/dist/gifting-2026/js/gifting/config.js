// The page template prints window.gk26Config (ajaxUrl, nonces, signed-in user, baseUrl).
// Without it (static preview) the API runs in a local mock: any email works and the code is 000000.
export const wp = window.gk26Config || null;
