// Arabic project content + section chrome, shared by the /ar/ homepage and the
// /ar/work/ page so the translated copy lives in one place.

export type ArProjectCover = 'relora' | 'ads-ai' | 'kamperownia' | 'notch';

export interface ArProject {
  cover: ArProjectCover;
  external: boolean;
  href: string;
  title: string;
  description: string;
  tags: string[];
  problem: string;
  system: string;
  artifact: string;
  outcome: string;
}

export const arChrome = {
  problem: 'التحدّي', system: 'النظام', artifact: 'المُخرَج', outcome: 'النتيجة',
  featured: 'مميّز', viewProject: 'عرض المشروع', explore: 'استكشف', caseStudy: 'دراسة الحالة',
};

export const arWorkI18n = {
  eyebrow: 'أعمال مختارة', title: 'مشاريع أُطلقت.', titleSecondary: 'أنظمة ما زالت تعمل.', allLink: 'كل الأعمال ←',
  ctaEyebrow: 'لنعمل معًا', ctaHeading: 'مشكلة إيراد تستحق الحل؟', ctaBody: 'ثلاثون دقيقة. نحدّد نقطة الاختناق وهل تستحق الشراكة.', ctaLink: 'احجز مكالمة ←',
};

export const arProjects: ArProject[] = [
  {
    cover: 'relora', external: true, href: 'https://relora-jet.vercel.app/',
    title: 'Relora',
    description: 'نظام تشغيل للعلاقات لفرق العقارات في الجهات الحكومية المحلية. مكان واحد لجهات الاتصال، وسياق المالك، وحالة التواصل، والخطوات التالية.',
    tags: ['سير عمل بالذكاء الاصطناعي', 'CRM مبسّط', 'لوحة عمليات'],
    problem: 'محادثات الملّاك المهمة كانت مبعثرة بين البريد والملاحظات والذاكرة.',
    system: 'جهات الاتصال والعلاقات والملخّصات والحالة والمتابعة في عرض تشغيلي واحد.',
    artifact: 'تطبيق تجريبي مباشر بلوحة معلومات وخريطة علاقات وتدفّق مهام.',
    outcome: 'تتبّع العلاقات اليدوي يتحوّل إلى طابور تشغيلي منظّم.',
  },
  {
    cover: 'ads-ai', external: true, href: 'https://ads-assistant-three.vercel.app/',
    title: 'AdsAI · مساعد الإعلانات',
    description: 'غرفة تحكّم لإعلانات Google قائمة على الذكاء الاصطناعي: الإنفاق، ROAS، توافق ICP، أولويات الحملات، والإجراء التالي الأفضل في مساحة واحدة.',
    tags: ['ذكاء اصطناعي', 'إعلانات', 'GTM', 'أدوات المُشغِّل'],
    problem: 'تحسين الإعلانات كان موزّعًا بين التقارير والحدس والفحوصات المتكررة.',
    system: 'الميزانية وICP وROAS والتنبيهات والإجراءات في حلقة قرار واحدة.',
    artifact: 'لوحة مباشرة بأولويات الحملات وطابور التحسين.',
    outcome: 'يرى المُشغِّل ما يوقفه أو يحلّله أو يحسّنه دون البحث في التقارير.',
  },
  {
    cover: 'kamperownia', external: true, href: 'https://camper-rental-weld.vercel.app/',
    title: 'محرّك حجز تأجير الكرفانات',
    description: 'موقع تأجير كرفانات ذاتي الخدمة لتصفّح المركبات والتحقق من التواريخ والانتقال من الاهتمام إلى الحجز بسرعة.',
    tags: ['منتج', 'حجوزات', 'تطبيق ويب'],
    problem: 'الطلب على التأجير كان يحتاج مسارًا أوضح من التصفّح إلى الحجز.',
    system: 'المخزون والتواريخ وصياغة العرض وزر الحجز في تدفّق واجهي واحد.',
    artifact: 'موقع حجز متجاوب ببطاقات مركبات ونقطة بحث.',
    outcome: 'حركة استفسار يدوية تتحوّل إلى تجربة حجز مُنتَجة.',
  },
  {
    cover: 'notch', external: false, href: '/apps/notch/',
    title: 'NotchCue',
    description: 'مفهوم تيليبرومبتر لنظام macOS للمكالمات والعروض والتسجيلات. يبقي الملاحظات قرب الكاميرا ليبقى الإلقاء طبيعيًا.',
    tags: ['macOS', 'Swift', 'مبني بالذكاء الاصطناعي'],
    problem: 'الملاحظات بعيدة عن الكاميرا، ما يكسر التواصل البصري أثناء المكالمات والعروض.',
    system: 'النصوص تظهر حول نوتش الماك بوك بسطح قراءة مركّز.',
    artifact: 'موقع منتج ومفهوم تطبيق مبني حول منطقة الكاميرا.',
    outcome: 'المتحدّث يحافظ على البنية دون أن يبدو وكأنه يقرأ.',
  },
];
