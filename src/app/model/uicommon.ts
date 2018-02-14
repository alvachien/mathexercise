
import * as moment from 'moment';

/**
 * UI mode
 */

export enum UIMode {
  ListView = 0,
  Create = 1,
  Update = 2,
  Display = 3
}

export enum StatisticsDateRangeEnum {
  CurrentMonth = 1,
  PreviousMonth = 2,
  CurrentYear = 3,
  PreviousYear = 4,
  All = 5
}

export interface DateRangeUI {
  daterange: StatisticsDateRangeEnum,
  i18term: string;
  display: string;
}

export function getStatisticsDateRangeEnumString(dr: StatisticsDateRangeEnum) {
  switch (dr) {
    case StatisticsDateRangeEnum.CurrentMonth:
      return 'Home.CurrentMonth';

    case StatisticsDateRangeEnum.PreviousMonth:
      return 'Home.PreviousMonth';

    case StatisticsDateRangeEnum.CurrentYear:
      return 'Home.CurrentYear';

    case StatisticsDateRangeEnum.PreviousYear:
      return 'Home.PreviousYear';

    case StatisticsDateRangeEnum.All:
      return 'Home.All';

    default:
      throw new Error('Unsupported date range');
  }
}

export interface StatisticsDateRange {
  BeginDate: moment.Moment;
  EndDate: moment.Moment;
}

export function getStatisticsDateRangeDate(scope: StatisticsDateRangeEnum): StatisticsDateRange {
  let bgn = moment();
  let end = moment();

  if (scope === StatisticsDateRangeEnum.CurrentMonth) {
    bgn.startOf('month');
    end.endOf('month');
  } else if (scope === StatisticsDateRangeEnum.CurrentYear) {
    bgn.startOf('year');

    end.endOf('year');
  } else if (scope === StatisticsDateRangeEnum.PreviousMonth) {
    bgn.subtract(1, 'M');
    bgn.startOf('month');

    end = bgn.clone();
    end.endOf('month');
  } else if (scope === StatisticsDateRangeEnum.PreviousYear) {
    bgn.subtract(1, 'y');
    bgn.startOf('year');

    end = bgn.clone();
    end.endOf('year');
  } else if (scope === StatisticsDateRangeEnum.All) {
    bgn = moment('19710101');
    end = moment('99991231');
  }

  return { BeginDate: bgn, EndDate: end };
}

/**
 * Position of mouse event in Canvas
 */
export interface CanvasMousePositionInf {
  x: number;
  y: number;
}

/**
 * Get canvas mouse event position
 * @param canvas Canvas
 * @param evt Event
 */
export function getCanvasMouseEventPosition(canvas: any, evt: MouseEvent): CanvasMousePositionInf {
  const x: any = evt.clientX;
  const y: any = evt.clientY;

  // const rect = canvas.getBoundingClientRect();
  // x -= rect.left;
  // y -= rect.top;
  // return { x: x, y: y };

  // ?!!!?
  // TBD: get the difference!!!
  //
  const bbox = canvas.getBoundingClientRect();
  const x2 = (x - bbox.left) * (canvas.width / bbox.width);
  const y2 = (y - bbox.top) * (canvas.height / bbox.height);
  return { x: x2, y: y2};
}

/**
 * Cell position
 */
export interface CanvasCellPositionInf {
  row: number;
  column: number;
}

/**
 * Get canvas cell position
 * @param cavpos Position in the canvas
 * @param cellWidth Width of each cell
 * @param cellHeight Height of each cell
 */
export function getCanvasCellPosition(cavpos: CanvasMousePositionInf, cellWidth: number, cellHeight: number): CanvasCellPositionInf {
  return {
    row: Math.floor(cavpos.y / cellHeight),
    column: Math.floor(cavpos.x / cellWidth),
  };
}
