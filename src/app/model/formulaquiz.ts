
import { PrimaySchoolFormulaEnum } from './formuladef';
import { PrimarySchoolMathQuizItem } from './quizconcept';

export class FormulaQuizItem extends PrimarySchoolMathQuizItem {
    public getForumString(fe: PrimaySchoolFormulaEnum): string {
        let rst: string = '';
        switch (fe) {
            case PrimaySchoolFormulaEnum.AreaOfCircle: {
                rst = 'C = πD = 2πR';
            }
            break;

            case PrimaySchoolFormulaEnum.AreaOfParallelogram: {
                rst = 's = a × h = ah';
            }
            break;

            case PrimaySchoolFormulaEnum.AreaOfRectangle: {
                rst = 's = a × b = ab';
            }
            break;

            case PrimaySchoolFormulaEnum.AreaOfSquare: {
                rst = 's = a × a = aa';
            }
            break;

            case PrimaySchoolFormulaEnum.AreaOfTrapezoid: {

            }
            break;

            case PrimaySchoolFormulaEnum.AreaOfTriangle: {

            }
            break;

            case PrimaySchoolFormulaEnum.CircumferenceOfCircle: {

            }
            break;

            case PrimaySchoolFormulaEnum.DistanceAndSpeed: {

            }
            break;
            
            default:
            break;
        }

        return rst;
    }

}
