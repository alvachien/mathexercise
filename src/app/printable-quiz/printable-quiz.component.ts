import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, ValidationErrors, Validators, } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-printable-quiz',
  templateUrl: './printable-quiz.component.html',
  styleUrls: ['./printable-quiz.component.scss']
})
export class PrintableQuizComponent implements OnInit {
  mixOpList: string[] = ['+', '-', 'X', '/'];
  contentFormGroup: FormGroup;
  quizFormGroup: FormGroup;

  arAddQuizFinal: any[] = [];
  arSubQuizFinal: any[] = [];
  arMulQuizFinal: any[] = [];
  arMixOpQuizFinal: any[] = [];

  get amountMixOp(): number {
    return this.contentFormGroup.get('amountMixOpCtrl') && +this.contentFormGroup.get('amountMixOpCtrl').value;
  }
  get fontSize(): number {
    return this.quizFormGroup && this.quizFormGroup.get('fontSizeCtrl') && +this.quizFormGroup.get('fontSizeCtrl').value;
  }
  get quizHeader(): string {
    return this.quizFormGroup && this.quizFormGroup.get('headerCtrl').value;
  }
  get isDateInputEnabled(): boolean {
    return this.quizFormGroup.get('enableDateCtrl').value as boolean;
  }
  get isScoreInputEnabled(): boolean {
    return this.quizFormGroup.get('enableScoreCtrl').value as boolean;
  }

  constructor() {
    this.contentFormGroup = new FormGroup({
      amountAddCtrl: new FormControl(),
      amountSubCtrl: new FormControl(),
      amountMulCtrl: new FormControl(),
      amountMixOpCtrl: new FormControl(),
      mixOpsCtrl: new FormControl(['+', '-']),
      randomInputCtrl: new FormControl(true),
      decimalPlacesCtrl: new FormControl(),
      numberBeginCtrl: new FormControl(1, [Validators.required]),
      numberEndCtrl: new FormControl(100, [Validators.required]),
    }, [this.contentValidator]);
    this.quizFormGroup = new FormGroup({
      headerCtrl: new FormControl(),
      enableScoreCtrl: new FormControl(true),
      enableDateCtrl: new FormControl(true),
      fontSizeCtrl: new FormControl(15, [Validators.required]),
      amountOfCopyCtrl: new FormControl(1, [Validators.required]),
    }, [this.printSettingValidator]);
  }

  ngOnInit() {
  }

  contentValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const addamt: number = +group.get('amountAddCtrl').value;
    const subamt: number = +group.get('amountSubCtrl').value;
    const mulamt: number = +group.get('amountMulCtrl').value;
    const mopamt: number = +group.get('amountMixOpCtrl').value;
    const mops: any[] = group.get('mixOpsCtrl').value;
    if ((addamt <= 0 && subamt <= 0 && mulamt <= 0 && mopamt <= 0)
      || (addamt + subamt + mulamt + mopamt) <= 0) {
      return { invalidamount: true };
    }
    if (mopamt > 0) {
      if (mops.length <= 1) {
        return { invalidmixoperators: true };
      }
    }

    const bgnnr: number = +group.get('numberBeginCtrl').value;
    const endnr: number = +group.get('numberEndCtrl').value;
    if (bgnnr >= endnr) {
      return { invalidrange: true };
    }

