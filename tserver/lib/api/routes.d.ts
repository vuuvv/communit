import { Response } from '../routes';
export declare class ApiController {
    pointsGiveToCommunity(ctx: any): Promise<{
        success: boolean;
        value: any[];
    }>;
    pointsGiveToUser(ctx: any): Promise<Response>;
}
