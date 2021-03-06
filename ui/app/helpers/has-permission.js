import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  permissions: service(),
  compute([navItem], { routeParams }) {
    let permissions = this.permissions;
    return permissions.hasNavPermission(navItem, routeParams);
  },
});