    return null;
  };
  printSettingValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const cpyamt: number = +group.get('amountOfCopyCtrl').value;
    if (cpyamt <= 0) {
      return { invalidcopyamount: true };
    }
    if (this.fontSize >= 30 || this.fontSize < 15) {
      return { invalidfontsize: true };
    }

    return null;
  };

  public onStepSelectionChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      const addamt: number = +this.contentFormGroup.get('amountAddCtrl').value;
      const subamt: number = +this.contentFormGroup.get('amountSubCtrl').value;
      const mulamt: number = +this.contentFormGroup.get('amountMulCtrl').value;
      const mopamt: number = +this.contentFormGroup.get('amountMixOpCtrl').value;
      const bgnnr: number = +this.contentFormGroup.get('numberBeginCtrl').value;
      const endnr: number = +this.contentFormGroup.get('numberEndCtrl').value;
      const dcmplace: number = +this.contentFormGroup.get('decimalPlacesCtrl').value;
      const randminput: boolean = this.contentFormGroup.get('randomInputCtrl').value;

      this.arAddQuizFinal = [];
      this.arSubQuizFinal = [];
      this.arMulQuizFinal = [];
      this.arMixOpQuizFinal = [];

      // Add.
      this._generateAddQuizs(addamt, endnr, bgnnr, dcmplace, randminput);

      // Sub.
      this._generateSubQuizs(subamt, endnr, bgnnr, dcmplace, randminput);

      // Multipy.
      this._generateMulQuizs(mulamt, endnr, bgnnr, dcmplace, randminput);

      // Mixed operators
      const arMixOpQuiz: any[] = [];
      let idx = 0;
      if (mopamt > 0) {
        idx = 0;
        do {
          idx++;
        }
        while (idx < mopamt);
      }
    }
  }

  public onGenerate(): void {
    // Generate the PDF
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
    });
  }

  private _generateMulQuizs(mulamt: number, endnr: number, bgnnr: number, dcmplace: number, randminput: boolean) {
    const arMulQuiz: any[] = [];
    let idx = 0;
    if (mulamt > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (endnr - bgnnr) + bgnnr;
        let rnum2 = Math.random() * (endnr - bgnnr) + bgnnr;
        if (dcmplace > 0) {
          rnum1 = parseFloat(rnum1.toFixed(dcmplace));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (dcmplace > 0) {
          rnum2 = parseFloat(rnum2.toFixed(dcmplace));
        } else {
          rnum2 = Math.round(rnum2);
        }
        if (randminput) {
          let rnum3 = rnum1 * rnum2;
          if (dcmplace > 0) {
            rnum3 = parseFloat(rnum3.toFixed(dcmplace));
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
      } while (idx++ < mulamt);
    }
    for (let i = 0; i < mulamt; i += 3) {
      if (i < mulamt - 2) {
        this.arMulQuizFinal.push([arMulQuiz[i], arMulQuiz[i + 1], arMulQuiz[i + 2]]);
      } else if (i < mulamt - 1) {
        this.arMulQuizFinal.push([arMulQuiz[i], arMulQuiz[i + 1]]);
      } else {
        this.arMulQuizFinal.push([arMulQuiz[i]]);
      }
    }
  }

  private _generateSubQuizs(subamt: number, endnr: number, bgnnr: number, dcmplace: number, randminput: boolean) {
    const arSubQuiz: any[] = [];
    let idx = 0;
    if (subamt > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (endnr - bgnnr) + bgnnr;
        let rnum2 = Math.random() * (endnr - bgnnr) + bgnnr;
        if (dcmplace > 0) {
          rnum1 = parseFloat(rnum1.toFixed(dcmplace));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (dcmplace > 0) {
          rnum2 = parseFloat(rnum2.toFixed(dcmplace));
        } else {
          rnum2 = Math.round(rnum2);
        }
        if (randminput) {
          let rnum3 = rnum1 - rnum2;
          if (dcmplace > 0) {
            rnum3 = parseFloat(rnum3.toFixed(dcmplace));
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
      } while (idx++ < subamt);
    }
    for (let i = 0; i < subamt; i += 3) {
      if (i < subamt - 2) {
        this.arSubQuizFinal.push([arSubQuiz[i], arSubQuiz[i + 1], arSubQuiz[i + 2]]);
      } else if (i < subamt - 1) {
        this.arSubQuizFinal.push([arSubQuiz[i], arSubQuiz[i + 1]]);
      } else {
        this.arSubQuizFinal.push([arSubQuiz[i]]);
      }
    }
  }

  private _generateAddQuizs(addamt: number, endnr: number, bgnnr: number, dcmplace: number, randminput: boolean) {
    const arAddQuiz: any[] = [];
    let idx = 0;

    if (addamt > 0) {
      idx = 0;
      do {
        let rnum1 = Math.random() * (endnr - bgnnr) + bgnnr;
        let rnum2 = Math.random() * (endnr - bgnnr) + bgnnr;
        if (dcmplace > 0) {
          rnum1 = parseFloat(rnum1.toFixed(dcmplace));
        } else {
          rnum1 = Math.round(rnum1);
        }
        if (dcmplace > 0) {
          rnum2 = parseFloat(rnum2.toFixed(dcmplace));
        } else {
          rnum2 = Math.round(rnum2);
        }
        if (randminput) {
          let rnum3 = rnum1 + rnum2;
          if (dcmplace > 0) {
            rnum3 = parseFloat(rnum3.toFixed(dcmplace));
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
      } while (idx++ < addamt);
    }
    for (let i = 0; i < addamt; i += 3) {
      if (i < addamt - 2) {
        this.arAddQuizFinal.push([arAddQuiz[i], arAddQuiz[i + 1], arAddQuiz[i + 2]]);
      } else if (i < addamt - 1) {
        this.arAddQuizFinal.push([arAddQuiz[i], arAddQuiz[i + 1]]);
      } else {
        this.arAddQuizFinal.push([arAddQuiz[i]]);
      }
    }
  }
}
