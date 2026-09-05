// Central place for the site's public base URL, used to build absolute links
// inside emails (relative links don't work in email HTML).
//
// IMPORTANT: set NEXT_PUBLIC_SITE_URL in .env.local and in Vercel's project
// env vars once the real production domain is known — until then this falls
// back to localhost, which only works when testing on the machine running
// `npm run dev`. Real students will get a dead link until this is set.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
