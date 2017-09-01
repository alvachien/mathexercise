
export enum PrimarySchoolFormulaEnum {
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

export function getFormulaNameString(fe: PrimarySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimarySchoolFormulaEnum.AreaOfCircle: {
            rst = 'Math.AreaOfCircle';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'Math.AreaOfParallelogram';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'Math.AreaOfRectangle';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfSquare: {
            rst = 'Math.AreaOfSquare';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'Math.AreaOfTrapezoid';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'Math.AreaOfTriangle';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'Math.CircumferenceOfCircle';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'Math.CircumferenceOfSquare';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'Math.CircumferenceOfRectangle';
        }
        break;

        case PrimarySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'Math.DistanceAndSpeed';
        }
        break;
        
        default:
        break;
    }

    return rst;
}

export function getFormulaUIString(fe: PrimarySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimarySchoolFormulaEnum.AreaOfCircle: {
            rst = 'S = πr<sup>2</sup>';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'S = ah';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'S = ab';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfSquare: {
            rst = 'S = a<sup>2</sup>';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'S = (a+b)h/2';
        }
        break;

        case PrimarySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'S = (ah)/ 2';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'C = πD = 2πr';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'C = 4a';
        }
        break;

        case PrimarySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'C = 2(a+b)';
        }
        break;

        case PrimarySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'S = vh';
        }
        break;
        
        default:
        break;
    }

    return rst;
}
