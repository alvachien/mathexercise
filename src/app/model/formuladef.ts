
export enum PrimaySchoolFormulaEnum {
    AreaOfTriangle    = 0,
    AreaOfSquare      = 1,
    AreaOfRectangle   = 2,
    AreaOfParallelogram = 3,
    AreaOfTrapezoid     = 4,
    AreaOfCircle        = 5,

    CircumferenceOfCircle   = 10,
    CircumferenceOfSquare   = 11,
    CircumferenceOfRectangle = 12,

    DistanceAndSpeed    = 20
}

export function getFormulaNameString(fe: PrimaySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimaySchoolFormulaEnum.AreaOfCircle: {
            rst = 'Math.AreaOfCircle';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'Math.AreaOfParallelogram';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'Math.AreaOfRectangle';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfSquare: {
            rst = 'Math.AreaOfSquare';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'Math.AreaOfTrapezoid';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'Math.AreaOfTriangle';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'Math.CircumferenceOfCircle';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'Math.CircumferenceOfSquare';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'Math.CircumferenceOfRectangle';
        }
        break;

        case PrimaySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'Math.DistanceAndSpeed';
        }
        break;
        
        default:
        break;
    }

    return rst;
}

export function getFormulaUIString(fe: PrimaySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimaySchoolFormulaEnum.AreaOfCircle: {
            rst = 'S = πr<sup>2</sup>';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'S = ah';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'S = ab';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfSquare: {
            rst = 'S = a<sup>2</sup>';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'S = (a+b)h/2';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'S = (ah)/ 2';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'C = πD = 2πR';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'C = 4a';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'C = 2(a+b)';
        }
        break;

        case PrimaySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'S = vh';
        }
        break;
        
        default:
        break;
    }

    return rst;
}
