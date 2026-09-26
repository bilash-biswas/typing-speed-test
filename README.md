# BCC Standard Typing Speed Test (বিসিসি টাইপিং স্পিড টেস্ট)

🌐 **Live Demo:** [https://typingtest-steel.vercel.app/](https://typingtest-steel.vercel.app/)

A high-performance, zero-latency static typing speed test and exam simulator web application designed according to Bangladesh Computer Council (BCC) and Bangladesh Government recruitment standards.

Built with **Pure HTML5 + Tailwind CSS + Vanilla JavaScript**. Zero build steps, zero `node_modules`, ready for instant one-click deployment on **Vercel**.

---

## ✨ Features

- **Dual Script Support (English & বাংলা):** Seamless switching between English and Bengali practice passages.
- **Dual Testing Modes:**
  - **BCC Exam Mode (বিসিসি এক্সাম মোড):** Replicates real exam conditions—no distracting colors or highlights during typing. Complete audit appears upon submission.
  - **Word Highlight Mode (ওয়ার্ড হাইলাইট মোড):** Real-time green/red visual indicators and dynamic scrolling for practice sessions.
- **Official BCC Formula Calculation:**
  $$\text{Net WPM} = \frac{\text{Correct Characters (including spaces)}}{5 \times \text{Elapsed Time (minutes)}}$$
- **Govt Pass/Fail Benchmark Validation:**
  - **Bangla:** $\ge 20$ WPM with $\ge 85\%$ accuracy $\rightarrow$ **উত্তীর্ণ (Qualified)**
  - **English:** $\ge 28$ WPM with $\ge 90\%$ accuracy $\rightarrow$ **উত্তীর্ণ (Qualified)**
- **Timed Tests:** 1 min, 2 min, **5 min (Official Govt Test)**, 10 min, and 15 min.
- **Auto-Start Timer:** Automatically begins tracking on the very first keystroke.
- **Custom Text (কাস্টম লেখা):** Paste any custom text or exam passage for targeted practice.
- **Comprehensive Post-Exam Audit Diff:** Visual word-by-word diff report showing correct words, spelling errors, and skipped words.
- **Print Scorecard & Copy Result:** One-click copy and print-friendly styling.
- **Synthetic Mechanical Key Click Audio:** Zero external sound files; uses Web Audio API oscillators.

---

## 🚀 How to Run Locally

Because this project is built with pure static files, you don't need Node.js or any build tools:

1. Simply double-click **`index.html`** to open it in your browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, use VS Code extension `Live Server` or run:
   ```bash
   npx serve .
   ```

---

## 🌐 How to Host on Vercel

### Method 1: Using GitHub (Recommended - Automatic Updates)

1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of BCC Typing Speed Test"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Open [vercel.com](https://vercel.com) and click **"Add New..."** $\rightarrow$ **"Project"**.
3. Import your GitHub repository.
4. Click **Deploy**. Vercel will immediately deploy it in ~2 seconds!

### Method 2: Direct Terminal Deployment with Vercel CLI

1. Install the Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. In this project folder, run:
   ```bash
   vercel
   ```
3. Follow the quick terminal prompts. When ready to publish to production:
   ```bash
   vercel --prod
   ```

---

## 📁 Project Structure

```
typing-speed-count/
├── index.html           # Main semantic UI (Header, Controls, Passage box, Input, Modals)
├── css/
│   └── style.css        # Typography (Hind Siliguri, Inter), custom scrollbars & print scorecard styling
├── js/
│   ├── passages.js      # Curated Govt exam passages for Bangla & English
│   └── app.js           # Core typing engine, BCC speed calculation, timer & audit diff generator
├── vercel.json          # Vercel configuration for static routing and caching
└── README.md            # Documentation and deployment guide
```
