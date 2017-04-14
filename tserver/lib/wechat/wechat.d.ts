import { WechatOfficialAccount, WechatUser } from '../models';
export interface Notify {
    ToUserName: string;
    FromUserName: string;
    CreateTime: string;
    MsgType: string;
}
export interface Message extends Notify {
    MsgID: string;
}
export interface Event extends Notify {
    Event: string;
}
export interface TextMessage extends Message {
    Content: string;
}
export interface ImageMessage extends Message {
    PicUrl: string;
    MediaId: string;
}
export interface VoiceMessage extends Message {
    MediaId: string;
    Format: string;
    Recognition?: string;
}
export interface VideoMessage extends Message {
    MediaId: string;
    ThumbMediaId: string;
}
export interface ShortVideoMessage extends Message {
    MediaId: string;
    ThumbMediaId: string;
}
export interface LocationMessage extends Message {
    Location_X: string;
    Location_Y: string;
    Scale: string;
    Label: string;
}
export interface LinkMessage extends Message {
    Title: string;
    Description: string;
    Url: string;
}
export interface SubscribeEvent extends Event {
    EventKey: string;
    Ticket: string;
}
export interface ScanEvent extends Event {
    EventKey: string;
    Ticket: string;
}
export interface LocationEvent extends Event {
    Latitude: string;
    Longitude: string;
    Precision: string;
}
export interface ClickEvent extends Event {
    EventKey: string;
}
export interface ViewEvent extends Event {
    EventKey: string;
}
export declare class Reply {
    ToUserName: string;
    FromUserName: string;
    CreateTime: string;
    MsgType: string;
    constructor(from: string, to: string);
    toXml(): string;
    commonXml(): string;
}
export declare class TextReply extends Reply {
    MsgType: string;
    Content: string;
    constructor(from: string, to: string, content: string);
    toXml(): string;
}
export declare class ImageReply extends Reply {
    MsgType: string;
    MediaId: string;
    constructor(from: string, to: string, mediaId: string);
    toXml(): string;
}
export declare class VoiceReply extends Reply {
    MsgType: string;
    MediaId: string;
    constructor(from: string, to: string, mediaId: string);
    toXml(): string;
}
export declare class VideoReply extends Reply {
    MsgType: string;
    MediaId: string;
    Title?: string;
    Description?: string;
    constructor(from: string, to: string, mediaId: string, title?: string, description?: string);
    toXml(): string;
}
export declare class MusicReply extends Reply {
    MsgType: string;
    ThumbMediaId: string;
    Title?: string;
    Description?: string;
    MusicURL?: string;
    HQMusicUrl?: string;
    constructor(from: string, to: string, mediaId: string, title?: string, description?: string, musicUrl?: string, hqMusicUrl?: string);
    toXml(): string;
}
export declare class Article {
    Title: string;
    Description: string;
    PicUrl: string;
    Url: string;
}
export declare class NewsReply extends Reply {
    MsgType: string;
    Articles: Article[];
    constructor(from: string, to: string, articles: Article[]);
    toXml(): string;
}
export declare class TransferCustomerServiceReply extends Reply {
    MsgType: string;
    toXml(): string;
}
export declare class Wechat {
    officialAccount: WechatOfficialAccount;
    static create(id: any): Promise<Wechat>;
    constructor(officialAccount: WechatOfficialAccount);
    redirectUrl(url: string, state?: string): string;
    checkSignature(query: any): boolean;
    updateToken(officialAccount: WechatOfficialAccount): Promise<void>;
    fetchToken(): Promise<any>;
    getToken(): Promise<any>;
    fetchJsApiToken(): Promise<any>;
    getJsApiToken(): Promise<any>;
    getUserInfo(openid: any): Promise<any>;
    getMedia(mediaId: any): Promise<any>;
    saveMedia(mediaId: string, path: string): Promise<void>;
    createUser(openid: any): Promise<any>;
    getUserAccessToken(code: string): Promise<any>;
    getWechatUser(openid: string): Promise<WechatUser>;
    login(ctx: any): Promise<WechatUser>;
    createMenu(menu: any): Promise<any>;
    dispatch(ctx: any): Promise<any>;
    transferCustomerServiceMessage(notify: Notify): string;
    onText(msg: TextMessage): Promise<string>;
    onSubscribeEvent(message: Event): Promise<string>;
}
