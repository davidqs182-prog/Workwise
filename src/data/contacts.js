// Agencias y redes de talento donde David se presenta una vez para que lo propongan en proyectos.
// Para añadir un contacto: copia un objeto y rellena los campos. "person" solo con datos verificados.
// url: null = web oficial aún por verificar.

export const CONTACTS_UPDATED = '2026-10-14';

export const CONTACTS = [
  // Consultoras de UX / Product Design: hacen lo mismo que David y trabajan con freelancers o contratan.
  // Nombres y correos sacados del Impressum o de la página de contacto oficial (14.10.2026).
  {
    id: 'clearleft', group: 'consulting', name: 'Clearleft', region: 'Brighton, UK', url: 'https://clearleft.com/about/jobs/freelancing',
    email: 'info@clearleft.com', person: null,
    what: {
      es: 'Consultora de UX y design strategy. Buscan freelancers en user research, UX/UI y product design.',
      de: 'UX- und Design-Strategy-Beratung. Suchen Freelancer für User Research, UX/UI und Product Design.',
    },
    how: { es: 'Correo corto con CV o portafolio (lo piden así en su web)', de: 'Kurze Mail mit Lebenslauf oder Portfolio (so auf der Website verlangt)' },
    note: { es: 'Mejor encaje: piden exactamente tu perfil. Escribir en inglés.', de: 'Beste Passung: suchen genau dein Profil. Auf Englisch schreiben.' },
  },
  {
    id: 'ergosign', group: 'consulting', name: 'Ergosign GmbH', region: 'Saarbrücken, DE', url: 'https://www.ergosign.de',
    email: 'contact@ergosign.de', person: { name: 'Markus Kühner, Florian Straßer', role: { es: 'Geschäftsführer', de: 'Geschäftsführer' } },
    what: { es: 'Una de las mayores consultoras de UX de Alemania, software B2B e industrial.', de: 'Eine der größten UX-Beratungen Deutschlands, B2B- und Industriesoftware.' },
    how: { es: 'Correo de presentación en alemán', de: 'Vorstellungsmail auf Deutsch' },
    note: null,
  },
  {
    id: 'centigrade', group: 'consulting', name: 'Centigrade GmbH', region: 'Saarbrücken, DE', url: 'https://www.centigrade.de',
    email: 'contact@centigrade.de', person: { name: 'Thomas Immich', role: { es: 'Geschäftsführer', de: 'Geschäftsführer' } },
    what: { es: 'Consultora de UX y design systems para software complejo.', de: 'UX- und Design-System-Beratung für komplexe Software.' },
    how: { es: 'Correo de presentación en alemán', de: 'Vorstellungsmail auf Deutsch' },
    note: null,
  },
  {
    id: 'uid', group: 'consulting', name: 'UID GmbH', region: 'Darmstadt, DE', url: 'https://www.uid.com',
    email: 'info@uid.com', person: { name: 'Ralph Siegert', role: { es: 'Geschäftsführer', de: 'Geschäftsführer' } },
    what: { es: 'Consultora de UX: research, concepto y diseño de interfaces.', de: 'UX-Beratung: Research, Konzeption und Interface Design.' },
    how: { es: 'Correo de presentación en alemán', de: 'Vorstellungsmail auf Deutsch' },
    note: null,
  },
  {
    id: 'usability-de', group: 'consulting', name: 'usability.de', region: 'Hannover, DE', url: 'https://www.usability.de',
    email: null, person: { name: 'Torsten Bartel, Gesine Quint', role: { es: 'Geschäftsführer', de: 'Geschäftsführer' } },
    what: { es: 'Agencia de UX independiente: diseño, research, testing, consultoría y accesibilidad.', de: 'Unabhängige UX-Agentur: Design, Research, Testing, Beratung und Barrierefreiheit.' },
    how: { es: 'Formulario de contacto o teléfono 0511 360 50 70 (no publican correo)', de: 'Kontaktformular oder Telefon 0511 360 50 70 (keine Mail veröffentlicht)' },
    note: null,
  },
  {
    id: 'edenspiekermann', group: 'consulting', name: 'Edenspiekermann', region: 'Berlin · Stockholm · Los Angeles', url: 'https://www.edenspiekermann.com',
    email: 'berlin@edenspiekermann.com', person: { name: 'Christian Hanke', role: { es: 'CEO', de: 'CEO' } },
    what: { es: 'Estudio de diseño de producto y marca. Aceptan aplicaciones espontáneas.', de: 'Studio für Product und Brand Design. Nehmen Initiativbewerbungen an.' },
    how: { es: 'Correo o aplicación espontánea en su portal de empleo', de: 'Mail oder Initiativbewerbung im Jobportal' },
    note: null,
  },
  {
    id: 'becklyn', group: 'consulting', name: 'Unic Becklyn AG', region: 'Stuttgart, DE', url: 'https://becklyn.com',
    email: 'hello@becklyn.com', person: { name: 'Florian Schwarzbeck, Marko Puclin, Christoph Hautzinger', role: { es: 'Vorstand', de: 'Vorstand' } },
    what: { es: 'Agencia digital con UX/UI design y producto.', de: 'Digitalagentur mit UX/UI Design und Produktentwicklung.' },
    how: { es: 'Correo de presentación en alemán', de: 'Vorstellungsmail auf Deutsch' },
    note: null,
  },
  {
    id: 'clay', group: 'consulting', name: 'Clay', region: 'San Francisco · NY · Lisboa', url: 'https://clay.global',
    email: 'hey@clay.global', person: null,
    what: { es: 'Agencia de UI/UX y producto para startups y grandes marcas; oficina en Lisboa.', de: 'UI/UX- und Produktagentur für Startups und große Marken; Büro in Lissabon.' },
    how: { es: 'Correo en inglés o "open positions" en su web', de: 'Mail auf Englisch oder „Open Positions“ auf der Website' },
    note: null,
  },

  // Redes de talento: te aplicas una vez y te proponen proyectos
  {
    id: 'toptal', group: 'network', name: 'Toptal', region: 'Global', url: 'https://www.toptal.com',
    person: null,
    what: {
      es: 'Freelance UX, UI y product design para empresas grandes y startups. Tú pones la tarifa, ellos facturan.',
      de: 'Freelance UX, UI und Product Design für Konzerne und Startups. Du legst den Satz fest, sie rechnen ab.',
    },
    how: { es: 'Formulario "Join as a Freelancer" (selección por fases)', de: 'Formular „Join as a Freelancer“ (mehrstufige Auswahl)' },
    note: { es: 'Muy selectivos, aceptan menos del 3%.', de: 'Sehr selektiv, unter 3 % werden aufgenommen.' },
  },
  {
    id: 'arc', group: 'network', name: 'Arc', region: 'Global', url: 'https://arc.dev',
    person: null,
    what: { es: 'Freelance y puestos fijos remotos para diseñadores.', de: 'Freelance und Festanstellungen remote für Designer.' },
    how: { es: 'Registro como talento + test de comunicación', de: 'Registrierung als Talent + Kommunikationstest' },
    note: { es: 'El test es en inglés.', de: 'Der Test ist auf Englisch.' },
  },
  {
    id: 'contra', group: 'network', name: 'Contra', region: 'Global', url: 'https://contra.com',
    person: null,
    what: { es: 'Proyectos freelance sin comisión, perfil tipo portafolio.', de: 'Freelance-Projekte ohne Provision, Profil wie ein Portfolio.' },
    how: { es: 'Crear perfil de "independent"', de: 'Profil als „Independent“ anlegen' },
    note: { es: 'Bueno para visibilidad.', de: 'Gut für Sichtbarkeit.' },
  },
  {
    id: 'design-humans', group: 'network', name: 'Design Humans', region: 'USA · LATAM · Europa', url: null,
    person: null,
    what: {
      es: 'Reclutamiento de diseño (UX, product, research, design ops). Contratan en Europa vía Employer of Record.',
      de: 'Design-Recruiting (UX, Product, Research, Design Ops). Stellen in Europa über Employer of Record ein.',
    },
    how: { es: 'Formulario de aplicación en su web', de: 'Bewerbungsformular auf der Website' },
    note: { es: 'Todo su equipo de recruiting viene del diseño.', de: 'Das ganze Recruiting-Team kommt aus dem Design.' },
  },
  {
    id: 'pangea', group: 'network', name: 'Pangea', region: 'Global', url: null,
    person: null,
    what: { es: 'Talento fraccional de diseño y marketing.', de: 'Fractional Talent für Design und Marketing.' },
    how: { es: 'Registro en su web', de: 'Registrierung auf der Website' },
    note: { es: 'Encaja también con media buying.', de: 'Passt auch zu Media Buying.' },
  },

  // Agencias de reclutamiento: personas reales te proponen
  {
    id: 'consortia', group: 'agency', name: 'Consortia', region: 'UK · Europa · DACH', url: 'https://www.consortia.com',
    person: null,
    what: {
      es: 'Puestos UX y product design, fijos y freelance. Publican roles remotos en Alemania.',
      de: 'UX- und Product-Design-Stellen, fest und freelance. Schreiben Remote-Rollen in Deutschland aus.',
    },
    how: { es: 'Registrar CV o aplicar a un rol abierto', de: 'Lebenslauf hinterlegen oder auf offene Rolle bewerben' },
    note: { es: 'Mejor encaje para Alemania.', de: 'Beste Passung für Deutschland.' },
  },
  {
    id: 'academy', group: 'agency', name: 'Academy', region: 'USA · UK', url: null,
    person: null,
    what: { es: 'Staffing UX y product design, red de más de 5.000 profesionales.', de: 'UX- und Product-Design-Staffing, Netzwerk mit über 5.000 Leuten.' },
    how: { es: 'Registro como candidato', de: 'Registrierung als Kandidat' },
    note: { es: 'Fuerte en USA.', de: 'Stark in den USA.' },
  },
  {
    id: 'major-players', group: 'agency', name: 'Major Players', region: 'UK · USA', url: null,
    person: null,
    what: { es: 'Freelance y fijos en diseño, UX, brand y performance.', de: 'Freelance und fest in Design, UX, Brand und Performance.' },
    how: { es: 'Registro como candidato', de: 'Registrierung als Kandidat' },
    note: { es: 'También perfiles de performance marketing.', de: 'Auch Performance-Marketing-Profile.' },
  },
  {
    id: 'aquent', group: 'agency', name: 'Aquent', region: 'USA · Global', url: 'https://aquent.com',
    person: null,
    what: { es: 'Red grande de diseño y digital, contratos y fijos.', de: 'Großes Design- und Digital-Netzwerk, Verträge und Festanstellungen.' },
    how: { es: 'Registro como talento', de: 'Registrierung als Talent' },
    note: null,
  },
  {
    id: 'creative-circle', group: 'agency', name: 'Creative Circle', region: 'USA', url: 'https://www.creativecircle.com',
    person: null,
    what: { es: 'Freelance y fijos en diseño.', de: 'Freelance und Festanstellungen im Design.' },
    how: { es: 'Registro como talento', de: 'Registrierung als Talent' },
    note: { es: 'Más enfocado a USA.', de: 'Eher auf die USA fokussiert.' },
  },
];

export const CONTACT_STATUSES = ['new', 'sent', 'pool', 'contacted', 'project', 'discarded'];
