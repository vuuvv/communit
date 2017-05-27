"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const base_model_1 = require("./base_model");
const utils_1 = require("../utils");
class Answer extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "communityId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "userId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "questionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "content", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "points", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "orderId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Answer.prototype, "memo", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Answer.prototype, "memoTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Answer.prototype, "latestAnswerTime", void 0);
exports.Answer = Answer;
exports.AnswerTableName = 't_answer';
