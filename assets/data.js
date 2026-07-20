/* ============================================================
   TopRatedVAs.com — demo VA dataset (v1 seed)
   All profiles are fictional "Example profile" data, not unlockable.
   Phase 5 will move this into Firestore; Browse & Profile read it now.
   ============================================================ */
(function () {
  "use strict";

  // Score → tier metadata (Elite 95+ / Pro 90+ / Certified 80+)
  window.TRV_scoreMeta = function (score) {
    if (typeof score !== 'number') return { tier: 'cert', label: '', color: '#0A8A70', badge: 'b-cert' };
    if (score >= 95) return { tier: 'elite', label: 'Elite', color: '#C9962E', badge: 'b-elite' };
    if (score >= 90) return { tier: 'pro', label: 'Pro', color: '#3E7FE8', badge: 'b-pro' };
    return { tier: 'cert', label: 'Certified', color: '#0A8A70', badge: 'b-cert' };
  };

  // hire type + rate helpers used by the Browse filters
  window.TRV_VAS = [
    { id: 'maria-d', cert: 'TR-1042', initials: 'MD', grad: 'linear-gradient(135deg,#0FB893,#0A6E5A)',
      name: 'Maria D.', tier: 'elite', tierLabel: 'Elite', flag: '🇵🇭', city: 'Cebu', country: 'Philippines', tz: 'GMT+8',
      avail: 'av-now', availLabel: 'Available now', certs: [['Customer Service', 96], ['Order Fulfillment', 91]],
      stars: '★★★★★', rating: '4.9', reviews: 12, hourly: 4.5, monthly: 640, hireTypes: ['hourly', 'monthly'],
      negotiable: true, english: 9, answerSpeed: 'A', hours: 40, unlocks: '5 unlocks',
      bio: 'Three years running eBay dropshipping support — messages, returns, and cases handled the dropship-safe way.' },

    { id: 'grace-t', cert: 'TR-1051', initials: 'GT', grad: 'linear-gradient(135deg,#C9962E,#8F6A1D)',
      name: 'Grace T.', tier: 'elite', tierLabel: 'Elite · Manager', flag: '🇵🇭', city: 'Davao', country: 'Philippines', tz: 'GMT+8',
      avail: 'av-open', availLabel: 'Open to offers', certs: [['VA Manager', 92], ['All 4 specialist certs', '✓']],
      stars: '★★★★★', rating: '5.0', reviews: 8, hourly: null, monthly: 900, hireTypes: ['monthly'],
      negotiable: true, english: 10, answerSpeed: 'A', hours: 40, unlocks: '9 unlocks',
      bio: 'The "One VA" — runs an entire store solo, supervising specialist VAs and AI agents end to end.' },

    { id: 'jomar-p', cert: 'TR-1044', initials: 'JP', grad: 'linear-gradient(135deg,#3E7FE8,#1E4FA8)',
      name: 'Jomar P.', tier: 'pro', tierLabel: 'Pro', flag: '🇵🇭', city: 'Manila', country: 'Philippines', tz: 'GMT+8',
      avail: 'av-now', availLabel: 'Available now', certs: [['Listing', 93], ['Sourcing / Sniping', 88]],
      stars: '★★★★☆', rating: '4.7', reviews: 6, hourly: 3.75, monthly: null, hireTypes: ['hourly'],
      negotiable: false, english: 8, answerSpeed: 'B', hours: 20, unlocks: '3 unlocks',
      bio: 'Fast, accurate lister with a sniping eye — builds clean catalogs and finds the winners.' },

    { id: 'kevin-o', cert: 'TR-1063', initials: 'KO', grad: 'linear-gradient(135deg,#E8901A,#B5722A)',
      name: 'Kevin O.', tier: 'elite', tierLabel: 'Elite', flag: '🇰🇪', city: 'Nairobi', country: 'Kenya', tz: 'GMT+3',
      avail: 'av-now', availLabel: 'Available now', certs: [['Order Fulfillment', 97], ['Customer Service', 82]],
      stars: '★★★★★', rating: '4.8', reviews: 9, hourly: null, monthly: 600, hireTypes: ['monthly'],
      negotiable: true, english: 9, answerSpeed: 'A', hours: 40, unlocks: '4 unlocks',
      bio: 'Order-fulfillment specialist obsessed with on-time tracking and account health.' },

    { id: 'priya-s', cert: 'TR-1070', initials: 'PS', grad: 'linear-gradient(135deg,#8E6BC9,#5F4FA8)',
      name: 'Priya S.', tier: 'pro', tierLabel: 'Pro', flag: '🇮🇳', city: 'Pune', country: 'India', tz: 'GMT+5:30',
      avail: 'av-now', availLabel: 'Available now', certs: [['Listing', 90], ['Sourcing / Sniping', 85]],
      stars: '★★★★☆', rating: '4.6', reviews: 5, hourly: 3.0, monthly: null, hireTypes: ['hourly'],
      negotiable: true, english: 8, answerSpeed: 'B', hours: 40, unlocks: '',
      bio: 'High-volume lister comfortable with bulk tools and daily sniping quotas.' },

    { id: 'carlos-m', cert: 'TR-1078', initials: 'CM', grad: 'linear-gradient(135deg,#E25555,#A83232)',
      name: 'Carlos M.', tier: 'elite', tierLabel: 'Elite', flag: '🇻🇪', city: 'Caracas', country: 'Venezuela', tz: 'GMT-4',
      avail: 'av-now', availLabel: 'Available now', certs: [['Sourcing / Sniping', 95]],
      stars: '★★★★★', rating: '4.9', reviews: 7, hourly: 2.75, monthly: null, hireTypes: ['hourly'],
      negotiable: false, english: 7, answerSpeed: 'A', hours: 40, unlocks: '2 unlocks',
      bio: 'US-timezone sourcing specialist — finds profitable gaps competitors miss.' },

    { id: 'ana-r', cert: 'TR-1082', initials: 'AR', grad: 'linear-gradient(135deg,#0FB893,#3E7FE8)',
      name: 'Ana R.', tier: 'cert', tierLabel: 'Certified', flag: '🇷🇸', city: 'Belgrade', country: 'Serbia', tz: 'GMT+2',
      avail: 'av-open', availLabel: 'Open to offers', certs: [['Customer Service', 84]],
      stars: '★★★★★', rating: '5.0', reviews: 2, hourly: 5.0, monthly: null, hireTypes: ['hourly'],
      negotiable: false, english: 9, answerSpeed: 'B', hours: 15, unlocks: '',
      bio: 'Native-level English support for premium stores; part-time, EU hours.' },

    { id: 'dmitri-k', cert: 'TR-1090', initials: 'DK', grad: 'linear-gradient(135deg,#5F7C8A,#3A4E58)',
      name: 'Dmitri K.', tier: 'cert', tierLabel: 'Certified', flag: '🇺🇦', city: 'Kyiv', country: 'Ukraine', tz: 'GMT+3',
      avail: 'av-hired', availLabel: 'Hired 🎉', certs: [['Order Fulfillment', 86], ['Listing', 81]],
      stars: '★★★★☆', rating: '4.5', reviews: 4, hourly: 4.0, monthly: null, hireTypes: ['hourly'],
      negotiable: true, english: 8, answerSpeed: 'B', hours: 40, unlocks: '',
      bio: 'Reliable fulfillment + listing generalist. Currently hired — open again soon.' },

    { id: 'bea-l', cert: 'TR-1095', initials: 'BL', grad: 'linear-gradient(135deg,#0FB893,#0A8A70)',
      name: 'Bea L.', tier: 'pro', tierLabel: 'Pro', flag: '🇵🇭', city: 'Iloilo', country: 'Philippines', tz: 'GMT+8',
      avail: 'av-now', availLabel: 'Available now', certs: [['Customer Service', 92], ['Listing', 88]],
      stars: '★★★★★', rating: '4.8', reviews: 10, hourly: 4.0, monthly: 620, hireTypes: ['hourly', 'monthly'],
      negotiable: true, english: 9, answerSpeed: 'A', hours: 40, unlocks: '6 unlocks',
      bio: 'Warm, fast buyer communication plus tidy listing work — a dependable all-rounder.' },

    { id: 'samuel-a', cert: 'TR-1101', initials: 'SA', grad: 'linear-gradient(135deg,#0A8A70,#86B817)',
      name: 'Samuel A.', tier: 'elite', tierLabel: 'Elite', flag: '🇳🇬', city: 'Lagos', country: 'Nigeria', tz: 'GMT+1',
      avail: 'av-now', availLabel: 'Available now', certs: [['Sourcing / Sniping', 96], ['Order Fulfillment', 90]],
      stars: '★★★★★', rating: '4.9', reviews: 6, hourly: null, monthly: 650, hireTypes: ['monthly'],
      negotiable: true, english: 8, answerSpeed: 'A', hours: 40, unlocks: '3 unlocks',
      bio: 'Sourcing + fulfillment double threat; scales daily item quotas without VERO slips.' },

    { id: 'diana-c', cert: 'TR-1108', initials: 'DC', grad: 'linear-gradient(135deg,#FFAA2B,#E8901A)',
      name: 'Diana C.', tier: 'cert', tierLabel: 'Certified', flag: '🇨🇴', city: 'Bogotá', country: 'Colombia', tz: 'GMT-5',
      avail: 'av-open', availLabel: 'Open to offers', certs: [['Listing', 83]],
      stars: '★★★★☆', rating: '4.6', reviews: 3, hourly: 3.25, monthly: null, hireTypes: ['hourly'],
      negotiable: true, english: 8, answerSpeed: 'B', hours: 25, unlocks: '',
      bio: 'US-hours lister building a strong track record; eager and detail-oriented.' },

    { id: 'rae-m', cert: 'TR-1112', initials: 'RM', grad: 'linear-gradient(135deg,#3E7FE8,#0FB893)',
      name: 'Rae M.', tier: 'elite', tierLabel: 'Elite · Manager', flag: '🇵🇭', city: 'Cebu', country: 'Philippines', tz: 'GMT+8',
      avail: 'av-now', availLabel: 'Available now', certs: [['VA Manager', 95], ['All 4 specialist certs', '✓']],
      stars: '★★★★★', rating: '5.0', reviews: 9, hourly: null, monthly: 950, hireTypes: ['monthly'],
      negotiable: true, english: 10, answerSpeed: 'A', hours: 40, unlocks: '7 unlocks',
      bio: 'Elite VA Manager — trains specialists, supervises AI agents, owns the store dashboard.' },
  ];
})();
