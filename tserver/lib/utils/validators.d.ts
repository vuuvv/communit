export declare class Rule {
    strategy: any[];
    error: string;
    constructor(strategy: any[], error: string);
}
export interface FieldRule {
    [name: string]: Rule;
}
export declare function validate(target: any, rules: FieldRule[]): void;
