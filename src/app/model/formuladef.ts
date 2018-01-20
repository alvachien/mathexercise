
export enum PrimarySchoolFormulaEnum {
  AreaOfTriangle = 0,
  AreaOfSquare = 1,
  AreaOfRectangle = 2,
  AreaOfParallelogram = 3,
  AreaOfTrapezoid = 4,
  AreaOfCircle = 5,

  CircumferenceOfCircle = 10,
  CircumferenceOfSquare = 11,
  CircumferenceOfRectangle = 12,

  DistanceAndSpeed = 20
}

export function getFormulaNameString(fe: PrimarySchoolFormulaEnum): string {
  let rst = '';
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
  let rst = '';
  switch (fe) {
    case PrimarySchoolFormulaEnum.AreaOfCircle: {
      rst = '<var>S</var> = π<var>r</var><sup>2</sup>';
    }
    break;

    case PrimarySchoolFormulaEnum.AreaOfParallelogram: {
      rst = '<var>S</var> = <var>a</var> × <var>h</var>';
    }
    break;

    case PrimarySchoolFormulaEnum.AreaOfRectangle: {
      rst = '<var>S</var> = <var>a</var> × <var>b</var>';
    }
    break;

    case PrimarySchoolFormulaEnum.AreaOfSquare: {
      rst = '<var>S</var> = <var>a</var> <sup>2</sup>';
    }
    break;

    case PrimarySchoolFormulaEnum.AreaOfTrapezoid: {
      rst = '<var>S</var> = (<var>a</var> + <var>b</var>) × <var>h</var> ÷ 2';
    }
    break;

    case PrimarySchoolFormulaEnum.AreaOfTriangle: {
      rst = '<var>S</var> = (<var>a</var> × <var>h</var>) ÷ 2';
    }
    break;

    case PrimarySchoolFormulaEnum.CircumferenceOfCircle: {
      rst = '<var>C</var> = π<var>D</var> = 2π<var>r</var>';
    }
    break;

    case PrimarySchoolFormulaEnum.CircumferenceOfSquare: {
      rst = '<var>C</var> = 4 × <var>a</var>';
    }
    break;

    case PrimarySchoolFormulaEnum.CircumferenceOfRectangle: {
      rst = '<var>C</var> = 2 × (<var>a</var> + <var>b</var>)';
    }
    break;

    case PrimarySchoolFormulaEnum.DistanceAndSpeed: {
      rst = '<var>S</var> = <var>v</var> × <var>h</var>';
    }
    break;

    default:
    break;
  }

  return rst;
}
