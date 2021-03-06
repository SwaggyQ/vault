import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { FEATURE_MACHINE_TIME } from 'vault/helpers/wizard-constants';

export default Component.extend({
  wizard: service(),
  version: service(),

  init() {
    this._super(...arguments);
    this.maybeHideFeatures();
  },

  maybeHideFeatures() {
    if (this.get('showReplication') === false) {
      let feature = this.get('allFeatures').findBy('key', 'replication');
      feature.show = false;
    }
  },
  estimatedTime: computed('selectedFeatures', function() {
    let time = 0;
    for (let feature of Object.keys(FEATURE_MACHINE_TIME)) {
      if (this.selectedFeatures.includes(feature)) {
        time += FEATURE_MACHINE_TIME[feature];
      }
    }
    return time;
  }),
  selectProgress: computed('selectedFeatures', function() {
    let bar = this.selectedFeatures.map(feature => {
      return { style: 'width:0%;', completed: false, showIcon: true, feature: feature };
    });
    if (bar.length === 0) {
      bar = [{ style: 'width:0%;', showIcon: false }];
    }
    return bar;
  }),
  allFeatures: computed(function() {
    return [
      {
        key: 'secrets',
        name: 'Secrets',
        steps: ['Enabling a secrets engine', 'Adding a secret'],
        selected: false,
        show: true,
        permission: 'secrets',
      },
      {
        key: 'authentication',
        name: 'Authentication',
        steps: ['Enabling an auth method', 'Managing your auth method'],
        selected: false,
        show: true,
        permission: 'access',
      },
      {
        key: 'policies',
        name: 'Policies',
        steps: [
          'Choosing a policy type',
          'Creating a policy',
          'Deleting your policy',
          'Other types of policies',
        ],
        selected: false,
        show: true,
        permission: 'policies',
      },
      {
        key: 'replication',
        name: 'Replication',
        steps: ['Setting up replication', 'Your cluster information'],
        selected: false,
        show: true,
        permission: 'status',
      },
      {
        key: 'tools',
        name: 'Tools',
        steps: ['Wrapping data', 'Lookup wrapped data', 'Rewrapping your data', 'Unwrapping your data'],
        selected: false,
        show: true,
        permission: 'tools',
      },
    ];
  }),

  showReplication: computed('version.{hasPerfReplication,hasDRReplication}', function() {
    return this.get('version.hasPerfReplication') || this.get('version.hasDRReplication');
  }),

  selectedFeatures: computed('allFeatures.@each.selected', function() {
    return this.get('allFeatures')
      .filterBy('selected')
      .mapBy('key');
  }),

  actions: {
    saveFeatures() {
      let wizard = this.get('wizard');
      wizard.saveFeatures(this.get('selectedFeatures'));
      wizard.transitionTutorialMachine('active.select', 'CONTINUE');
    },
  },
});
