import {
  DietFoodItem,
  EducationalArticle,
  LearningModuleItem,
  PublicSurveyMetric,
  QuizQuestion,
  SurveyQuestion,
} from '../types/portal';

export const PORTAL_IMAGES = {
  heroThali: '/src/assets/images/hero_balanced_thali_1795092158827.jpg',
  macronutrients: '/src/assets/images/nutrition_macronutrients_1795092142618.jpg',
  micronutrients: '/src/assets/images/nutrition_micronutrients_1795092152828.jpg',
  hygieneLifestyle: '/src/assets/images/hygiene_healthy_lifestyle_1795092160390.jpg',
  indianDietPlanner: '/src/assets/images/indian_diet_planner_1795092168710.jpg',
} as const;

export const HEALTHY_HABITS_LIST: string[] = [
  'Eat fruits & vegetables daily',
  'Drink 7-8 glasses of safe water',
  'Wash hands with soap before meals',
  'Limit sugary drinks & packaged snacks',
  'Include protein (dal, sprouts, curd) daily',
  'Do 30+ mins of physical activity',
  'Sleep 7-8 hours consistently',
  'Eat regular meals without skipping breakfast',
];

/**
 * Exact 10 questions used in BOTH Pre-Program and Post-Program Awareness Surveys
 * for valid, matched pre/post scoring.
 */
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    shortLabel: 'Q1 Balanced Diet',
    question: 'What is a balanced diet?',
    options: [
      'A meal containing only carbohydrates for quick energy',
      'A diet providing all essential nutrients in proper proportions for health',
      'Skipping dinner to reduce body weight rapidly',
      'Eating only high-protein supplements without vegetables',
    ],
    correctIndex: 1,
    explanation:
      'A balanced diet includes carbohydrates, proteins, healthy fats, vitamins, minerals, fibre, and safe water in appropriate daily proportions.',
  },
  {
    id: 2,
    shortLabel: 'Q2 Protein Source',
    question: 'Which of the following foods is a good natural source of protein?',
    options: [
      'Refined white sugar',
      'Carbonated soft drinks',
      'Lentils (dal), sprouts, paneer, and eggs',
      'Table salt',
    ],
    correctIndex: 2,
    explanation:
      'Pulses (dal), sprouted legumes, dairy (paneer/curd), nuts, and eggs are rich dietary sources of protein.',
  },
  {
    id: 3,
    shortLabel: 'Q3 Vitamin D',
    question: 'Which vitamin is naturally produced in human skin upon moderate sunlight exposure?',
    options: ['Vitamin C', 'Vitamin D', 'Vitamin B12', 'Vitamin K'],
    correctIndex: 1,
    explanation:
      'Moderate morning sunlight triggers Vitamin D synthesis in the skin, which is vital for calcium absorption and bone health.',
  },
  {
    id: 4,
    shortLabel: 'Q4 Green Veggies',
    question: 'Why should we include green leafy vegetables in our daily meals?',
    options: [
      'They are rich in iron, folate, vitamins, and dietary fibre',
      'They replace the need to drink water',
      'They contain high amounts of refined sugar',
      'They only add colour with no nutritional value',
    ],
    correctIndex: 0,
    explanation:
      'Green leafy vegetables like spinach, methi, and drumstick leaves supply iron, folate, Vitamin A, Vitamin C, and gut-friendly fibre.',
  },
  {
    id: 5,
    shortLabel: 'Q5 Hand Hygiene',
    question: 'How often should we wash our hands with soap before eating or preparing food?',
    options: [
      'Only when hands look visibly muddy',
      'Once a week',
      'Every single time before eating and cooking, for at least 20 seconds',
      'Rinsing quickly with plain water once a day is sufficient',
    ],
    correctIndex: 2,
    explanation:
      'Washing hands thoroughly with soap and clean water for at least 20 seconds before every meal prevents foodborne and diarrheal infections.',
  },
  {
    id: 6,
    shortLabel: 'Q6 Calcium Source',
    question: 'Which of the following foods is a rich source of calcium for strong bones and teeth?',
    options: [
      'Milk, curd, ragi (finger millet), and sesame seeds',
      'Deep-fried potato chips',
      'Sugary candy bars',
      'White polished rice alone',
    ],
    correctIndex: 0,
    explanation:
      'Dairy products (milk, curd, paneer), ragi, and sesame seeds provide bioavailable calcium essential for skeletal strength.',
  },
  {
    id: 7,
    shortLabel: 'Q7 Safe Water',
    question: 'Why is drinking clean, safe water important every day?',
    options: [
      'It prevents waterborne diseases and supports digestion, circulation, and temperature regulation',
      'It is only necessary during summer months',
      'It provides all daily protein requirements',
      'It eliminates the need for fruits and vegetables',
    ],
    correctIndex: 0,
    explanation:
      'Safe drinking water prevents infections like cholera and typhoid while keeping cells hydrated and organs functioning efficiently.',
  },
  {
    id: 8,
    shortLabel: 'Q8 Dietary Fibre',
    question: 'Which foods are good sources of dietary fibre?',
    options: [
      'Whole grains, oats, fruits, vegetables, and pulses',
      'Cooking oil and butter',
      'Fruit-flavoured soda and refined biscuits',
      'Table salt and white sugar',
    ],
    correctIndex: 0,
    explanation:
      'Whole grains, legumes, fruits, and vegetables provide soluble and insoluble fibre that aid digestion and regulate blood sugar.',
  },
  {
    id: 9,
    shortLabel: 'Q9 Physical Activity',
    question: 'Why is regular physical activity (at least 30 minutes daily) important?',
    options: [
      'It strengthens the heart, improves mental well-being, and helps maintain a healthy weight',
      'It allows a person to safely eat unlimited ultra-processed food',
      'It is only required for professional athletes',
      'It reduces the need for sleep to 3 hours a night',
    ],
    correctIndex: 0,
    explanation:
      'Regular movement improves cardiovascular endurance, insulin sensitivity, bone density, mood, and long-term disease prevention.',
  },
  {
    id: 10,
    shortLabel: 'Q10 Excess Sugar',
    question: 'What is a major health risk of frequent excessive sugar consumption?',
    options: [
      'Improved tooth enamel strength',
      'Increased risk of weight gain, tooth decay, and type 2 diabetes',
      'Higher iron absorption in the stomach',
      'Instant immunity against viral infections',
    ],
    correctIndex: 1,
    explanation:
      'Excess free sugar adds empty calories and significantly raises risks for dental caries, obesity, and metabolic disorders.',
  },
];

