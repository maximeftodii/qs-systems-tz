/**
 * Application constants and configuration
 */

// Application URLs
const URLS = {
  BASE_URL: 'https://app.qsystemsglobal.com/VST/MDA/WebApp'
};

// Supported languages
const LANGUAGES = {
  RUSSIAN: 'ru',
  ENGLISH: 'en',
  ROMANIAN: 'ro'
};

// Timeout configurations
const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 15000,
  NAVIGATION: 30000
};

// Form field options
const FORM_OPTIONS = {
  AGE_GROUPS: [
    '0 - 12 years',
    '13 - 18 years', 
    '19 - 24 years',
    '25 - 34 years',
    '35 - 44 years',
    '45 - 54 years',
    '55 - 64 years',
    '65 years and over'
  ],
  
  GENDERS: ['Female', 'Male'],
  
  IDENTITY_OPTIONS: [
    'Nici una din cele menționate',
    'Persoană care m-am aflat mai mult de 3 luni în afa',
    'Person with TB',
    'Person living with HIV',
    'Refugee',
    'Person with a disability'
  ],
  
  STUDIES_LEVELS: [
    'Primare',
    'Gimnaziale', 
    'Liceale',
    'Universitare',
    'Post-universitare'
  ],
  
  LOCATIONS: [
    'Anenii Noi',
    'Basarabeasca',
    'Bender',
    'Briceni',
    'Cahul',
    'Camenca',
    'Cantemir',
    'Comrat',
    'Criuleni',
    'Dnestrovsk',
    'Drochia'
  ],
  
  LOCATION_TYPES: ['District', 'Area'],
  
  TYPE_OF_USER_OPTIONS: [
    'Persoana din grup de risc la Tuberculoză',
    'Person in TB treatment',
    'Persoană cu experiență de TB',
    'Person affiliated to a person with TB',
    'Civil society/community organization representative',
    'Medical worker',
    'Social worker'
  ]
};

// TB Barriers configuration
const TB_BARRIERS = {
  'Nu am acces la medicamente pentru efectele adverse ale tratamentului TB': {
    options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat prescrierea', 'Altele']
  },
  'Nu am acces la tratament asistat video pentru TB': {
    options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat includerea', 'Altele']
  },
  'Nu am acces la serviciile psihologului.': {
    options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat consultatia', 'Altele']
  },
  'Nu am acces la servicii de diagnostic pentru TB': {
    options: ['Nu stiu unde sa ma adresez', 'Mi s-a refuzat referirea', 'Nu am bani pentru investigatii', 'Altele']
  },
  'Nu am acces la tratament antituberculos': {
    options: ['Medicamentele nu sunt disponibile', 'Nu stiu unde sa ma adresez', 'Nu am posibilitate sa ma deplasez dupa medicamente pentru ca nu am bani de drum', 'Nu am posibilitate sa ma deplasez dupa medicamente din alte cauze', 'Altele']
  },
  'Nu am acces la tratament preventiv pentru TB pentru copii': {
    options: ['Medicamentele nu sunt disponibile', 'Nu stiu unde sa ma adresez', 'Nu am posibilitate sa ma deplasez dupa medicamente', 'Altele']
  },
  'Îmi este dificil să urmez tratamentul pentru TB pentru că nu este adaptat nevoilor mele': {
    options: ['am copii mici acasa de care trebuie sa am grija', 'trebuie să merg zilnic la lucru', 'lucrez peste hotare', 'sunt in varsta si nu ma pot deplasa', 'apartin unei populații cheie (migrant, immigrant, PTHIV, PUD, LGBT, LS)', 'apartin unei minoritati etnice', 'Altele']
  }
};

// UI Text constants
const UI_TEXT = {
  BARRIERS_MENU: 'Reporting identified barriers',
  ANONYMOUS_REPORTING: 'Reporting anonymous',
  ADD_BUTTON: 'Add',
  REPORTS_TEXT: 'Report panel',
  DEMOGRAPHIC_TEXT: 'Demographic communities',
  RIGHTS_BUTTON_TEXT: 'Dreptul la viața si Dreptul la cel mai inalt standard realizabil de sănătate fizică și mentală'
};

// Dropdown field labels
const DROPDOWN_LABELS = {
  GENDER: 'Gender',
  IDENTITY: 'I identify myself as...',
  LOCATION: 'Location',
  LOCATION_TYPE: 'Location type',
  STUDIES_LEVEL: 'Studies level',
  TYPE_OF_USER: 'TypeOfUser',
  PHONE: 'Phone',
  AGE_GROUP: 'Age group'
};

module.exports = {
  URLS,
  LANGUAGES,
  TIMEOUTS,
  FORM_OPTIONS,
  TB_BARRIERS,
  UI_TEXT,
  DROPDOWN_LABELS
}; 