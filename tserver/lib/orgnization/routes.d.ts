import { Response } from '../routes';
export declare class OrganizationController {
    type(ctx: any): Promise<Response>;
    home(ctx: any): Promise<Response>;
    item(ctx: any): Promise<Response>;
    users(ctx: any): Promise<Response>;
    joined(ctx: any): Promise<Response>;
    join(ctx: any): Promise<Response>;
    quit(ctx: any): Promise<Response>;
    addThread(ctx: any): Promise<Response>;
    getThread(ctx: any): Promise<Response>;
    checkThreadAndUser(communityId: any, userId: any, thread: any): Promise<boolean>;
    rank(threadId: string, type: number, communityId: string, userId: string): Promise<number>;
    good(ctx: any): Promise<Response>;
    bad(ctx: any): Promise<Response>;
    addComment(ctx: any): Promise<Response>;
}