/**
 * 15-Question Interactive Nutrition Quiz
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Macronutrients',
    question: 'Which nutrient helps in building and repairing body tissues?',
    options: ['Protein', 'Sugar', 'Salt', 'Water'],
    correctIndex: 0,
    explanation: 'Proteins supply amino acids that build, maintain, and repair muscles, organs, enzymes, and tissues.',
  },
  {
    id: 2,
    category: 'Micronutrients',
    question: 'Deficiency of Iron in the diet most commonly leads to which condition?',
    options: ['Rickets', 'Anaemia', 'Scurvy', 'Night blindness'],
    correctIndex: 1,
    explanation: 'Iron is essential for haemoglobin synthesis; insufficient iron reduces oxygen transport, causing iron-deficiency anaemia.',
  },
  {
    id: 3,
    category: 'Micronutrients',
    question: 'Which vitamin enhances the absorption of plant-based (non-heme) iron when eaten together?',
    options: ['Vitamin C (e.g., lemon or amla)', 'Vitamin K', 'Vitamin E', 'Vitamin B6'],
    correctIndex: 0,
    explanation: 'Squeezing fresh lemon or eating amla alongside dal or spinach dramatically boosts plant iron absorption.',
  },
  {
    id: 4,
    category: 'Balanced Diet',
    question: 'According to healthy plate guidelines, roughly what portion of your meal plate should consist of vegetables and fruits?',
    options: ['About half the plate', 'Less than 5% of the plate', 'Only a tiny garnish', 'Zero if rice is included'],
    correctIndex: 0,
    explanation: 'Filling roughly half the plate with colourful vegetables and seasonal fruits ensures adequate micronutrients and fibre.',
  },
  {
    id: 5,
    category: 'Micronutrients',
    question: 'Carrots, papaya, and spinach are rich in beta-carotene, which the body converts into which vision-supporting vitamin?',
    options: ['Vitamin D', 'Vitamin A', 'Vitamin B12', 'Vitamin B1'],
    correctIndex: 1,
    explanation: 'Vitamin A supports healthy night vision, skin integrity, and mucosal immunity.',
  },
  {
    id: 6,
    category: 'Micronutrients',
    question: 'Which group should pay special attention to Vitamin B12 sources (milk, curd, fortified foods, or medical guidance)?',
    options: ['Strictly vegan diets with no animal products', 'People who drink water', 'People who walk outdoors', 'People who eat oranges'],
    correctIndex: 0,
    explanation: 'Vitamin B12 is naturally present mainly in animal-derived foods; vegans rely on fortified foods or guided supplementation.',
  },
  {
    id: 7,
    category: 'Macronutrients',
    question: 'Which of these provides complex carbohydrates for steady, sustained energy?',
    options: ['Whole-wheat chapati, oats, and brown rice', 'Glucose syrup candy', 'Sweetened cola', 'White sugar cubes'],
    correctIndex: 0,
    explanation: 'Complex carbohydrates digest gradually, preventing sudden blood-sugar spikes and mid-morning fatigue.',
  },
  {
    id: 8,
    category: 'Food Safety',
    question: 'What is the safest practice for storing cooked leftovers at home?',
    options: [
      'Leave uncovered on the kitchen counter overnight',
      'Cool briefly, cover in a clean container, and refrigerate promptly within 2 hours',
      'Mix raw meat and cooked vegetables in the same bowl',
      'Reheat only once a week',
    ],
    correctIndex: 1,
    explanation: 'Prompt refrigeration in clean, covered containers slows bacterial growth in the temperature danger zone.',
  },
  {
    id: 9,
    category: 'Healthy Habits',
    question: 'Why is eating a nutritious breakfast like idli-sambar, upma, or oats beneficial for students?',
    options: [
      'It replenishes overnight glucose levels and supports concentration and alertness',
      'It causes immediate drowsiness',
      'It eliminates the need for lunch',
      'It only matters on weekends',
    ],
    correctIndex: 0,
    explanation: 'A balanced breakfast stabilises morning energy, attention span, and memory during classes.',
  },
  {
    id: 10,
    category: 'Macronutrients',
    question: 'Which foods provide heart-healthy unsaturated fats?',
    options: [
      'Walnuts, almonds, flaxseeds, and groundnuts in moderation',
      'Repeatedly reheated street frying oil',
      'Artificial trans-fat bakery shortening',
      'Sugary cream frostings',
    ],
    correctIndex: 0,
    explanation: 'Nuts and seeds supply omega-3 and monounsaturated fats that support brain and cardiovascular health.',
  },
  {
    id: 11,
    category: 'Healthy Habits',
    question: 'The World Health Organization recommends limiting adult daily salt (sodium chloride) intake to less than:',
    options: ['5 grams (about 1 teaspoon) per day', '25 grams per day', '50 grams per day', 'There is no upper limit'],
    correctIndex: 0,
    explanation: 'Keeping daily salt below 5g helps prevent elevated blood pressure and reduces long-term cardiovascular strain.',
  },
  {
    id: 12,
    category: 'Personal Hygiene',
    question: 'Before cutting raw fruits or vegetables for a salad, what must you always do?',
    options: [
      'Wash them thoroughly under clean running water',
      'Wipe them with a dry cloth only',
      'Soak them in sugary syrup',
      'Skip washing if they look shiny',
    ],
    correctIndex: 0,
    explanation: 'Washing produce under clean running water removes surface dirt, microbes, and pesticide residues.',
  },
  {
    id: 13,
    category: 'Healthy Lifestyle',
    question: 'How many hours of quality sleep per night are generally recommended for young adults and college students?',
    options: ['3–4 hours', '7–9 hours', '14–16 hours', 'Sleep does not affect metabolism'],
    correctIndex: 1,
    explanation: 'Getting 7–9 hours of regular sleep supports memory consolidation, hormonal balance, immunity, and appetite regulation.',
  },
  {
    id: 14,
    category: 'Indian Nutrition',
    question: 'Why is combining cereals (like rice or chapati) with pulses (like dal or sambar) a smart traditional Indian pairing?',
    options: [
      'Together they provide a complete profile of essential amino acids',
      'They remove all vitamins from the meal',
      'They make the meal completely fat-free',
      'They double the refined sugar content',
    ],
    correctIndex: 0,
    explanation: 'Cereal-pulse combinations complement each other’s limiting amino acids, improving overall protein quality.',
  },
  {
    id: 15,
    category: 'Food Safety',
    question: 'What is a key indicator of ultra-processed packaged foods that should be limited?',
    options: [
      'Long ingredient lists high in added sugar, sodium, and refined oils',
      'Fresh whole fruits with natural skin',
      'Plain dry roasted chickpeas',
      'Unflavoured homemade curd',
    ],
    correctIndex: 0,
    explanation: 'Checking nutrition labels helps spot excess added sugars, sodium, and trans/saturated fats in packaged snacks.',
  },
];

/**
 * Curated Built-in Nutrition Education Articles (Topics A - F)
 */
