import { Pipe, PipeTransform } from '@angular/core';
import { AppNavItem, AppNavItemGroupEnum } from '../model';

@Pipe({
  name: 'navItemFilter'
})
export class NavItemFilterPipe implements PipeTransform {

  transform(allAccounts: AppNavItem[], args?: AppNavItemGroupEnum): AppNavItem[] {
    return allAccounts.filter((value: AppNavItem) => {
        if (args !== undefined) {
          return value.group === args;
        }

        return true;
    });
}

}
