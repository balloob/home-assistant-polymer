import {
  configGetters,
  navigationGetters,
  authActions,
  navigationActions,
} from '../util/home-assistant-js-instance';

import Polymer from '../polymer';
import nuclearObserver from '../util/bound-nuclear-behavior';

require('./stream-status');

export default new Polymer({
  is: 'ha-sidebar',

  behaviors: [nuclearObserver],

  properties: {
    menuShown: {
      type: Boolean,
    },

    menuSelected: {
      type: String,
    },

    selected: {
      type: String,
      bindNuclear: navigationGetters.activePane,
      observer: 'selectedChanged',
    },

    hasHistoryComponent: {
      type: Boolean,
      bindNuclear: configGetters.isComponentLoaded('history'),
    },

    hasLogbookComponent: {
      type: Boolean,
      bindNuclear: configGetters.isComponentLoaded('logbook'),
    },
  },

  selectedChanged(newVal) {
    const menuItems = this.querySelectorAll('.menu [data-panel]');

    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].getAttribute('data-panel') === newVal) {
        menuItems[i].classList.add('selected');
      } else {
        menuItems[i].classList.remove('selected');
      }
    }
  },

  menuClicked(ev) {
    let target = ev.target;
    let checks = 5;

    // find panel to select
    while (checks && !target.getAttribute('data-panel')) {
      target = target.parentElement;
      checks--;
    }

    if (checks) {
      this.selectPanel(target.getAttribute('data-panel'));
    }
  },

  handleDevClick(ev) {
    // prevent it from highlighting first menu item
    document.activeElement.blur();
    this.menuClicked(ev);
  },

  toggleMenu() {
    this.fire('close-menu');
  },

  selectPanel(newChoice) {
    if (newChoice === this.selected) {
      return;
    } else if (newChoice === 'logout') {
      this.handleLogOut();
      return;
    }
    navigationActions.navigate.apply(null, newChoice.split('/'));
  },

  handleLogOut() {
    authActions.logOut();
  },
});
