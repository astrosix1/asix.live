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
  {
    slug: 'stop-doomscrolling',
    product: 'ascend',
    badge: 'Ascend · Focus',
    headline: 'Stop Doomscrolling and Get Your Attention Back',
    subheadline:
      'The average person spends over 2 hours a day on negative news feeds. Ascend gives that time somewhere better to go.',
    problemTitle: 'Doomscrolling is a loop, not a choice.',
    problemIntro:
      'Bad news triggers the same threat-detection system that kept your ancestors alive. Your brain is not malfunctioning — it is doing exactly what it was built to do. The problem is that the feed never ends.',
    painPoints: [
      {
        headline: 'You open the app to "stay informed" and lose an hour.',
        body: 'There is always one more story. The algorithm surfaces outrage because outrage keeps you reading. You close the app more anxious than when you opened it.',
      },
      {
        headline: 'It bleeds into the rest of your day.',
        body: 'You carry the mood of the feed into meetings, conversations, and sleep. The scroll does not stay in the app — it sits in your head for hours.',
      },
      {
        headline: 'Willpower alone has never fixed it.',
        body: 'You have told yourself to stop a hundred times. The reflex is faster than the resolve. You need a system, not a reminder.',
      },
    ],
    solutionTitle: 'Replace the loop with a streak worth keeping.',
    solutionBody:
      'Ascend works by giving the doomscroll reflex a better target. Every time you feel the pull toward the feed, a habit you have already set up is waiting instead. Over days and weeks, the replacement crowds out the loop.',
    features: [
      {
        icon: '🎯',
        title: 'Trigger-aware replacements',
        body: 'Set a replacement habit tied to the moments you usually scroll — morning, lunch, before bed. The trigger stays; the response changes.',
      },
      {
        icon: '🔥',
        title: 'Daily streak tracking',
        body: 'Every day you hold the line adds to a number worth protecting. The streak becomes the motivation that willpower never was.',
      },
      {
        icon: '📊',
        title: 'Time reclaimed counter',
        body: 'See how many hours you have taken back as the days compound. The number is surprisingly large, and surprisingly motivating.',
      },
    ],
    stepsTitle: 'Three steps to your first scroll-free week',
    steps: [
      {
        number: '01',
        title: 'Name the trigger moment',
        body: 'When do you usually open the feed — first thing in bed, waiting for coffee, on the couch at night? Name it and you can plan for it.',
      },
      {
        number: '02',
        title: 'Set a one-minute replacement',
        body: 'Pick something tiny for that moment: stretching, a glass of water, three deep breaths. Ascend tracks it. One minute still counts.',
      },
      {
        number: '03',
        title: 'Watch the streak protect itself',
        body: 'By day five, breaking the streak feels worse than any news story. That is the system working.',
      },
    ],
    ctaHeadline: 'Your attention is worth more than the feed.',
    ctaBody: 'Start your first scroll-free streak today.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Stop Doomscrolling For Good | Ascend by asix.live',
      description:
        'Doomscrolling averages 2+ hours a day. Ascend replaces the loop with a streak and a habit you actually want — $4.99/month.',
    },
  },
  {
    slug: 'reduce-screen-time',
    product: 'ascend',
    badge: 'Ascend · Focus',
    headline: 'Reclaim 2 Hours a Day from Your Phone',
    subheadline:
      'The average adult spends over 7 hours a day on screens. Ascend helps you take back the hours that actually matter.',
    problemTitle: 'Screen time is not a moral failure — it is a design problem.',
    problemIntro:
      'Every app on your phone was built by teams whose job is to keep you there. Reducing screen time without a replacement plan is walking into that fight unarmed.',
    painPoints: [
      {
        headline: 'You check your phone 96 times a day on average.',
        body: 'Most of those checks happen without a reason. Boredom, habit, and reflex drive them — not need. Each one costs a small slice of your attention.',
      },
      {
        headline: 'Screen time settings do not actually help.',
        body: 'You tap "Ignore Limit" every time. The notification is easy to dismiss because there is nothing waiting on the other side of it.',
      },
      {
        headline: 'The hours are gone before you notice them.',
        body: 'You sit down for five minutes and look up forty minutes later. Screen time does not feel like a choice because by the time you notice, it already happened.',
      },
    ],
    solutionTitle: 'Give your hands something better to hold.',
    solutionBody:
      'Ascend tracks what you do instead of scrolling — reading, moving, creating, anything. As the streak for the replacement habit grows, the screen habit shrinks. You are not fighting your phone; you are outgrowing it.',
    features: [
      {
        icon: '⏱️',
        title: 'Replacement habit timer',
        body: 'Log the minutes you spend on the alternative. Watch the replacement total grow alongside the days of your streak.',
      },
      {
        icon: '🧱',
        title: 'Habit stacking',
        body: 'Attach phone-free habits to existing anchors — after meals, before sleep, first hour of the day. Anchored habits are twice as likely to stick.',
      },
      {
        icon: '📅',
        title: 'Weekly progress view',
        body: 'See which days were strongest and weakest. Patterns surface quickly, and patterns you can see are patterns you can change.',
      },
    ],
    stepsTitle: 'How to cut screen time without white-knuckling it',
    steps: [
      {
        number: '01',
        title: 'Pick one phone-free window',
        body: 'Not all day — one hour. First thing in the morning or the hour before bed. A single phone-free window changes the whole shape of a day.',
      },
      {
        number: '02',
        title: 'Fill it with something trackable',
        body: 'Add a habit to Ascend for that window: a walk, a chapter, a workout, anything. The replacement makes the absence feel like gain, not loss.',
      },
      {
        number: '03',
        title: 'Expand as the habit holds',
        body: 'Once one window is stable, add another. Two phone-free hours per day is 730 hours per year — over a month of reclaimed time.',
      },
    ],
    ctaHeadline: 'Two hours a day is 730 hours a year.',
    ctaBody: 'Start with one phone-free hour and build from there.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Reduce Screen Time That Actually Sticks | Ascend by asix.live',
      description:
        'The average adult spends 7+ hours on screens daily. Ascend replaces screen time with habits worth keeping — $4.99/month.',
    },
  },
  {
    slug: 'beat-procrastination',
    product: 'ascend',
    badge: 'Ascend · Productivity',
    headline: 'Beat Procrastination With Systems, Not Willpower',
    subheadline:
      '20% of adults are chronic procrastinators. Ascend replaces the avoidance loop with a daily habit that makes starting automatic.',
    problemTitle: 'Procrastination is not laziness. It is emotion regulation.',
    problemIntro:
      'You avoid the task because it triggers anxiety, boredom, or self-doubt. The avoidance feels like relief — for about twenty seconds. Then the guilt compounds the problem.',
    painPoints: [
      {
        headline: 'You plan the task instead of doing it.',
        body: 'Reorganizing your to-do list, setting new timers, finding the perfect app — these feel productive but are procrastination wearing a disguise.',
      },
      {
        headline: 'The longer you wait, the harder it gets.',
        body: 'Avoidance grows the perceived difficulty of the task. Something that takes twenty minutes feels monumental after three days of putting it off.',
      },
      {
        headline: 'Motivation is not the problem.',
        body: 'Waiting until you feel ready means waiting until the deadline panic arrives. The feeling never comes first — action does.',
      },
    ],
    solutionTitle: 'Make starting a habit, not a decision.',
    solutionBody:
      'Ascend builds a daily "start habit" — a two-minute anchor at a consistent time each day where you begin the thing you have been avoiding. The habit is not about finishing; it is about starting. Starting gets easier every time you do it.',
    features: [
      {
        icon: '🚀',
        title: 'Start habit timer',
        body: 'Set a daily two-minute start time. When the prompt arrives, you open the work — nothing more. Ascend tracks the streak.',
      },
      {
        icon: '🔥',
        title: 'Streak-based momentum',
        body: 'Seven consecutive start days creates more momentum than any motivational content. The streak is the system.',
      },
      {
        icon: '📈',
        title: 'Completion tracking',
        body: 'Log what you finished alongside what you started. Watching both numbers grow closes the feedback loop that makes the habit self-reinforcing.',
      },
    ],
    stepsTitle: 'The three-step anti-procrastination protocol',
    steps: [
      {
        number: '01',
        title: 'Name the one thing you keep avoiding',
        body: 'Not a category — a specific task or type of work. "Write" is too vague. "Open the draft and write one sentence" is a habit.',
      },
      {
        number: '02',
        title: 'Set a daily two-minute start time',
        body: 'Pick a time you can commit to every day. Set it in Ascend. When the prompt fires, you start — just two minutes. You almost always continue.',
      },
      {
        number: '03',
        title: 'Track starts, not just completions',
        body: 'Give yourself credit for showing up even when the session is short. Completion follows consistency; consistency follows showing up.',
      },
    ],
    ctaHeadline: 'The task is not the obstacle. The start is.',
    ctaBody: 'Build the start habit and the rest follows.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Beat Procrastination With Daily Habits | Ascend by asix.live',
      description:
        'Procrastination is an emotion problem, not a time problem. Ascend builds the start habit that makes action automatic — $4.99/month.',
    },
  },
  {
    slug: 'quit-vaping',
    product: 'ascend',
    badge: 'Ascend · Habit Replacement',
    headline: 'Quit Vaping for Good with a Habit That Actually Replaces It',
    subheadline:
      'Cold turkey works for 5% of people. Replacement habit therapy has triple the success rate. Ascend is built around that difference.',
    problemTitle: 'Your body adapted to nicotine. It needs something else now.',
    problemIntro:
      'Vaping delivers nicotine faster than cigarettes and disappears anywhere — which is exactly what makes it so hard to stop. The craving is physical, the habit is behavioral, and both need a response.',
    painPoints: [
      {
        headline: 'The craving hits in seconds and fades in minutes.',
        body: 'If you can get through the first three to five minutes of a craving, it passes. Most people reach for the vape because they have nothing else to do in that window.',
      },
      {
        headline: 'It is invisible, which makes it everywhere.',
        body: 'Vapes fit in a pocket and produce no smell. There is no social friction left to slow the habit down — which means you have to build the friction yourself.',
      },
      {
        headline: 'Quitting cold turkey creates a vacuum.',
        body: 'When you remove the behavior without replacing it, stress and boredom hit harder. Most relapses happen in the first two weeks, in exactly those moments.',
      },
    ],
    solutionTitle: 'Outlast the craving with a habit already in place.',
    solutionBody:
      'Ascend pairs your quit with a replacement behavior timed to the craving window — something you can do in three to five minutes. As the replacement habit gains a streak, the craving loses its hold. The goal is not white-knuckling it; it is making the replacement automatic.',
    features: [
      {
        icon: '⏱️',
        title: 'Craving window replacements',
        body: 'Set a three-minute habit for the moments you most often vape. Ascend tracks every time you choose the replacement over the device.',
      },
      {
        icon: '🔥',
        title: 'Quit streak with recovery notes',
        body: 'See your nicotine-free days compound. Add optional notes on cravings, triggers, or wins. The log becomes the evidence that you are changing.',
      },
      {
        icon: '📈',
        title: 'Recovery timeline',
        body: 'Track what returns as the days accumulate — taste, sleep, breathing, energy. The physical benefits become the motivation to continue.',
      },
    ],
    stepsTitle: 'Your first two weeks of quitting vaping',
    steps: [
      {
        number: '01',
        title: 'Name your highest-risk moments',
        body: 'After meals, during stress, in the car, before sleep. Pick the two or three moments when you vape most automatically.',
      },
      {
        number: '02',
        title: 'Set a replacement for each trigger',
        body: 'Cold water, a short walk, controlled breathing, chewing gum. The replacement does not need to be powerful — it needs to outlast the craving window.',
      },
      {
        number: '03',
        title: 'Track the streak daily',
        body: 'Check in with Ascend every evening. A seven-day streak changes the biology; a thirty-day streak changes the identity. Both start on day one.',
      },
    ],
    ctaHeadline: 'The craving lasts three minutes. The streak lasts a lifetime.',
    ctaBody: 'Start your quit streak today with a replacement that actually works.',
    price: '$4.99/month',
    checkoutPlan: 'ascend',
    metadata: {
      title: 'Quit Vaping For Good | Ascend by asix.live',
      description:
        'Cold turkey has a 5% success rate. Ascend uses replacement habit therapy to make quitting vaping stick — $4.99/month.',
    },
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((uc) => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map((uc) => uc.slug);
}