export const BUILTIN_EDUCATION_ARTICLES: EducationalArticle[] = [
  {
    contentId: 'edu-balanced-diet',
    topic: 'Balanced Diet',
    title: 'A. Balanced Diet & The Indian Healthy Plate',
    summary:
      'Learn how combining whole grains, pulses, colourful vegetables, dairy, and safe water creates complete daily nourishment.',
    body: 'A balanced diet supplies your body with the right mix of carbohydrates, proteins, healthy fats, vitamins, minerals, fibre, and water every day. Rather than extreme dieting, the ICMR-NIN Indian Healthy Plate recommends filling roughly half your plate with seasonal vegetables and fruits, one-quarter with whole grains or millets (chapati, brown rice, ragi, idli), and one-quarter with protein-rich foods (dal, sambar, sprouts, paneer, curd, or eggs), paired with a small portion of nuts or healthy cooking oil.',
    keyPoints: [
      'Half plate: colourful seasonal vegetables and whole fruits for vitamins, minerals, and fibre.',
      'Quarter plate: whole grains or millets (wheat, oats, ragi, rice) for steady energy.',
      'Quarter plate: pulses, legumes, curd, paneer, or eggs for tissue repair and immunity.',
      'Traditional pairings like idli-sambar or chapati-dal naturally create complete plant proteins.',
    ],
    readTimeMinutes: 4,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.heroThali,
  },
  {
    contentId: 'edu-macronutrients',
    topic: 'Macronutrients',
    title: 'B. Macronutrients: Carbohydrates, Proteins & Healthy Fats',
    summary:
      'Understand the three primary energy-yielding nutrients, their daily roles in the human body, and accessible Indian food sources.',
    body: 'Macronutrients are needed in larger daily amounts to fuel brain function, muscle repair, and cellular structure. Complex carbohydrates (oats, whole wheat, millets, brown rice) deliver steady glucose without sharp energy crashes. Proteins (toor/moong dal, chickpeas, soy, paneer, curd, eggs, nuts) supply amino acids for growth, enzymes, and immunity. Healthy unsaturated fats (walnuts, almonds, flaxseeds, groundnuts, mustard/sesame oil in moderation) protect vital organs and help absorb fat-soluble vitamins A, D, E, and K.',
    keyPoints: [
      'Carbohydrates (4 kcal/g): Prefer whole grains, millets, and pulses over refined flour and white sugar.',
      'Proteins (4 kcal/g): Include at least one protein source in every meal—breakfast, lunch, and dinner.',
      'Healthy Fats (9 kcal/g): Use small amounts of nuts, seeds, and unrefined oils; avoid reheated trans fats.',
      'Dietary Fibre: Supports healthy gut bacteria, bowel regularity, and stable blood sugar.',
    ],
    readTimeMinutes: 5,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.macronutrients,
  },
  {
    contentId: 'edu-micronutrients',
    topic: 'Micronutrients',
    title: 'C. Micronutrients: Essential Vitamins & Minerals',
    summary:
      'Explore Iron, Calcium, and Vitamins A, B12, C, and D — why deficiencies happen and how everyday whole foods prevent them.',
    body: 'Although needed in milligram or microgram quantities, micronutrients act as the spark plugs of human metabolism. Preventing hidden hunger (micronutrient deficiency) starts with dietary diversity across colours and food groups.',
    keyPoints: [
      'Iron (spinach, methi, dates, jaggery, lentils): Builds haemoglobin and prevents fatigue and anaemia. Pair with Vitamin C!',
      'Calcium (milk, curd, ragi, sesame seeds, tofu): Strengthens bones, teeth, and muscle contraction.',
      'Vitamin A (carrots, papaya, mango, dark greens): Protects night vision and skin immunity.',
      'Vitamin B12 (milk, curd, paneer, eggs, fortified cereals): Vital for nerve health and red blood cell formation.',
      'Vitamin C (amla, oranges, guava, lemon, bell peppers): Supports immunity, wound healing, and plant iron absorption.',
      'Vitamin D (15–20 min morning sunlight, fortified milk, mushrooms): Enables calcium absorption and bone strength.',
    ],
    readTimeMinutes: 6,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.micronutrients,
  },
  {
    contentId: 'edu-healthy-habits',
    topic: 'Healthy Habits',
    title: 'D. Everyday Healthy Food Habits',
    summary:
      'Practical daily nutrition habits that students and families can sustain without expensive supplements.',
    body: 'Good nutrition is shaped more by consistent everyday habits than occasional "superfoods." Eating meals on time keeps energy stable during lectures and work, drinking adequate safe water prevents dehydration headaches, and reading packaged food labels helps cut down hidden added sugars, excess sodium, and ultra-processed fats.',
    keyPoints: [
      'Eat at least 4–5 servings of varied fruits and vegetables every day.',
      'Drink 7–8 glasses of safe, clean water; choose plain water or buttermilk over sugary sodas.',
      'Maintain regular meal timings and avoid skipping breakfast before college or work.',
      'Limit added sugar (<6 teaspoons/day) and salt (<5 grams/day); choose whole snacks like sprouts or fruit.',
    ],
    readTimeMinutes: 4,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.indianDietPlanner,
  },
  {
    contentId: 'edu-personal-hygiene',
    topic: 'Personal Hygiene',
    title: 'E. Personal Hygiene & Kitchen Food Safety',
    summary:
      'Simple, proven hygiene routines that prevent foodborne illness and protect family health.',
    body: 'Even the most nutritious meal can cause illness if contaminated by unwashed hands, unsafe water, or improper storage. Clean food handling interrupts the transmission of diarrheal pathogens and parasites, ensuring your body actually absorbs the nutrients you eat.',
    keyPoints: [
      'Wash hands thoroughly with soap and clean water for 20 seconds before eating, cooking, and after restroom use.',
      'Rinse all raw fruits, salads, and leafy greens thoroughly under clean running water.',
      'Store drinking water in clean, covered vessels and use filtered or boiled water when water quality is uncertain.',
      'Keep raw and cooked foods separate; cover leftovers and refrigerate within 2 hours of cooking.',
    ],
    readTimeMinutes: 4,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.hygieneLifestyle,
  },
  {
    contentId: 'edu-healthy-lifestyle',
    topic: 'Healthy Lifestyle',
    title: 'F. Active Movement, Sleep & Stress Balance',
    summary:
      'Nutrition works hand-in-hand with physical activity, restorative sleep, stress management, and personal cleanliness.',
    body: 'Health extends beyond what is on your plate. Chronic sleep deprivation increases stress hormones and cravings for sugary snacks, while sedentary routines weaken muscles and cardiovascular fitness. Combining balanced meals with 30 minutes of brisk walking, cycling, sports, or yoga plus 7–8 hours of regular sleep builds resilient physical and mental health.',
    keyPoints: [
      'Aim for at least 30–45 minutes of daily physical activity (brisk walking, sports, yoga, cycling).',
      'Maintain a consistent 7–8 hour sleep schedule and reduce bright screen exposure 45 minutes before bed.',
      'Practice daily stress relief through deep breathing, short study breaks, and social connection.',
      'Keep nails trimmed, living spaces ventilated, and personal hygiene consistent every day.',
    ],
    readTimeMinutes: 4,
    isPublished: true,
    isBuiltIn: true,
    imageUrl: PORTAL_IMAGES.hygieneLifestyle,
  },
];

