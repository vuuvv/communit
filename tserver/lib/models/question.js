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
class Question extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "communityId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "userId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "mainTypeId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "typeId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "title", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "content", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], Question.prototype, "points", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], Question.prototype, "payedPoints", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "orderId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Question.prototype, "status", void 0);
exports.Question = Question;
exports.QuestionTableName = 't_question';
