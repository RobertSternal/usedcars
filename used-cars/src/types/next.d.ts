// Type declarations for Next.js

// Add custom type declarations for Next.js pages
declare module 'next' {
  export type PageProps = {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  };
}
