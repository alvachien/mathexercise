
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
    bgn.set('day', 0);
    end.endOf('month');
  } else if (scope === StatisticsDateRangeEnum.CurrentYear) {
    bgn.set('day', 0);
    bgn.set('month', 0);
    
    end.endOf('year');
  } else if (scope === StatisticsDateRangeEnum.PreviousMonth) {
    bgn.set('day', 0);
    bgn.subtract(1, 'M');

    end = bgn.clone();
    end.endOf('month');
  } else if (scope === StatisticsDateRangeEnum.PreviousYear) {
    bgn.set('day', 0);
    bgn.set('month', 0);
    bgn.subtract(1, 'y');

    end = bgn.clone();
    end.endOf('year');
  } else if (scope === StatisticsDateRangeEnum.All) {
    bgn = moment('19710101');
    end = moment('99991231');
  }

  return { BeginDate: bgn, EndDate: end };
}
