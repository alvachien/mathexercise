
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

  DistanceAndSpeed = 20,
  EfficiencyProblem = 21,

  SumOfSquares = 30,
  DifferenceOfSquares = 31,
  PerfectSquareTrinomial = 32,
  QEquationOfOneUnknown = 33,
  CubicMetre = 34,
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

    case PrimarySchoolFormulaEnum.EfficiencyProblem: {
      rst = 'Math.EfficiencyProblem';
    }
    break;

    case PrimarySchoolFormulaEnum.SumOfSquares: {
      rst = 'Math.SumOfSquares';
    }
    break;

    case PrimarySchoolFormulaEnum.DifferenceOfSquares: {
      rst = 'Math.FormulaForTheDifferenceOfSquare';
    }
    break;

    case PrimarySchoolFormulaEnum.PerfectSquareTrinomial: {
      rst = 'Math.PerfectSquareTrinomial';
    }
    break;

    case PrimarySchoolFormulaEnum.QEquationOfOneUnknown: {
      rst = 'Math.QEquationOfOneUnknown';
    }
    break;

    case PrimarySchoolFormulaEnum.CubicMetre: {
      rst = 'Math.CubicMetre';
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

    case PrimarySchoolFormulaEnum.EfficiencyProblem: {
      rst = '<var>R</var> = <var>e</var> × <var>h</var>';
    }
    break;

    case PrimarySchoolFormulaEnum.SumOfSquares: {
      rst = `\\(\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}.\\)`;
    }
    break;

    case PrimarySchoolFormulaEnum.DifferenceOfSquares: {
      rst = `\\(a^2-b^2=(a+b)(a-b).\\)`;
    }
    break;

    case PrimarySchoolFormulaEnum.PerfectSquareTrinomial: {
      rst = ` \\((a \\pm b)^2= a^2 \\pm 2ab + b^2.\\) \\((a+b)^2=a^2+2ab+b^2.\\) \\((a-b)^2=a^2-2ab+b^2.\\)`;
    }
    break;

    case PrimarySchoolFormulaEnum.QEquationOfOneUnknown: {
      rst = `\\(ax^2 + bx + c = 0\\) $$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$  `;
    }
    break;

    case PrimarySchoolFormulaEnum.CubicMetre: {
      rst = `\\(a^3 \\pm b^3=(a \\pm b)(a^2 \\mp ab + b^2).\\)  \\(a^3+b^3=(a+b)(a^2-ab+b^2).\\) \\(a^3-b^3=(a-b)(a^2+ab+b^2).\\)`;
    }
    break;

    default:
    break;
  }

  return rst;
}
