import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as jsPDF from 'jspdf';
import { MatAccordion, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import * as html2canvas from 'html2canvas';
import * as math from 'mathjs';

import {
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem,
  QuizTypeEnum, QuizTypeEnum2UIString
} from '../model';

@Component({
  selector: 'app-printable-quiz-generator',
  templateUrl: './printable-quiz-generator.component.html',
  styleUrls: ['./printable-quiz-generator.component.scss'],
})
export class PrintableQuizGeneratorComponent implements OnInit {
  private _leftStart: number;
  private _arSubstr: any[];

  amountAddQuiz: number;
  amountSubQuiz: number;
  amountMulQuiz: number;
  amountDivQuiz: number;
  amountMixOpQuiz: number;
  mixOpOperators: string[];
  mixOpList: string[] = ['+', '-', 'X', '/'];
  decimalPlaces: number;
  numberBegin: number;
  numberEnd: number;
  fontSize: number;
  numberOfCopy: number;
  randomInput: boolean;
  addScoreInput: boolean;
  addDateInput: boolean;
  quizHeader: string;
  showresult: boolean;

  arAddQuizFinal: any[];
  arSubQuizFinal: any[];
  arMulQuizFinal: any[];
  arMixOpQuizFinal: any[];

  get numberDisplayLength(): number {
    return 2 * (this.numberEnd.toString().length + this.decimalPlaces);
  }
  get arPlaceHolder(): any[] {
    const arholder: any[] = [];
    for (let i = 0; i < this.numberDisplayLength; i++) {
      arholder.push('_');
    }
    return arholder;
  }

  constructor(private _tranService: TranslateService) {

    this.showresult = false;
    this.arAddQuizFinal = [];

    this.randomInput = true;
    this.numberOfCopy = 1;
    this.addScoreInput = true;
    this.addDateInput = true;
    this.fontSize = 15;

    this._leftStart = 15;
    this._arSubstr = [];
    this._arSubstr.push({
      qtype: QuizTypeEnum.add,
      i18n: '',
      display: ''
    }, {
        qtype: QuizTypeEnum.sub,
        i18n: '',
        display: ''
      }, {
        qtype: QuizTypeEnum.multi,
        i18n: '',
        display: ''
      }, {
        qtype: QuizTypeEnum.div,
        i18n: '',
        display: ''
      });
    for (const astr of this._arSubstr) {
      astr.i18n = QuizTypeEnum2UIString(astr.qtype);
    }

    this.amountAddQuiz = 12;
    this.amountSubQuiz = 12;
    this.amountMulQuiz = 12;
    this.amountDivQuiz = 0;
    this.amountMixOpQuiz = 20;
    this.decimalPlaces = 2;
    this.numberBegin = 1;
    this.numberEnd = 100;
  }

  ngOnInit(): void {
    // this.accordion.openAll();

    const arstring: string[] = [];
    for (const astr of this._arSubstr) {
      arstring.push(astr.i18n);
    }
    this._tranService.get(arstring).subscribe((x: any) => {
      if (x) {
        for (const attr in x) {
          for (const lab of this._arSubstr) {
            if (lab.i18n === attr) {
              lab.display = x[attr];
            }
          }
        }
      }
    });
  }

  onNewGenerate(): void {
    if (this.numberOfCopy < 1) {
      return;
    }

    let idx = 0;

    this.arAddQuizFinal = [];
    this.arSubQuizFinal = [];
    this.arMulQuizFinal = [];
    this.arMixOpQuizFinal = [];

    // Add.
    const arAddQuiz: any[] = [];
    if (this.amountAddQuiz > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        let rnum2 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        if (this.decimalPlaces > 0) {
          rnum1 = parseFloat(rnum1.toFixed(this.decimalPlaces));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (this.decimalPlaces > 0) {
          rnum2 = parseFloat(rnum2.toFixed(this.decimalPlaces));
        } else {
          rnum2 = Math.round(rnum2);
        }

        if (this.randomInput) {
          let rnum3 = rnum1 + rnum2;
          if (this.decimalPlaces > 0) {
            rnum3 = parseFloat(rnum3.toFixed(this.decimalPlaces));
          } else {
            rnum3 = Math.round(rnum3);
          }
          const nRandom: number = Math.random() * 3;
          if (nRandom > 2) {
            arAddQuiz.push([rnum1, '+', rnum2, '=']);
          } else if (nRandom > 1) {
            arAddQuiz.push([rnum1, '+', undefined, '=', rnum3]);
          } else {
            arAddQuiz.push([undefined, '+', rnum2, '=', rnum3]);
          }
        } else {
          arAddQuiz.push([rnum1, '+', rnum2, '=']);
        }
      } while (idx++ < this.amountAddQuiz);
    }

    for (let i = 0; i < this.amountAddQuiz; i += 3) {
      if (i < this.amountAddQuiz - 2) {
        this.arAddQuizFinal.push([arAddQuiz[i], arAddQuiz[i + 1], arAddQuiz[i + 2]]);
      } else if (i < this.amountAddQuiz - 1) {
        this.arAddQuizFinal.push([arAddQuiz[i], arAddQuiz[i + 1]]);
      } else {
        this.arAddQuizFinal.push([arAddQuiz[i]]);
      }
    }

    // Sub.
    const arSubQuiz: any[] = [];
    if (this.amountSubQuiz > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        let rnum2 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        if (this.decimalPlaces > 0) {
          rnum1 = parseFloat(rnum1.toFixed(this.decimalPlaces));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (this.decimalPlaces > 0) {
          rnum2 = parseFloat(rnum2.toFixed(this.decimalPlaces));
        } else {
          rnum2 = Math.round(rnum2);
        }

        if (this.randomInput) {
          let rnum3 = rnum1 - rnum2;
          if (this.decimalPlaces > 0) {
            rnum3 = parseFloat(rnum3.toFixed(this.decimalPlaces));
          } else {
            rnum3 = Math.round(rnum3);
          }
          if (rnum3 < 0) {
            const ntmp = rnum1;
            rnum1 = rnum2;
            rnum2 = ntmp;
            rnum3 = Math.abs(rnum3);
          }
          const nRandom: number = Math.random() * 3;
          if (nRandom > 2) {
            arSubQuiz.push([rnum1, '-', rnum2, '=']);
          } else if (nRandom > 1) {
            arSubQuiz.push([rnum1, '-', undefined, '=', rnum3]);
          } else {
            arSubQuiz.push([undefined, '-', rnum2, '=', rnum3]);
          }
        } else {
          arSubQuiz.push([rnum1, '-', rnum2, '=']);
        }
      } while (idx++ < this.amountSubQuiz);
    }

    for (let i = 0; i < this.amountSubQuiz; i += 3) {
      if (i < this.amountSubQuiz - 2) {
        this.arSubQuizFinal.push([arSubQuiz[i], arSubQuiz[i + 1], arSubQuiz[i + 2]]);
      } else if (i < this.amountSubQuiz - 1) {
        this.arSubQuizFinal.push([arSubQuiz[i], arSubQuiz[i + 1]]);
      } else {
        this.arSubQuizFinal.push([arSubQuiz[i]]);
      }
    }

    // Multipy.
    const arMulQuiz: any[] = [];
    if (this.amountMulQuiz > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        let rnum2 = Math.random() * (this.numberEnd - this.numberBegin) + this.numberBegin;
        if (this.decimalPlaces > 0) {
          rnum1 = parseFloat(rnum1.toFixed(this.decimalPlaces));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (this.decimalPlaces > 0) {
          rnum2 = parseFloat(rnum2.toFixed(this.decimalPlaces));
        } else {
          rnum2 = Math.round(rnum2);
        }

        if (this.randomInput) {
          let rnum3 = rnum1 * rnum2;
          if (this.decimalPlaces > 0) {
            rnum3 = parseFloat(rnum3.toFixed(this.decimalPlaces));
          } else {
            rnum3 = Math.round(rnum3);
          }

          const nRandom: number = Math.random() * 3;
          if (nRandom > 2) {
            arMulQuiz.push([rnum1, 'X', rnum2, '=']);
          } else if (nRandom > 1) {
            arMulQuiz.push([rnum1, 'X', undefined, '=', rnum3]);
          } else {
            arMulQuiz.push([undefined, 'X', rnum2, '=', rnum3]);
          }
        } else {
          arMulQuiz.push([rnum1, 'X', rnum2, '=']);
        }
      } while (idx++ < this.amountMulQuiz);
    }

    for (let i = 0; i < this.amountMulQuiz; i += 3) {
      if (i < this.amountMulQuiz - 2) {
        this.arMulQuizFinal.push([arMulQuiz[i], arMulQuiz[i + 1], arMulQuiz[i + 2]]);
      } else if (i < this.amountMulQuiz - 1) {
        this.arMulQuizFinal.push([arMulQuiz[i], arMulQuiz[i + 1]]);
      } else {
        this.arMulQuizFinal.push([arMulQuiz[i]]);
      }
    }

    // Mixed operators
    const arMixOpQuiz: any[] = [];
    if (this.amountMixOpQuiz > 0) {
      idx = 0;
      do {
        idx ++;
      }
      while (idx < this.amountMixOpQuiz);
    }

    this.showresult = true;
    // this._changeDetecive.detectChanges();
    setTimeout(() => this.onNewPrint(), 1000);
  }

  private onNewPrint(): void {
    const target: any = document.getElementById('id_result');
    const width = target.offsetWidth; // 获取dom 宽度
    const height = target.offsetHeight; // 获取dom 高度
    const canvas = document.createElement('canvas'); // 创建一个canvas节点
    const scale = 2; // 定义任意放大倍数 支持小数
    canvas.width = width * scale; // 定义canvas 宽度 * 缩放
    canvas.height = height * scale; // 定义canvas高度 *缩放
    canvas.getContext('2d').scale(scale, scale); // 获取context,设置scale

    const opts: any = {
      scale: scale, // 添加的scale 参数
      canvas: canvas, // 自定义 canvas
      // logging: true, //日志开关，便于查看html2canvas的内部执行流程
      width: width, // dom 原始宽度
      height: height,
      useCORS: true // 【重要】开启跨域配置
    };

    html2canvas(target, opts).then((canvas2: any) => {
      const context: any = canvas2.getContext('2d');
      // 【重要】关闭抗锯齿
      // context.mozImageSmoothingEnabled = false;
      // context.webkitImageSmoothingEnabled = false;
      // context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      // // 【重要】默认转化的格式为png,也可设置为其他格式
      // var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);

      const contentWidth = canvas2.width;
      const contentHeight = canvas2.height;

      // 一页pdf显示html页面生成的canvas高度;
      const pageHeight = contentWidth / 592.28 * 841.89;
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;
      // 页面偏移
      let position = 0;
      // A4纸的尺寸[595.28, 841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = 595.28;
      const imgHeight = 592.28 / contentWidth * contentHeight;

      const pageData = canvas2.toDataURL('image/jpeg', 1.0);

      const pdf = new jsPDF('', 'pt', 'a4');
      // pdf.setFontSize(this.fontSize);

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }

      pdf.save('quiz.pdf');

      this.showresult = false;
      this.numberOfCopy--;

      if (this.numberOfCopy > 0) {
        this.onNewGenerate();
      }
    });
  }
}
