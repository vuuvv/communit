import { Response } from '../routes';
export declare class SignupController {
    /**
     * 用户填写注册信息, 生成用户
     */
    signup(ctx: any): Promise<Response>;
    /**
     * 手机号验证
     */
    createVerify(ctx: any): Promise<Response>;
    getVerify(ctx: any): Promise<Response>;
    crash(): Promise<void>;
    login(ctx: any): Promise<any>;
}
