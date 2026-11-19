# Health and Nutrition Awareness Portal (VTU AEC Lab Project)

A full-stack, interactive **Health and Nutrition Awareness Portal** designed for VTU Ability Enhancement Course (AEC) Lab demonstration and evaluation. The platform measures real community awareness improvement using matched Pre-Program and Post-Program surveys, guided Indian-context nutrition education, an interactive Indian diet planner, a 15-question quiz, Chart.js analytics, Firebase Firestore persistence, and a role-protected Admin Dashboard.

---

## Key Modules & Pages (11 Complete Views)

1. **Home Page (`#/`):** Hero introduction, live Firestore impact statistics, why nutrition matters, balanced diet foundations, healthy vs. unhealthy comparison table, daily habits, featured nutrition tips, and verified participant testimonials.
2. **About Project (`#/about`):** VTU AEC Lab objectives, problem statement, target audience, expected outcomes, and measurable engineering evaluation checklist.
3. **Nutrition Education (`#/nutrition`):** Searchable, filterable curriculum covering Topics A–F (Balanced Diet, Macronutrients, Micronutrients [Iron, Calcium, Vitamins A/B12/C/D], Healthy Habits, Personal Hygiene, Healthy Lifestyle) plus custom admin-published articles.
4. **Indian Healthy Diet Planner (`#/diet-planner`):** Interactive daily meal planner featuring Indian staples (Idli, Dosa, Upma, Oats, Rice, Chapati, Dal, Vegetables, Curd, Fruits, Nuts, Sprouts) with real-time food-group coverage tracking and an explicit non-medical educational disclaimer.
5. **Pre-Program Awareness Survey (`#/pre-survey`):** Generates a unique Participant ID (`HN-YYYY-XXXXXX`), collects non-identifying demographics, 10 standardized knowledge MCQs, baseline healthy practices, and explicit data consent; prevents duplicates and atomically saves to Firestore (or clearly labelled Local Sandbox mode).
6. **Health Awareness Learning Modules (`#/learning`):** 6 structured lessons with expandable reading sections, practical actions, interactive self-check activities, and progress tracking.
7. **Nutrition Quiz (`#/quiz`):** 15-question multiple-choice quiz with Next/Previous navigation, progress tracking, score breakdown, detailed answer explanations, and Firestore persistence.
8. **Post-Program Awareness Survey (`#/post-survey`):** Matches the participant via unique Participant ID, uses the identical 10 knowledge questions, prevents duplicate submissions, records habit adoption and learning feedback, and calculates immediate Pre vs. Post score improvement.
9. **Results & Analytics Dashboard (`#/dashboard`):** 6 KPI stat cards and 5 Chart.js visualizations (Pre vs. Post comparison, Awareness Levels, Question-wise Q1–Q10 performance, Healthy Habit Adoption, Participation Breakdown), CSV export, Print Report, and transparent separation between **Live Firestore Data**, **Local Sandbox**, and **Sample Demonstration Dataset**.
10. **Admin Dashboard (`#/admin`):** Firebase Authentication + RBAC-protected console for viewing participants, matched pre/post trajectories, survey records, feedback, publishing sanitized testimonials, managing custom educational articles, and exporting CSV reports.
11. **Contact & Feedback (`#/contact`):** Project details, privacy notice, and Firestore-backed feedback form.

---

## Firestore Database Architecture

Defined in `firebase-blueprint.json` and secured by `firestore.rules`:

- `users/{userId}` — Private user profiles (owner or admin read only).
- `admins/{userId}` — Role-based access control lookup documents.
- `participants/{participantId}` — Participant demographics, pre/post scores, and module completion progress.
- `pre_surveys/{participantId}` — Immutable baseline survey records (keyed by Participant ID to block duplicates).
- `post_surveys/{participantId}` — Immutable matched post-survey records (requires existing matching `pre_surveys/{participantId}`).
- `public_survey_metrics/{metricId}` — Zero-PII anonymized score records written atomically via `writeBatch` for live community Chart.js dashboards.
- `quiz_results/{resultId}` — 15-question quiz attempts.
- `feedback/{feedbackId}` — Contact & feedback entries (PII isolated to owner/admin).
- `testimonials/{testimonialId}` — Admin-approved zero-PII public participant quotes.
- `educational_content/{contentId}` — Admin-managed nutrition articles.

---

## Core Engineering Formulas

- **Knowledge Score (%):** `(Correct Answers / Total Questions) × 100`
- **Average Awareness Score (%):** `Sum of Participant Scores / Number of Participants`
- **Awareness Improvement (%):** `((Post-Survey Avg − Pre-Survey Avg) / Pre-Survey Avg) × 100` (computed strictly on matched Pre+Post participant pairs; zero baselines handled safely)
- **Healthy Practice Adoption (%):** `(Participants Adopting Practice / Total Valid Respondents) × 100`

---

## Running Locally & Testing

### Prerequisites
- Node.js 20+
- Visual Studio Code (recommended)

### Local Development
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser. (If hosting the static production output with VS Code Live Server, run `npm run build` and serve the generated `dist/` folder.)

### Feature Testing Walkthrough for VTU Evaluation
1. **Baseline Survey:** Open **Surveys → Pre-Program Survey**, sign in with Google, note your unique Participant ID (`HN-2026-XXXXXX`), answer all 10 questions, confirm consent, and submit.
2. **Education & Practice:** Complete the interactive check-ins in **Learn → Learning Modules**, build a balanced Indian meal in **Diet Planner**, and complete the 15-question **Nutrition Quiz**.
3. **Matched Post-Survey:** Open **Surveys → Post-Program Survey**, confirm your linked Participant ID, complete the same 10 questions + habit checklist + feedback, and view your matched score gain.
4. **Analytics & Export:** Visit **Analytics** to inspect all 5 Chart.js graphs on Live Firestore Data, toggle **Sample Demo Dataset** to preview multi-participant trends, export CSV, or print the evaluation report.
5. **Admin RBAC:** Open **Portal → Admin Dashboard** with the authorized admin Google account to manage articles, review responses, publish sanitized testimonials, and export the full CSV report.

---

## Deployment

Build the production bundle:
```bash
npm run build
```
Deploy the `dist/` directory to Firebase Hosting, Vercel, Netlify, or Cloud Run. Ensure `firestore.rules` is deployed to your Firebase project and your production domain is added to **Firebase Console → Authentication → Settings → Authorized domains**.
