import * as BMP24 from 'gd-bmp';
import * as jimp from 'jimp';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';

/*
 用PCtoLCD2002取字模
 行列式扫描，正向取模（高位在前）
 */
const cnfonts = {// 自定义字模
  w : 16,
  h : 16,
  fonts: '中国',
  data : [
    [0x01,0x01,0x01,0x01,0x3F,0x21,0x21,0x21,0x21,0x21,0x3F,0x21,0x01,0x01,0x01,0x01,0x00,0x00,0x00,0x00,0xF8,0x08,0x08,0x08,0x08,0x08,0xF8,0x08,0x00,0x00,0x00,0x00],/*"中",0*/
    [0x00,0x7F,0x40,0x40,0x5F,0x41,0x41,0x4F,0x41,0x41,0x41,0x5F,0x40,0x40,0x7F,0x40,0x00,0xFC,0x04,0x04,0xF4,0x04,0x04,0xE4,0x04,0x44,0x24,0xF4,0x04,0x04,0xFC,0x04],/*"国",1*/
  ]
};

function rand(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min));
}

function generateCapchaCode(length) {
  return Math.random().toString(10).substr(2, length);
}

// 制造验证码图片
function makeCapcha() {
    let img = new BMP24(100, 40);
    img.fillRect(0, 0, 100, 40, 0xffffff);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10 , 40), rand(0, 0xffffff));
    // 边框
    // img.drawRect(0, 0, img.w - 1, img.h - 1, rand(0, 0xffffff));
    img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
    img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    // return img;

    // 画曲线
    let w = img.w / 2;
    let h = img.h;
    let color = rand(0, 0xffffff);
    let y1 = rand(-5, 5); // Y轴位置调整
    let w2 = rand(10, 15); // 数值越小频率越高
    let h3 = rand(4, 6); // 数值越小幅度越大
    let bl = rand(1, 5);
    for (let i = -w; i < w; i += 0.1) {
        let y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1);
        let x = Math.floor(i + w);
        for (let j = 0; j < bl; j++){
            img.drawPoint(x, y + j, color);
        }
    }

    let str = generateCapchaCode(4);

    let fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    let x = 15, y = 8;
    for (let i = 0; i < str.length; i++) {
        let f = fonts[Math.floor(Math.random() * fonts.length)];
        y = 8 + rand(-10, 10);
        img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
        x += f.w + rand(2, 8);
    }
    return {
      code: str,
      file: img,
    };
}

@router('/capcha')
export class CapchaController {
  @get('/')
  async home(ctx) {
    let img = makeCapcha();
    ctx.session.capcha = img.code;
    ctx.type = 'image/jpg';
    let image = await jimp.read(img.file.getFileData());
    let buffer = new Promise((resolve, reject) => {
      image.getBuffer(jimp.MIME_JPEG, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf);
        }
      });
    });
    ctx.body = await buffer;
  }
}