/**
 * 6 Structured Interactive Learning Modules (Page 6)
 */
export const LEARNING_MODULES: LearningModuleItem[] = [
  {
    id: 'mod-balanced-plate',
    number: '01',
    title: 'Understanding a Balanced Diet',
    topic: 'Balanced Diet',
    duration: '4 min lesson',
    imageUrl: PORTAL_IMAGES.heroThali,
    summary: 'How to assemble a complete Indian meal plate using everyday grains, pulses, greens, and dairy.',
    sections: [
      {
        heading: 'What Makes a Diet Balanced?',
        content:
          'A balanced diet provides every essential nutrient—carbohydrates, proteins, healthy fats, vitamins, minerals, fibre, and water—in amounts suited to your age and activity level. No single food item contains every nutrient, so variety across food groups is essential.',
      },
      {
        heading: 'Smart Cereal + Pulse Synergy',
        content:
          'Indian staples like idli with sambar, rice with dal, or chapati with rajma naturally complement each other’s amino acids, creating high-quality protein at low cost.',
      },
    ],
    actionTips: [
      'Add a bowl of raw cucumber, carrot, or sprouted salad to lunch.',
      'Include at least two different colours of vegetables each day.',
    ],
    activityQuestion: 'Which plate combination best represents a balanced Indian lunch?',
    activityOptions: [
      'Only plain white rice and pickle',
      'Whole-wheat chapati, yellow dal, sautéed palak, salad, and curd',
      'Deep-fried samosas and sweetened soda',
    ],
    activityCorrectIndex: 1,
    activityFeedback: 'Correct! Combining grains, dal, greens, salad, and curd covers macros, micronutrients, fibre, and probiotics.',
  },
  {
    id: 'mod-macros-power',
    number: '02',
    title: 'Proteins, Carbs & Healthy Fats',
    topic: 'Macronutrients',
    duration: '5 min lesson',
    imageUrl: PORTAL_IMAGES.macronutrients,
    summary: 'Fueling study focus and physical strength with complex carbs, adequate protein, and quality fats.',
    sections: [
      {
        heading: 'Why Complex Carbs Beat Refined Sugar',
        content:
          'Whole grains like oats, ragi, and whole wheat digest slowly and keep concentration steady during long college lectures, whereas sugary snacks cause rapid blood-sugar spikes followed by fatigue.',
      },
      {
        heading: 'Daily Protein Targets Made Simple',
        content:
          'Many student diets are carb-heavy and protein-light. Adding moong sprouts, roasted chana, dal, paneer, curd, or eggs to each meal bridges the protein gap easily.',
      },
    ],
    actionTips: [
      'Swap afternoon biscuits for a handful of roasted groundnuts or sprouted moong.',
      'Include a bowl of thick dal or curd with both lunch and dinner.',
    ],
    activityQuestion: 'Which snack offers better sustained energy and protein for an afternoon study session?',
    activityOptions: [
      'Cream-filled refined biscuits and cola',
      'Sprouted moong salad with roasted almonds',
      'Plain sugar candy',
    ],
    activityCorrectIndex: 1,
    activityFeedback: 'Spot on! Sprouts and almonds combine plant protein, fibre, and healthy fats for steady mental focus.',
  },
  {
    id: 'mod-vitamins-minerals',
    number: '03',
    title: 'Preventing Vitamin & Mineral Deficiencies',
    topic: 'Micronutrients',
    duration: '5 min lesson',
    imageUrl: PORTAL_IMAGES.micronutrients,
    summary: 'Practical food combinations to prevent anaemia, weak bones, and low immunity.',
    sections: [
      {
        heading: 'Iron + Vitamin C Partnership',
        content:
          'Iron deficiency anaemia is widespread among students. Plant iron from spinach, lentils, and jaggery is absorbed far more effectively when paired with Vitamin C from lemon juice, amla, or oranges.',
      },
      {
        heading: 'Calcium + Sunlight Vitamin D',
        content:
          'Calcium from milk, curd, ragi, and sesame seeds requires Vitamin D to strengthen bones. Spending 15–20 minutes in gentle morning sunlight helps your skin produce Vitamin D naturally.',
      },
    ],
    actionTips: [
      'Squeeze fresh lemon over dal, poha, or leafy vegetable dishes.',
      'Take a 15-minute morning outdoor walk for natural Vitamin D synthesis.',
    ],
    activityQuestion: 'What simple habit helps your body absorb more iron from spinach and dal?',
    activityOptions: [
      'Squeezing fresh lemon (Vitamin C) onto the meal',
      'Drinking strong tea immediately with the meal',
      'Adding extra table salt',
    ],
    activityCorrectIndex: 0,
    activityFeedback: 'Correct! Vitamin C boosts non-heme iron uptake, whereas tea tannins right with meals can inhibit iron absorption.',
  },
  {
    id: 'mod-healthy-habits',
    number: '04',
    title: 'Building Sustainable Food Habits',
    topic: 'Healthy Habits',
    duration: '4 min lesson',
    imageUrl: PORTAL_IMAGES.indianDietPlanner,
    summary: 'Hydration, meal regularity, and reading packaged food labels to cut hidden sugar and salt.',
    sections: [
      {
        heading: 'Hydration & Safe Water',
        content:
          'Even mild dehydration impairs memory, mood, and reaction time. Keep a clean reusable water bottle nearby and sip safe water throughout the day rather than waiting until extreme thirst.',
      },
      {
        heading: 'Spotting Hidden Sugar & Sodium',
        content:
          'Packaged juices, instant noodles, and flavoured snacks frequently contain over half a day’s recommended sugar or salt in one packet. Whole fruits and homemade snacks protect long-term metabolic health.',
      },
    ],
    actionTips: [
      'Carry a clean water bottle to classes and refill with safe filtered water.',
      'Choose whole fruits instead of packaged sweetened fruit juices.',
    ],
    activityQuestion: 'Why is eating a whole orange generally healthier than drinking packaged sweetened orange juice?',
    activityOptions: [
      'Whole oranges retain natural dietary fibre and avoid added sugars',
      'Packaged juice has more fibre',
      'Whole oranges contain no water',
    ],
    activityCorrectIndex: 0,
    activityFeedback: 'Exactly right! Whole fruit fibre slows natural sugar absorption and keeps you fuller longer.',
  },
  {
    id: 'mod-hygiene-food-safety',
    number: '05',
    title: 'Personal Hygiene & Safe Food Handling',
    topic: 'Personal Hygiene',
    duration: '4 min lesson',
    imageUrl: PORTAL_IMAGES.hygieneLifestyle,
    summary: 'Handwashing, produce cleaning, clean water storage, and safe leftover practices.',
    sections: [
      {
        heading: 'The 20-Second Handwash Rule',
        content:
          'Lathering palms, backs of hands, between fingers, and under nails with soap for 20 seconds before every meal is one of the highest-impact public health practices on Earth.',
      },
      {
        heading: 'Clean Storage & Safe Preparation',
        content:
          'Always wash vegetables under clean running water before chopping. Store cooked meals covered, and refrigerate leftovers promptly to stop bacterial multiplication.',
      },
    ],
    actionTips: [
      'Wash hands with soap before eating—even snacks eaten with fingers.',
      'Inspect hostel/home drinking water containers to ensure lids stay tightly covered.',
    ],
    activityQuestion: 'Which step best prevents foodborne illness from raw salad vegetables?',
    activityOptions: [
      'Washing thoroughly under clean running water before chopping',
      'Wiping quickly with a reused kitchen rag',
      'Sprinkling extra salt without rinsing',
    ],
    activityCorrectIndex: 0,
    activityFeedback: 'Correct! Clean running water removes dirt, microbes, and surface residues safely.',
  },
  {
    id: 'mod-active-lifestyle',
    number: '06',
    title: 'Physical Activity, Sleep & Stress Care',
    topic: 'Healthy Lifestyle',
    duration: '4 min lesson',
    imageUrl: PORTAL_IMAGES.hygieneLifestyle,
    summary: 'Integrating movement, 7–8 hours of sleep, and stress hygiene into a student schedule.',
    sections: [
      {
        heading: 'Daily Movement Counts',
        content:
          'At least 30 minutes of moderate physical activity—brisk campus walking, cycling, badminton, yoga, or bodyweight exercises—boosts heart health, mood, and metabolic efficiency.',
      },
      {
        heading: 'Restorative Sleep & Stress',
        content:
          'Consistent 7–8 hour sleep cycles consolidate classroom learning and keep appetite hormones balanced. Short breathing breaks during exam prep lower cortisol and prevent stress-eating.',
      },
    ],
    actionTips: [
      'Take a 20-minute brisk walk after dinner or between afternoon study blocks.',
      'Set a consistent lights-out time and dim phone screens before sleep.',
    ],
    activityQuestion: 'How does getting 7–8 hours of consistent sleep support healthy nutrition?',
    activityOptions: [
      'It regulates appetite hormones and lowers cravings for sugary junk food',
      'It removes the need for eating breakfast',
      'It replaces physical exercise completely',
    ],
    activityCorrectIndex: 0,
    activityFeedback: 'Correct! Adequate sleep keeps ghrelin and leptin balanced, supporting smarter food choices.',
  },
];

