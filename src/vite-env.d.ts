/// <reference types="vite/client" />

declare module '*.csv?raw' {
  const content: string;
  export default content;
}

declare module '*.tiff' {
  const src: string;
  export default src;
}
