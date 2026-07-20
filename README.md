# TopRatedVAs.com

An independent **certification + directory marketplace** for virtual assistants trained on the EcomSniper Amazon→eBay dropshipping model. Every listed VA has passed scenario-based certification exams and posted proof videos. Dropshippers browse for free and pay only to unlock a VA's contact info — then hire directly, with no middleman.

- **Live site:** https://topratedvas.com
- **Hosting:** GitHub Pages — deploys automatically from the `main` branch
- **Stack:** Static HTML / CSS / JavaScript + Firebase (Auth + Firestore)

> Independent site — **not affiliated with EcomSniper**.
> v1 status: fully functional except that **payments and AI video review are simulated** (demo checkouts; simulated review verdicts with a marked integration stub for the real pipeline).

## Project structure

```
index.html            Home
browse.html           Browse VAs (filters)
profile.html          VA profile
pricing.html          Employer + VA pricing
course.html           Free course (Modules 0–5)
sample-test.html      Sample exam engine
trust.html · faq.html · terms.html · privacy.html · refunds.html · verify.html
va-dashboard.html · employer-dashboard.html · admin.html
assets/
  styles.css          Site styles
  app.js              Shared header / footer / chatbot / language switcher
  img/                Logo + favicon
```
