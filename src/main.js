import { createApp} from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { faUsers} from '@fortawesome/free-solid-svg-icons';
import { faUserCheck} from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faGamepad);
library.add(faUsers);
library.add(faUserCheck);
library.add(faBan);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
console.log("Vue started");