/**
 * Interactive Indian Food-Based Diet Planner Catalog (Page 4)
 */
export const INDIAN_DIET_ITEMS: DietFoodItem[] = [
  // Breakfast
  {
    id: 'bf-idli',
    name: 'Steamed Idli with Sambar (2–3 pcs)',
    mealSlot: 'Breakfast',
    foodGroup: 'Complex Carbs',
    portion: '2–3 medium idlis + 1 bowl sambar',
    approxCalories: 260,
    benefit: 'Fermented, steamed, light on digestion, and pairs rice with lentil protein in sambar.',
  },
  {
    id: 'bf-dosa',
    name: 'Plain / Vegetable Dosa (Minimal Oil)',
    mealSlot: 'Breakfast',
    foodGroup: 'Complex Carbs',
    portion: '1–2 crisp dosas + chutney/sambar',
    approxCalories: 280,
    benefit: 'Fermented batter supports gut health and delivers balanced morning energy.',
  },
  {
    id: 'bf-upma',
    name: 'Vegetable Rava / Millet Upma',
    mealSlot: 'Breakfast',
    foodGroup: 'Complex Carbs',
    portion: '1 medium bowl with carrots & peas',
    approxCalories: 250,
    benefit: 'Adding mixed vegetables and roasted peanuts boosts fibre, vitamins, and satiety.',
  },
  {
    id: 'bf-oats',
    name: 'Oats Porridge / Vegetable Masala Oats',
    mealSlot: 'Breakfast',
    foodGroup: 'Complex Carbs',
    portion: '1 bowl cooked oats',
    approxCalories: 240,
    benefit: 'Rich in soluble beta-glucan fibre for steady energy and heart health.',
  },
  {
    id: 'bf-fruits',
    name: 'Seasonal Fresh Fruits (Banana, Papaya, Apple)',
    mealSlot: 'Breakfast',
    foodGroup: 'Vitamins & Fibre',
    portion: '1 bowl mixed cut fruits',
    approxCalories: 110,
    benefit: 'Supplies natural potassium, Vitamin C, hydration, and antioxidants.',
  },

  // Lunch
  {
    id: 'lu-rice',
    name: 'Steamed Rice / Hand-Pounded Brown Rice',
    mealSlot: 'Lunch',
    foodGroup: 'Complex Carbs',
    portion: '1 medium bowl',
    approxCalories: 210,
    benefit: 'Clean staple carbohydrate source; pair with generous dal and vegetables.',
  },
  {
    id: 'lu-chapati',
    name: 'Whole-Wheat Phulka / Chapati',
    mealSlot: 'Lunch',
    foodGroup: 'Complex Carbs',
    portion: '2 medium chapatis',
    approxCalories: 200,
    benefit: 'Provides whole-grain dietary fibre, B vitamins, and sustained afternoon energy.',
  },
  {
    id: 'lu-dal',
    name: 'Yellow Dal Tadka / Mixed Lentil Dal',
    mealSlot: 'Lunch',
    foodGroup: 'Protein',
    portion: '1 generous katori',
    approxCalories: 170,
    benefit: 'Essential plant protein, iron, and folate; squeeze lemon to boost iron uptake.',
  },
  {
    id: 'lu-veg',
    name: 'Seasonal Cooked Vegetables & Leafy Greens',
    mealSlot: 'Lunch',
    foodGroup: 'Vitamins & Fibre',
    portion: '1 full katori sabzi + raw salad',
    approxCalories: 120,
    benefit: 'Delivers iron, Vitamin A, Vitamin C, potassium, and protective phytonutrients.',
  },
  {
    id: 'lu-curd',
    name: 'Fresh Homemade Curd / Buttermilk',
    mealSlot: 'Lunch',
    foodGroup: 'Calcium & Probiotics',
    portion: '1 small bowl curd or 1 glass chaas',
    approxCalories: 95,
    benefit: 'Provides calcium, Vitamin B12, protein, and live beneficial gut probiotics.',
  },

  // Dinner
  {
    id: 'di-chapati',
    name: 'Soft Whole-Wheat Chapati',
    mealSlot: 'Dinner',
    foodGroup: 'Complex Carbs',
    portion: '2 chapatis',
    approxCalories: 200,
    benefit: 'Light, fibre-rich evening grain that digests comfortably before sleep.',
  },
  {
    id: 'di-veg-curry',
    name: 'Mixed Vegetable Curry / Palak Sabzi',
    mealSlot: 'Dinner',
    foodGroup: 'Vitamins & Fibre',
    portion: '1 generous bowl',
    approxCalories: 140,
    benefit: 'Adds micronutrient density and fullness without heavy oil or grease.',
  },
  {
    id: 'di-rice',
    name: 'Light Steamed Rice / Khichdi Portion',
    mealSlot: 'Dinner',
    foodGroup: 'Complex Carbs',
    portion: '1 small bowl',
    approxCalories: 180,
    benefit: 'Easy-to-digest evening comfort meal when paired with warm dal.',
  },
  {
    id: 'di-dal',
    name: 'Moong Dal / Rasam-Lentil Bowl',
    mealSlot: 'Dinner',
    foodGroup: 'Protein',
    portion: '1 bowl warm dal',
    approxCalories: 160,
    benefit: 'Light, easily digestible plant protein supporting overnight tissue recovery.',
  },

  // Snacks
  {
    id: 'sn-fruits',
    name: 'Fresh Seasonal Fruit Bowl (Guava, Apple, Pomegranate)',
    mealSlot: 'Snacks',
    foodGroup: 'Vitamins & Fibre',
    portion: '1 medium bowl',
    approxCalories: 100,
    benefit: 'Natural sweetness with zero refined sugar and high Vitamin C.',
  },
  {
    id: 'sn-nuts',
    name: 'Mixed Unsalted Nuts (Almonds, Walnuts, Peanuts)',
    mealSlot: 'Snacks',
    foodGroup: 'Healthy Fats',
    portion: '1 small handful (~25g)',
    approxCalories: 155,
    benefit: 'Rich in heart-healthy unsaturated fats, Vitamin E, magnesium, and brain-supporting omega-3s.',
  },
  {
    id: 'sn-sprouts',
    name: 'Moong & Chana Sprouts Chaat with Lemon',
    mealSlot: 'Snacks',
    foodGroup: 'Protein',
    portion: '1 bowl fresh sprouts with tomato & onion',
    approxCalories: 145,
    benefit: 'High-protein, high-fibre snack with enhanced Vitamin C bioavailability from sprouting.',
  },
];

