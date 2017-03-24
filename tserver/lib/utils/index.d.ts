export * from './property';
export * from './http';
export * from './uuid';
export declare function signature(secret: string, plan: string): string;
export declare function checkSignature(secret: string, plan: string, target: string): boolean;
