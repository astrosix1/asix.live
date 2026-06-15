export interface UseCasePainPoint {
  headline: string;
  body: string;
}

export interface UseCaseFeature {
  icon: string;
  title: string;
  body: string;
}

export interface UseCaseStep {
  number: string;
  title: string;
  body: string;
}

export interface UseCase {
  slug: string;
  product: 'ascend' | 'geointel' | 'wikihole';
  badge: string;
  headline: string;
  subheadline: string;
  problemTitle: string;
  problemIntro: string;
  painPoints: UseCasePainPoint[];
  solutionTitle: string;
  solutionBody: string;
  features: UseCaseFeature[];
  stepsTitle: string;
  steps: UseCaseStep[];
  ctaHeadline: string;
  ctaBody: string;
  price: string;
  checkoutPlan: string;
  metadata: {
    title: string;
    description: string;
  };
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'quit-social-media',
    product: 'ascend',
    badge: 'Ascend · Habit Replacement',
    headline: 'Finally Quit Social Media For Good',
    subheadline:
      'Ascend doesn\'t just restrict your screen time — it replaces the scroll habit with something worth keeping.',
    problemTitle: 'The scroll trap is designed to hold you.',
    problemIntro:
      'Social media apps spend billions engineering the urge to open them. Willpower is not a fair fight.',
    painPoints: [
      {
        headline: 'One notification, forty-five minutes gone.',
        body: 'You pick up your phone to check one thing. The feed pulls you in. You surface half an hour later with nothing to show for it.',
      },
      {
        headline: 'Every attempt to quit fades in a week.',
        body: 'You delete the app. You reinstall it. The cycle repeats because you never built anything to fill the gap.',
      },
      {
        headline: 'The habit lives in your hands, not the app.',
        body: 'Blocking apps only moves the craving — it doesn\'t replace it. The reflex to reach for your phone stays even when the app is gone.',
      },
    ],
    solutionTitle: 'Replace the habit, not just the app.',
    solutionBody:
      'Ascend works by giving the scroll reflex somewhere better to go. Every time you feel the urge, you have a hobby, a streak, and a goal already waiting. The new habit gradually fills the space the old one left behind.',
    features: [
      {
        icon: '🔥',
        title: 'Streak protection',
        body: 'Every day you hold the line becomes a number worth protecting. Missing day 12 hurts more than missing day 1 — that\'s the mechanic working for you.',
      },
      {
        icon: '🔄',
        title: 'Habit stacking',
        body: 'Pair quitting with a replacement — reading, exercise, journaling, anything. Ascend tracks both so the new habit crowds out the old one.',
      },
      {
        icon: '📈',
        title: 'Recovery timeline',
        body: 'See what actually happens to your focus, sleep, and free time as the days compound. The benefits become the motivation.',
      },
    ],
    stepsTitle: 'Three steps to your first streak',
    steps: [
      {
        number: '01',
        title: 'Name the habit you\'re quitting',
        body: 'Add "Social media" as a habit to replace. Set how many minutes per day is your target — zero, or a realistic starting limit.',
      },
      {
        number: '02',
        title: 'Set a replacement',
        body: 'Choose one thing to do instead — even five minutes of reading counts. Ascend tracks it alongside the quit habit so you build both at once.',
      },
      {
        number: '03',
        title: 'Protect your streak',
        body: 'Check in daily. Watch your streak grow. The longer it gets, the more it works in your favor.',
      },
    ],
    ctaHeadline: 'Start your first streak today.',
    ctaBody: 'Join Ascend and build the habit that outlasts the scroll.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Quit Social Media For Good | Ascend by asix.live',
      description:
        'Ascend replaces the scroll habit with hobbies that stick. Streak tracking, habit stacking, and a recovery timeline — $4.99/month.',
    },
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((uc) => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map((uc) => uc.slug);
}
