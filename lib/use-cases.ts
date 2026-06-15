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
  {
    slug: 'build-a-morning-routine',
    product: 'ascend',
    badge: 'Ascend · Daily Habits',
    headline: 'Build a Morning Routine That Actually Sticks',
    subheadline:
      'Most routines collapse by day three. Ascend gives you a streak worth protecting and habits small enough to keep.',
    problemTitle: 'Mornings don\'t fix themselves.',
    problemIntro:
      'You\'ve planned the perfect morning a dozen times. The alarm hits and the plan evaporates.',
    painPoints: [
      {
        headline: 'The snooze button always wins.',
        body: 'Without something concrete waiting for you, the easiest move is always to sleep longer. Good intentions don\'t survive a warm bed.',
      },
      {
        headline: 'Your routine is too ambitious to survive.',
        body: 'You plan for an hour of exercise, journaling, reading, and meditation. One thing slips and the whole morning falls apart.',
      },
      {
        headline: 'Inconsistency resets all the progress.',
        body: 'The benefits of a morning routine compound over weeks — but only if you actually show up. One bad week and you\'re starting over.',
      },
    ],
    solutionTitle: 'Small habits. Daily streaks. Real momentum.',
    solutionBody:
      'Ascend works by making your morning routine the smallest possible version of itself — then tracking every day you show up. A two-minute check-in still counts. The streak builds. The habit becomes automatic.',
    features: [
      {
        icon: '⏰',
        title: 'Daily reminders',
        body: 'A nudge at the right time is worth more than any willpower. Set your morning check-in time once and Ascend keeps you on track.',
      },
      {
        icon: '🧱',
        title: 'Habit stacking',
        body: 'Attach new habits to ones you already have. Ascend helps you build a sequence — wake, hydrate, move — that flows without thinking.',
      },
      {
        icon: '📅',
        title: 'Streak calendar',
        body: 'See your consistency at a glance. A chain of green days is surprisingly hard to break once it\'s long enough.',
      },
    ],
    stepsTitle: 'Your first week in three steps',
    steps: [
      {
        number: '01',
        title: 'Pick two habits — not ten',
        body: 'Start with the smallest version of your ideal morning. Drink water. Do five minutes of movement. Two things you can\'t fail at.',
      },
      {
        number: '02',
        title: 'Set a check-in reminder',
        body: 'Choose a time right after you wake up. Ascend sends a prompt — you tap done. That\'s the whole habit for day one.',
      },
      {
        number: '03',
        title: 'Add habits as the streak grows',
        body: 'Once two habits are automatic, add a third. Build up gradually so the routine expands without ever feeling fragile.',
      },
    ],
    ctaHeadline: 'Tomorrow morning could be different.',
    ctaBody: 'Start small. Track it. Watch it compound.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Build a Morning Routine That Sticks | Ascend by asix.live',
      description:
        'Stop planning the perfect morning and start showing up for a small one. Ascend tracks your streaks and builds consistency — $4.99/month.',
    },
  },
  {
    slug: 'replace-bad-habits',
    product: 'ascend',
    badge: 'Ascend · Habit Replacement',
    headline: 'Replace Bad Habits Before They Replace You',
    subheadline:
      'Cutting a habit cold turkey rarely works. Ascend gives it somewhere better to go.',
    problemTitle: 'You\'re not the problem. The loop is.',
    problemIntro:
      'Bad habits aren\'t character flaws — they\'re patterns that formed because they worked. Breaking them means building something that works better.',
    painPoints: [
      {
        headline: 'Willpower runs out by noon.',
        body: 'Relying on discipline alone means every day is a battle you have to win from scratch. One stressful moment and the old habit returns.',
      },
      {
        headline: 'Cutting it out leaves a gap.',
        body: 'When you remove a habit without replacing it, the gap stays. Boredom, stress, or routine triggers will fill it — usually with the same behavior.',
      },
      {
        headline: 'Guilt after a slip makes it worse.',
        body: 'One missed day spirals into "I\'ve already ruined it." The all-or-nothing mindset is what makes most habit changes collapse, not the habit itself.',
      },
    ],
    solutionTitle: 'Give the habit somewhere better to go.',
    solutionBody:
      'Ascend pairs every habit you want to quit with one you want to build. The trigger stays the same — what you do when it fires changes. Over time, the new behavior takes over the slot the old one occupied.',
    features: [
      {
        icon: '🔄',
        title: 'Habit replacement pairing',
        body: 'Link a replacement directly to the habit you\'re quitting. When the urge hits, Ascend reminds you what to do instead.',
      },
      {
        icon: '📈',
        title: 'Recovery timeline',
        body: 'See what actually changes as the days compound — energy, sleep, focus, time. The visible progress becomes its own motivation.',
      },
      {
        icon: '🛡️',
        title: 'Streak resilience',
        body: 'Missing a day doesn\'t end your streak\'s momentum. Ascend shows your overall trend, not just a single number, so one slip doesn\'t become a reason to quit.',
      },
    ],
    stepsTitle: 'How habit replacement actually works',
    steps: [
      {
        number: '01',
        title: 'Name the habit and its trigger',
        body: 'Add the behavior you want to change. Note when it usually happens — stress, boredom, after meals. Knowing the trigger is half the fix.',
      },
      {
        number: '02',
        title: 'Choose a replacement for that moment',
        body: 'Pick something you can do in the same moment. A two-minute walk instead of a cigarette. Water instead of a snack. Small and specific wins.',
      },
      {
        number: '03',
        title: 'Track both habits together',
        body: 'Ascend shows the quit habit and the replacement side by side. As one line trends down and the other up, the shift becomes visible.',
      },
    ],
    ctaHeadline: 'The habit you want to quit has a replacement waiting.',
    ctaBody: 'Ascend helps you find it, track it, and make it permanent.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Replace Bad Habits For Good | Ascend by asix.live',
      description:
        'Bad habits don\'t disappear — they get replaced. Ascend pairs what you\'re quitting with what you\'re building, and tracks both — $4.99/month.',
    },
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((uc) => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map((uc) => uc.slug);
}