/**
 * SAMPLE DEMONSTRATION DATASET (Strictly Simulated for VTU Demonstration Mode)
 * NEVER mixed with live collected Firestore data. Only displayed when user explicitly
 * activates "Preview Sample Demonstration Dataset" on the Analytics Dashboard.
 */
export const SAMPLE_DEMO_METRICS: PublicSurveyMetric[] = (() => {
  const preProfiles: { id: string; date: string; correctIndices: number[]; habits: string[] }[] = [
    { id: 'HN-2026-DM01', date: '2026-10-12', correctIndices: [0, 1, 4, 6, 8], habits: [HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[1]] },
    { id: 'HN-2026-DM02', date: '2026-10-12', correctIndices: [1, 3, 4, 6], habits: [HEALTHY_HABITS_LIST[2]] },
    { id: 'HN-2026-DM03', date: '2026-10-13', correctIndices: [0, 1, 2, 4, 6, 9], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[5]] },
    { id: 'HN-2026-DM04', date: '2026-10-13', correctIndices: [1, 4, 5, 6, 8], habits: [HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2]] },
    { id: 'HN-2026-DM05', date: '2026-10-14', correctIndices: [0, 3, 4, 6, 8, 9], habits: [HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[6]] },
    { id: 'HN-2026-DM06', date: '2026-10-14', correctIndices: [1, 4, 6], habits: [HEALTHY_HABITS_LIST[2]] },
    { id: 'HN-2026-DM07', date: '2026-10-15', correctIndices: [0, 1, 3, 4, 5, 6, 8], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2]] },
    { id: 'HN-2026-DM08', date: '2026-10-15', correctIndices: [0, 1, 4, 6, 9], habits: [HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[4]] },
    { id: 'HN-2026-DM09', date: '2026-10-16', correctIndices: [1, 2, 4, 6], habits: [HEALTHY_HABITS_LIST[1]] },
    { id: 'HN-2026-DM10', date: '2026-10-16', correctIndices: [0, 1, 3, 4, 6, 8], habits: [HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[5], HEALTHY_HABITS_LIST[7]] },
    { id: 'HN-2026-DM11', date: '2026-10-17', correctIndices: [1, 4, 6, 8], habits: [HEALTHY_HABITS_LIST[2]] },
    { id: 'HN-2026-DM12', date: '2026-10-17', correctIndices: [0, 1, 4, 5, 6], habits: [HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2]] },
  ];

  const postProfiles: { id: string; date: string; correctIndices: number[]; habits: string[] }[] = [
    { id: 'HN-2026-DM01', date: '2026-10-19', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8], habits: HEALTHY_HABITS_LIST.slice(0, 6) },
    { id: 'HN-2026-DM02', date: '2026-10-19', correctIndices: [0, 1, 2, 3, 4, 5, 6, 8], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[4], HEALTHY_HABITS_LIST[7]] },
    { id: 'HN-2026-DM03', date: '2026-10-20', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], habits: HEALTHY_HABITS_LIST.slice(0, 7) },
    { id: 'HN-2026-DM04', date: '2026-10-20', correctIndices: [0, 1, 2, 3, 4, 5, 6, 8, 9], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[3], HEALTHY_HABITS_LIST[4], HEALTHY_HABITS_LIST[5]] },
    { id: 'HN-2026-DM05', date: '2026-10-21', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[4], HEALTHY_HABITS_LIST[6], HEALTHY_HABITS_LIST[7]] },
    { id: 'HN-2026-DM06', date: '2026-10-21', correctIndices: [0, 1, 3, 4, 5, 6, 7, 8], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[3]] },
    { id: 'HN-2026-DM07', date: '2026-10-22', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], habits: HEALTHY_HABITS_LIST.slice(0, 7) },
    { id: 'HN-2026-DM08', date: '2026-10-22', correctIndices: [0, 1, 2, 3, 4, 5, 6, 8, 9], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[4], HEALTHY_HABITS_LIST[5]] },
    { id: 'HN-2026-DM09', date: '2026-10-23', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7], habits: [HEALTHY_HABITS_LIST[0], HEALTHY_HABITS_LIST[1], HEALTHY_HABITS_LIST[2], HEALTHY_HABITS_LIST[3], HEALTHY_HABITS_LIST[6]] },
    { id: 'HN-2026-DM10', date: '2026-10-23', correctIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], habits: HEALTHY_HABITS_LIST.slice(0, 8) },
  ];

  const makeResponses = (correctSet: number[]) =>
    SURVEY_QUESTIONS.map((q, idx) =>
      correctSet.includes(idx) ? q.correctIndex : (q.correctIndex + 1) % 4
    );

  const preDocs: PublicSurveyMetric[] = preProfiles.map((p) => ({
    participantId: p.id,
    ownerUid: 'sample-demo',
    surveyType: 'PRE-SURVEY',
    responses: makeResponses(p.correctIndices),
    correctCount: p.correctIndices.length,
    totalQuestions: 10,
    percentage: p.correctIndices.length * 10,
    adoptedHabits: p.habits,
    submissionDate: p.date,
    isPublicMetric: true,
    isDemo: true,
  }));

  const postDocs: PublicSurveyMetric[] = postProfiles.map((p) => ({
    participantId: p.id,
    ownerUid: 'sample-demo',
    surveyType: 'POST-SURVEY',
    responses: makeResponses(p.correctIndices),
    correctCount: p.correctIndices.length,
    totalQuestions: 10,
    percentage: p.correctIndices.length * 10,
    adoptedHabits: p.habits,
    submissionDate: p.date,
    isPublicMetric: true,
    isDemo: true,
  }));

  return [...preDocs, ...postDocs];
})();
