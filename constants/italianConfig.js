// italianConfig.js

import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['it'] = {
    monthNames: [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
    ],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Luned�', 'Marted�', 'Mercoled�', 'Gioved�', 'Venerd�', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    today: "Oggi"
};

LocaleConfig.defaultLocale = 'it';

export default LocaleConfig;
