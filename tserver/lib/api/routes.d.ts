import { Response } from '../routes';
export declare class ApiController {
    pointsGiveToCommunity(ctx: any): Promise<Response>;
    pointsGiveToUser(ctx: any): Promise<Response>;
    pointsRefundActivity(ctx: any): Promise<Response>;
    pointsChangeActivity(ctx: any): Promise<Response>;
}
