/**
 * BCC Standard Typing Speed Test Engine
 * Enhanced with Anti-Cheat, Local History, Printable Marksheet, and Conjuncts Guide.
 * Zero external dependencies, pure vanilla JavaScript.
 */

// Helper to convert English digits to Bengali digits
function toBanglaNum(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[d]);
}

class TypingSpeedApp {
  constructor() {
    this.language = 'english'; // 'english' | 'bangla'
    this.mode = 'exam'; // 'exam' | 'highlight'
    this.duration = 300; // 5 minutes default (300s)
    this.timeLeft = 300;
    this.timer = null;
    this.isStarted = false;
    this.isFinished = false;
    this.passageIndex = Math.floor(Math.random() * 20);
    this.currentText = '';
    this.targetWords = [];
    this.startTime = null;
    this.endTime = null;
    this.soundEnabled = false;
    this.lastResult = null;

    // DOM Elements
    this.cacheDomElements();
    this.bindEvents();
    this.initAudio();
    this.initPWA();

    // Initial setup
    this.initTheme();
    this.loadPassage();
    this.updateModeUI();
    this.updateStatsDisplay(0, 100);
    this.renderTimer();
    this.updatePersonalBestDisplay();
  }

  cacheDomElements() {
    // Buttons & Toggles
    this.langEnBtn = document.getElementById('langEnBtn');
    this.langBnBtn = document.getElementById('langBnBtn');
    this.modeHighlightBtn = document.getElementById('modeHighlightBtn');
    this.modeExamBtn = document.getElementById('modeExamBtn');
    this.durationSelect = document.getElementById('durationSelect');
    this.customTextBtn = document.getElementById('customTextBtn');
    this.nextPassageBtn = document.getElementById('nextPassageBtn');
    this.nextPassageLabel = document.getElementById('nextPassageLabel');
    this.passageIndicator = document.getElementById('passageIndicator');
    this.resetBtn = document.getElementById('resetBtn');
    this.submitBtn = document.getElementById('submitBtn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.historyBtn = document.getElementById('historyBtn');
    this.conjunctsBtn = document.getElementById('conjunctsBtn');

    // UI Areas
    this.examBanner = document.getElementById('examBanner');
    this.passageDisplay = document.getElementById('passageDisplay');
    this.typingInput = document.getElementById('typingInput');
    this.timerDisplay = document.getElementById('timerDisplay');
    this.wpmDisplay = document.getElementById('wpmDisplay');
    this.accuracyDisplay = document.getElementById('accuracyDisplay');
    this.personalBestBadge = document.getElementById('personalBestBadge');

    // Modals
    this.customModal = document.getElementById('customModal');
    this.customTextInput = document.getElementById('customTextInput');
    this.saveCustomBtn = document.getElementById('saveCustomBtn');
    this.closeCustomBtn = document.getElementById('closeCustomBtn');

    this.resultModal = document.getElementById('resultModal');
    this.closeResultBtn = document.getElementById('closeResultBtn');
    this.retryTestBtn = document.getElementById('retryTestBtn');
    this.copyResultBtn = document.getElementById('copyResultBtn');
    this.printResultBtn = document.getElementById('printResultBtn');
    this.candidateNameInput = document.getElementById('candidateNameInput');

    // History Modal
    this.historyModal = document.getElementById('historyModal');
    this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
    this.historyTableBody = document.getElementById('historyTableBody');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Conjuncts Modal
    this.conjunctsModal = document.getElementById('conjunctsModal');
    this.closeConjunctsBtn = document.getElementById('closeConjunctsBtn');
    this.conjunctsSearch = document.getElementById('conjunctsSearch');
    this.conjunctsGrid = document.getElementById('conjunctsGrid');

    // Toast
    this.toast = document.getElementById('toast');
    this.toastMsg = document.getElementById('toastMsg');

    // Theme Toggle
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.themeSunIcon = document.getElementById('themeSunIcon');
    this.themeMoonIcon = document.getElementById('themeMoonIcon');
  }

  bindEvents() {
    // Language switching
    this.langEnBtn.addEventListener('click', () => this.setLanguage('english'));
    this.langBnBtn.addEventListener('click', () => this.setLanguage('bangla'));

    // Mode switching
    this.modeHighlightBtn.addEventListener('click', () => this.setMode('highlight'));
    this.modeExamBtn.addEventListener('click', () => this.setMode('exam'));

    // Duration change
    this.durationSelect.addEventListener('change', (e) => {
      this.duration = parseInt(e.target.value, 10);
      this.resetTest();
    });

    // Reset button
    this.resetBtn.addEventListener('click', () => this.resetTest());

    // Submit button
    this.submitBtn.addEventListener('click', () => this.finishTest());

    // Typing Input Event
    this.typingInput.addEventListener('input', (e) => this.handleTyping(e));

    // Anti-Cheat: Prevent Paste in Exam Mode
    this.typingInput.addEventListener('paste', (e) => {
      if (this.mode === 'exam') {
        e.preventDefault();
        this.showToast('⚠️ বিসিসি পরীক্ষার নিয়মানুযায়ী পেস্ট করা সম্পূর্ণ নিষিদ্ধ!');
      }
    });

    this.typingInput.addEventListener('drop', (e) => {
      e.preventDefault();
    });

    // Custom Text Modal
    this.customTextBtn.addEventListener('click', () => this.openCustomModal());
    this.closeCustomBtn.addEventListener('click', () => this.closeCustomModal());
    this.saveCustomBtn.addEventListener('click', () => this.applyCustomText());

    // Next / Shuffle Passage
    if (this.nextPassageBtn) {
      this.nextPassageBtn.addEventListener('click', () => this.nextPassage());
    }

    // Result Modal actions
    this.closeResultBtn.addEventListener('click', () => this.closeResultModal());
    this.retryTestBtn.addEventListener('click', () => {
      this.closeResultModal();
      this.resetTest();
    });
    this.copyResultBtn.addEventListener('click', () => this.copyScorecard());
    this.printResultBtn.addEventListener('click', () => this.prepareAndPrintCertificate());

    // History Modal actions
    if (this.historyBtn) {
      this.historyBtn.addEventListener('click', () => this.openHistoryModal());
    }
    if (this.closeHistoryBtn) {
      this.closeHistoryBtn.addEventListener('click', () => this.closeHistoryModal());
    }
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Conjuncts Modal actions
    if (this.conjunctsBtn) {
      this.conjunctsBtn.addEventListener('click', () => this.openConjunctsModal());
    }
    if (this.closeConjunctsBtn) {
      this.closeConjunctsBtn.addEventListener('click', () => this.closeConjunctsModal());
    }
    if (this.conjunctsSearch) {
      this.conjunctsSearch.addEventListener('input', (e) => this.filterConjuncts(e.target.value));
    }

    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    }

    // Theme Toggle
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Close modals on backdrop click or Escape
    window.addEventListener('click', (e) => {
      if (e.target === this.customModal) this.closeCustomModal();
      if (e.target === this.resultModal) this.closeResultModal();
      if (e.target === this.historyModal) this.closeHistoryModal();
      if (e.target === this.conjunctsModal) this.closeConjunctsModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCustomModal();
        this.closeResultModal();
        this.closeHistoryModal();
        this.closeConjunctsModal();
      }
    });
  }

  initTheme() {
    const savedTheme = localStorage.getItem('bcc_typing_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark');
    this.applyTheme(isDark);
    localStorage.setItem('bcc_typing_theme', isDark ? 'dark' : 'light');
    this.showToast(isDark ? '🌙 ডার্ক মোড চালু করা হয়েছে' : '☀️ লাইট মোড চালু করা হয়েছে');
  }

  applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (this.themeSunIcon) this.themeSunIcon.classList.remove('hidden');
      if (this.themeMoonIcon) this.themeMoonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      if (this.themeSunIcon) this.themeSunIcon.classList.add('hidden');
      if (this.themeMoonIcon) this.themeMoonIcon.classList.remove('hidden');
    }
  }

  initPWA() {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name !== 'bcc-typing-v2') {
            caches.delete(name);
          }
        });
      });
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          reg.update();
        }).catch((err) => {
          console.log('SW registration skipped:', err);
        });
      });
    }
  }

  showToast(message) {
    if (!this.toast || !this.toastMsg) return;
    this.toastMsg.textContent = message;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }

  // Audio synthesis for keyboard clicks without external audio files
  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('AudioContext not supported');
    }
  }

  playKeySound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (this.soundToggleBtn) {
      this.soundToggleBtn.classList.toggle('text-blue-600', this.soundEnabled);
      this.soundToggleBtn.classList.toggle('bg-blue-50', this.soundEnabled);
      this.soundToggleBtn.classList.toggle('border-blue-400', this.soundEnabled);
    }
    this.showToast(this.soundEnabled ? '🔊 কিবোর্ড সাউন্ড চালু করা হয়েছে' : '🔇 কিবোর্ড সাউন্ড বন্ধ করা হয়েছে');
  }

  setLanguage(lang) {
    if (this.language === lang) return;
    this.language = lang;

    // Toggle active styles and meaningful text
    const titleEl = document.getElementById('appTitle');
    const subtitleEl = document.getElementById('appSubtitle');
    const formulaLabel = document.getElementById('formulaLabel');
    const formulaText = document.getElementById('formulaText');

    if (lang === 'english') {
      this.langEnBtn.className = 'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
      this.langBnBtn.className = 'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      if (titleEl) titleEl.textContent = 'BCC Typing Speed Test';
      if (subtitleEl) subtitleEl.textContent = 'Bangladesh Computer Council (BCC) & Govt Recruitment Standard Portal';
      if (formulaLabel) formulaLabel.textContent = '* BCC Speed Formula:';
      if (formulaText) formulaText.textContent = '(Correct Characters + Spaces) ÷ 5 ÷ Test Duration (Minutes).';
      if (this.submitBtn) this.submitBtn.textContent = 'Submit Test';
    } else {
      this.langBnBtn.className = 'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
      this.langEnBtn.className = 'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      if (titleEl) titleEl.textContent = 'বিসিসি টাইপিং স্পিড টেস্ট';
      if (subtitleEl) subtitleEl.textContent = 'বাংলাদেশ কম্পিউটার কাউন্সিল (BCC) ও সরকারি নিয়োগ পরীক্ষার স্ট্যান্ডার্ড পোর্টাল';
      if (formulaLabel) formulaLabel.textContent = '* বিসিসি গতি নির্ণায়ক ফর্মুলা:';
      if (formulaText) formulaText.textContent = '(সঠিক অক্ষরের সংখ্যা + স্পেস) ÷ ৫ ÷ পরীক্ষার মোট সময় (মিনিট)।';
      if (this.submitBtn) this.submitBtn.textContent = 'পরীক্ষা জমা দিন (Submit)';
    }

    this.passageIndex = 0;
    this.loadPassage();
    this.resetTest();
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.updateModeUI();
    this.renderPassage();
  }

  updateModeUI() {
    if (this.mode === 'exam') {
      this.modeExamBtn.className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
      this.modeHighlightBtn.className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      this.examBanner.classList.remove('hidden');
    } else {
      this.modeHighlightBtn.className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
      this.modeExamBtn.className = 'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      this.examBanner.classList.add('hidden');
    }
  }

  nextPassage() {
    const list = window.PASSAGES[this.language] || window.PASSAGES.english;
    // Pick a random index different from the current one to avoid repeats
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * list.length);
    } while (newIndex === this.passageIndex && list.length > 1);
    this.passageIndex = newIndex;
    this.loadPassage();
    this.resetTest();
    this.showToast(this.language === 'bangla'
      ? `অনুচ্ছেদ ${toBanglaNum(this.passageIndex + 1)}/২০ লোড হয়েছে`
      : `Passage ${this.passageIndex + 1}/20 loaded`);
  }

  updatePassageIndicator() {
    if (this.passageIndicator) {
      const cur = this.passageIndex + 1;
      const total = (window.PASSAGES[this.language] || window.PASSAGES.english).length;
      this.passageIndicator.textContent = this.language === 'bangla' 
        ? `(${toBanglaNum(cur)}/${toBanglaNum(total)})` 
        : `(${cur}/${total})`;
    }
    if (this.nextPassageLabel) {
      this.nextPassageLabel.textContent = this.language === 'bangla' 
        ? '🎲 অন্য অনুচ্ছেদ' 
        : '🎲 Random Passage';
    }
  }

  loadPassage() {
    const list = window.PASSAGES[this.language] || window.PASSAGES.english;
    this.currentText = list[this.passageIndex % list.length];
    this.targetWords = this.currentText.trim().split(/\s+/);
    this.updatePassageIndicator();
    this.renderPassage();
  }

  renderPassage() {
    if (this.mode === 'exam') {
      // Clean reading text with no highlights
      this.passageDisplay.innerHTML = `<div id="examPassageText" class="leading-relaxed text-slate-800 dark:text-slate-100 text-lg md:text-xl font-normal select-none">${this.escapeHTML(this.currentText)}</div>`;
    } else {
      // Word Highlight Mode: Wrap words in spans
      const wordsHTML = this.targetWords.map((word, index) => {
        return `<span class="word ${index === 0 ? 'active' : ''}" data-index="${index}">${this.escapeHTML(word)}</span>`;
      }).join(' ');
      this.passageDisplay.innerHTML = `<div class="leading-relaxed text-slate-700 dark:text-slate-100 text-lg md:text-xl select-none" id="wordsContainer">${wordsHTML}</div>`;
    }
    this.passageDisplay.scrollTop = 0;
  }

  handleTyping(e) {
    if (this.isFinished) return;

    // Auto-start on first keystroke
    if (!this.isStarted) {
      this.startTest();
    }

    this.playKeySound();

    const typedVal = this.typingInput.value;
    const stats = this.calculateMetrics(typedVal);
    this.updateStatsDisplay(stats.netWpm, stats.accuracy);

    // Auto-scroll passage viewport to keep active point in sight
    this.handleAutoScroll(typedVal);

    // Live feedback in Word Highlight mode
    if (this.mode === 'highlight') {
      this.updateHighlighting(typedVal);
    }
  }

  handleAutoScroll(typedVal) {
    if (this.mode === 'exam') {
      // Approximate position based on progress ratio
      const progress = Math.min(1, typedVal.length / Math.max(1, this.currentText.length));
      const maxScroll = this.passageDisplay.scrollHeight - this.passageDisplay.clientHeight;
      if (maxScroll > 0) {
        this.passageDisplay.scrollTop = progress * maxScroll;
      }
    }
  }

  updateHighlighting(typedVal) {
    const typedWords = typedVal.split(/\s+/);
    const isEndingWithSpace = typedVal.endsWith(' ') || typedVal.endsWith('\n');
    const currentWordIndex = isEndingWithSpace ? typedWords.length - 1 : typedWords.length - 1;

    const wordSpans = this.passageDisplay.querySelectorAll('.word');
    if (!wordSpans || wordSpans.length === 0) return;

    wordSpans.forEach((span, index) => {
      span.classList.remove('active', 'correct', 'incorrect');

      if (index < currentWordIndex) {
        const typedWord = typedWords[index] || '';
        const targetWord = this.targetWords[index] || '';
        if (typedWord === targetWord) {
          span.classList.add('correct');
        } else {
          span.classList.add('incorrect');
        }
      } else if (index === currentWordIndex) {
        span.classList.add('active');

        const currentTypedWord = typedWords[index] || '';
        const currentTargetWord = this.targetWords[index] || '';

        if (currentTypedWord.length > 0 && !currentTargetWord.startsWith(currentTypedWord)) {
          span.classList.add('incorrect');
        }

        // Smooth scroll active word into center
        this.scrollIntoViewIfNeeded(span, this.passageDisplay);
      }
    });
  }

  scrollIntoViewIfNeeded(element, container) {
    const elTop = element.offsetTop;
    const conHeight = container.clientHeight;
    // Keep active word roughly at 40% height of container
    container.scrollTop = Math.max(0, elTop - conHeight * 0.35);
  }

  startTest() {
    this.isStarted = true;
    this.startTime = Date.now();
    this.timeLeft = this.duration;

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.renderTimer();

      const stats = this.calculateMetrics(this.typingInput.value);
      this.updateStatsDisplay(stats.netWpm, stats.accuracy);

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.finishTest();
      }
    }, 1000);
  }

  finishTest() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.endTime = Date.now();
    clearInterval(this.timer);

    this.typingInput.disabled = true;

    // Calculate final BCC metrics and show audit modal
    const finalStats = this.calculateMetrics(this.typingInput.value, true);
    this.lastResult = finalStats;

    // Save to LocalStorage History
    this.saveTestToHistory(finalStats);
    this.updatePersonalBestDisplay();

    this.showResultModal(finalStats);
  }

  resetTest() {
    clearInterval(this.timer);
    this.timer = null;
    this.isStarted = false;
    this.isFinished = false;
    this.timeLeft = this.duration;
    this.startTime = null;
    this.endTime = null;

    this.typingInput.value = '';
    this.typingInput.disabled = false;
    this.typingInput.focus();

    this.renderTimer();
    this.updateStatsDisplay(0, 100);
    this.renderPassage();
  }

  renderTimer() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (this.language === 'bangla') {
      this.timerDisplay.textContent = toBanglaNum(formatted);
    } else {
      this.timerDisplay.textContent = formatted;
    }
  }

  updateStatsDisplay(wpm, accuracy) {
    if (this.language === 'bangla') {
      this.wpmDisplay.textContent = toBanglaNum(wpm);
      this.accuracyDisplay.textContent = toBanglaNum(accuracy) + '%';
    } else {
      this.wpmDisplay.textContent = wpm;
      this.accuracyDisplay.textContent = accuracy + '%';
    }
  }

  /**
   * BCC Official Standard Calculation:
   * Net WPM = (Correct Characters + Spaces) / 5 / Elapsed Minutes
   */
  calculateMetrics(typedText, isFinal = false) {
    const now = Date.now();
    let elapsedSeconds = this.isStarted && this.startTime ? (now - this.startTime) / 1000 : 0;
    if (isFinal && this.endTime && this.startTime) {
      elapsedSeconds = (this.endTime - this.startTime) / 1000;
    }
    const elapsedMinutes = Math.max(elapsedSeconds / 60, 1 / 60);

    const typedWords = typedText.trim() === '' ? [] : typedText.trim().split(/\s+/);
    let correctCharacters = 0;
    let correctWordsCount = 0;
    let wrongWordsCount = 0;

    typedWords.forEach((word, idx) => {
      if (idx < this.targetWords.length) {
        if (word === this.targetWords[idx]) {
          correctWordsCount++;
          correctCharacters += word.length;
        } else {
          wrongWordsCount++;
        }
      } else {
        wrongWordsCount++;
      }
    });

    if (correctWordsCount > 1) {
      correctCharacters += (correctWordsCount - 1);
    }

    const totalTypedChars = typedText.length;
    const grossWpm = Math.max(0, Math.round((totalTypedChars / 5) / elapsedMinutes));
    const netWpm = Math.max(0, Math.round((correctCharacters / 5) / elapsedMinutes));

    let accuracy = 100;
    if (totalTypedChars > 0) {
      accuracy = Math.max(0, Math.min(100, Math.round((correctCharacters / totalTypedChars) * 100)));
    }

    return {
      netWpm,
      grossWpm,
      accuracy,
      correctCharacters,
      totalTypedChars,
      correctWordsCount,
      wrongWordsCount,
      totalWords: this.targetWords.length,
      typedWordsCount: typedWords.length,
      elapsedSeconds: Math.round(elapsedSeconds),
      typedWords,
      targetWords: this.targetWords,
      language: this.language,
      duration: this.duration,
      mode: this.mode,
      date: new Date().toISOString()
    };
  }

  showResultModal(stats) {
    const minWpm = this.language === 'bangla' ? 20 : 28;
    const minAcc = this.language === 'bangla' ? 85 : 90;
    const isPassed = stats.netWpm >= minWpm && stats.accuracy >= minAcc;

    const statusBadge = document.getElementById('resStatusBadge');
    if (isPassed) {
      statusBadge.className = 'inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
      statusBadge.innerHTML = `✓ ${this.language === 'bangla' ? 'সরকারি পরীক্ষায় উত্তীর্ণ (Qualified)' : 'Passed (Government Qualified)'}`;
    } else {
      statusBadge.className = 'inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-rose-100 text-rose-800 border border-rose-300';
      statusBadge.innerHTML = `✕ ${this.language === 'bangla' ? 'অনুত্তীর্ণ (Not Qualified - আরও অনুশীলন প্রয়োজন)' : 'Not Qualified (Needs Practice)'}`;
    }

    const benchNote = document.getElementById('resBenchmarkNote');
    benchNote.textContent = this.language === 'bangla'
      ? `সরকারি মানদণ্ড: বাংলায় সর্বনিম্ন ২০ শব্দ/মিনিট এবং ৮৫% নির্ভুলতা। আপনার অর্জিত গতি: ${toBanglaNum(stats.netWpm)} WPM`
      : `Official Standard: English minimum 28 WPM with 90% accuracy. Your Speed: ${stats.netWpm} WPM`;

    document.getElementById('resNetWpm').textContent = this.language === 'bangla' ? toBanglaNum(stats.netWpm) : stats.netWpm;
    document.getElementById('resGrossWpm').textContent = this.language === 'bangla' ? toBanglaNum(stats.grossWpm) : stats.grossWpm;
    document.getElementById('resAccuracy').textContent = (this.language === 'bangla' ? toBanglaNum(stats.accuracy) : stats.accuracy) + '%';
    
    const minutesSpent = Math.floor(stats.elapsedSeconds / 60);
    const secondsSpent = stats.elapsedSeconds % 60;
    const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;
    document.getElementById('resTimeTaken').textContent = this.language === 'bangla' ? toBanglaNum(timeFormatted) : timeFormatted;

    document.getElementById('resCorrectChars').textContent = this.language === 'bangla' ? toBanglaNum(stats.correctCharacters) : stats.correctCharacters;
    document.getElementById('resTotalChars').textContent = this.language === 'bangla' ? toBanglaNum(stats.totalTypedChars) : stats.totalTypedChars;
    document.getElementById('resMistakes').textContent = this.language === 'bangla' ? toBanglaNum(stats.wrongWordsCount) : stats.wrongWordsCount;

    this.renderAuditDiff(stats);

    this.resultModal.classList.remove('hidden');
    this.resultModal.classList.add('flex');
  }

  renderAuditDiff(stats) {
    const diffContainer = document.getElementById('resAuditDiff');
    const { targetWords, typedWords } = stats;

    let diffHTML = '';
    const maxLen = Math.max(targetWords.length, typedWords.length);

    for (let i = 0; i < maxLen; i++) {
      const orig = targetWords[i];
      const typed = typedWords[i];

      if (orig && typed) {
        if (orig === typed) {
          diffHTML += `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">${this.escapeHTML(typed)}</span> `;
        } else {
          diffHTML += `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded bg-rose-50 text-rose-700 text-sm font-medium border border-rose-300" title="Expected: ${this.escapeHTML(orig)}"><del class="text-rose-400 mr-1">${this.escapeHTML(orig)}</del><strong>${this.escapeHTML(typed)}</strong></span> `;
        }
      } else if (orig && !typed) {
        diffHTML += `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded bg-amber-50 text-amber-700 text-sm border border-dashed border-amber-300" title="Omitted word"><del>${this.escapeHTML(orig)}</del></span> `;
      } else if (!orig && typed) {
        diffHTML += `<span class="inline-block px-1.5 py-0.5 m-0.5 rounded bg-purple-50 text-purple-700 text-sm border border-purple-300" title="Extra word">${this.escapeHTML(typed)}</span> `;
      }
    }

    diffContainer.innerHTML = diffHTML;
  }

  closeResultModal() {
    this.resultModal.classList.add('hidden');
    this.resultModal.classList.remove('flex');
  }

  copyScorecard() {
    const netWpm = document.getElementById('resNetWpm').textContent;
    const acc = document.getElementById('resAccuracy').textContent;
    const time = document.getElementById('resTimeTaken').textContent;
    const lang = this.language === 'bangla' ? 'বাংলা (Bangla)' : 'English';
    const text = `🏆 BCC Typing Speed Test Result\nLanguage: ${lang}\nNet Speed: ${netWpm} WPM (BCC Standard)\nAccuracy: ${acc}\nTime: ${time}\nTested at: Tutor LMS Typing Speed App`;

    navigator.clipboard.writeText(text).then(() => {
      const origText = this.copyResultBtn.innerHTML;
      this.copyResultBtn.innerHTML = `✓ ${this.language === 'bangla' ? 'কপি হয়েছে' : 'Copied!'}`;
      setTimeout(() => {
        this.copyResultBtn.innerHTML = origText;
      }, 2000);
    });
  }

  prepareAndPrintCertificate() {
    if (!this.lastResult) return;
    const candidateName = (this.candidateNameInput ? this.candidateNameInput.value.trim() : '') || 'পরীক্ষার্থী (Candidate)';
    
    const certArea = document.getElementById('certificateArea');
    if (!certArea) {
      window.print();
      return;
    }

    const minWpm = this.language === 'bangla' ? 20 : 28;
    const isPassed = this.lastResult.netWpm >= minWpm && this.lastResult.accuracy >= 85;
    const dateStr = new Date().toLocaleDateString('bn-BD', { dateStyle: 'long' });

    certArea.innerHTML = `
      <div style="border: 6px double #1e3a8a; padding: 40px; text-align: center; font-family: 'Hind Siliguri', sans-serif;">
        <div style="font-size: 13px; color: #475569; letter-spacing: 2px; text-transform: uppercase;">বাংলাদেশ কম্পিউটার কাউন্সিল (বিসিসি) মানদণ্ড মূল্যায়ন</div>
        <h1 style="font-size: 28px; font-weight: bold; color: #0f172a; margin: 10px 0 5px;">টাইপিং স্পিড দক্ষতা সনদপত্র (EVALUATION MARKSHEET)</h1>
        <p style="font-size: 14px; color: #64748b;">Tutor LMS কম্পিউটার দক্ষতা পরিমাপক পোর্টাল</p>
        <hr style="border: 0; border-top: 2px solid #cbd5e1; margin: 25px 0;">
        
        <p style="font-size: 16px; margin-bottom: 8px;">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,</p>
        <h2 style="font-size: 24px; font-weight: bold; color: #1d4ed8; margin: 0 0 15px;">${this.escapeHTML(candidateName)}</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.8; max-width: 650px; margin: 0 auto 30px;">
          তিনি সরকারি নিয়োগ পরীক্ষার স্ট্যান্ডার্ড অনুযায়ী <strong>${this.language === 'bangla' ? 'বাংলা' : 'English'}</strong> ভাষায় ৫ মিনিটের কম্পিউটার টাইপিং পরীক্ষায় অংশগ্রহণ করে নিম্নোক্ত ফলাফল অর্জন করেছেন:
        </p>

        <table style="width: 100%; max-width: 600px; margin: 0 auto 30px; border-collapse: collapse; text-align: center; font-size: 15px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 10px;">নেট স্পিড (Net WPM)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px;">গ্রস স্পিড (Gross WPM)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px;">নির্ভুলতা (Accuracy)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px;">ফলাফল (Status)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 12px; font-size: 18px; font-weight: bold; color: #1d4ed8;">${toBanglaNum(this.lastResult.netWpm)} WPM</td>
              <td style="border: 1px solid #cbd5e1; padding: 12px;">${toBanglaNum(this.lastResult.grossWpm)} WPM</td>
              <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold; color: #16a34a;">${toBanglaNum(this.lastResult.accuracy)}%</td>
              <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold; color: ${isPassed ? '#16a34a' : '#dc2626'};">${isPassed ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ (FAILED)'}</td>
            </tr>
          </tbody>
        </table>

        <div style="font-size: 12px; color: #64748b; margin-bottom: 50px;">
          * বিসিসি স্ট্যান্ডার্ড গতি নির্ণায়ক ফর্মুলা: (সঠিক শব্দের ক্যারেক্টার + স্পেস) ÷ ৫ ÷ সময় (মিনিট)।
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px; font-size: 14px; color: #475569;">
          <div style="text-align: center;">
            <div style="border-top: 1px solid #94a3b8; width: 160px; margin-bottom: 5px;"></div>
            তারিখ: ${dateStr}
          </div>
          <div style="text-align: center;">
            <div style="border-top: 1px solid #94a3b8; width: 160px; margin-bottom: 5px;"></div>
            যাচাইকারী কর্মকর্তা / সিস্টেম
          </div>
        </div>
      </div>
    `;

    window.print();
  }

  // LocalStorage Test History Manager
  saveTestToHistory(stats) {
    try {
      const history = JSON.parse(localStorage.getItem('bcc_typing_history') || '[]');
      history.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        language: stats.language === 'bangla' ? 'বাংলা' : 'English',
        netWpm: stats.netWpm,
        accuracy: stats.accuracy,
        duration: Math.round(stats.duration / 60) + ' মি.',
        passed: stats.netWpm >= (stats.language === 'bangla' ? 20 : 28) && stats.accuracy >= 85
      });
      // Keep up to 25 records
      if (history.length > 25) history.pop();
      localStorage.setItem('bcc_typing_history', JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  updatePersonalBestDisplay() {
    try {
      const history = JSON.parse(localStorage.getItem('bcc_typing_history') || '[]');
      if (history.length > 0 && this.personalBestBadge) {
        const best = Math.max(...history.map(h => h.netWpm || 0));
        this.personalBestBadge.textContent = `${toBanglaNum(best)} WPM`;
        this.personalBestBadge.parentElement.classList.remove('hidden');
      }
    } catch (e) {}
  }

  openHistoryModal() {
    this.renderHistoryTable();
    this.historyModal.classList.remove('hidden');
    this.historyModal.classList.add('flex');
  }

  closeHistoryModal() {
    this.historyModal.classList.add('hidden');
    this.historyModal.classList.remove('flex');
  }

  renderHistoryTable() {
    if (!this.historyTableBody) return;
    try {
      const history = JSON.parse(localStorage.getItem('bcc_typing_history') || '[]');
      if (history.length === 0) {
        this.historyTableBody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400">এখনো কোনো পরীক্ষার ইতিহাস সংরক্ষিত নেই। একটি পরীক্ষা সম্পন্ন করুন!</td></tr>`;
        return;
      }

      this.historyTableBody.innerHTML = history.map((item, index) => {
        const statusClass = item.passed ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100';
        const statusText = item.passed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ';
        return `
          <tr class="border-b border-slate-100 hover:bg-slate-50">
            <td class="py-3 px-4 text-xs text-slate-500">${item.date}</td>
            <td class="py-3 px-4 text-xs font-semibold text-slate-700">${item.language} (${item.duration})</td>
            <td class="py-3 px-4 text-sm font-bold text-blue-600">${toBanglaNum(item.netWpm)} WPM</td>
            <td class="py-3 px-4 text-sm font-medium text-slate-700">${toBanglaNum(item.accuracy)}%</td>
            <td class="py-3 px-4 text-xs"><span class="px-2.5 py-1 rounded-full font-bold ${statusClass}">${statusText}</span></td>
          </tr>
        `;
      }).join('');
    } catch (e) {}
  }

  clearHistory() {
    if (confirm('আপনি কি পূর্ববর্তী সমস্ত পরীক্ষার রেকর্ড মুছে ফেলতে চান?')) {
      localStorage.removeItem('bcc_typing_history');
      this.renderHistoryTable();
      if (this.personalBestBadge) {
        this.personalBestBadge.parentElement.classList.add('hidden');
      }
      this.showToast('পূর্ববর্তী ইতিহাস মুছে ফেলা হয়েছে।');
    }
  }

  // Bangla Conjuncts Guide Modal
  openConjunctsModal() {
    this.filterConjuncts('');
    this.conjunctsModal.classList.remove('hidden');
    this.conjunctsModal.classList.add('flex');
    if (this.conjunctsSearch) {
      this.conjunctsSearch.value = '';
      this.conjunctsSearch.focus();
    }
  }

  closeConjunctsModal() {
    this.conjunctsModal.classList.add('hidden');
    this.conjunctsModal.classList.remove('flex');
  }

  filterConjuncts(query) {
    if (!this.conjunctsGrid || !window.BANGLA_CONJUNCTS) return;
    const q = query.trim().toLowerCase();
    const filtered = window.BANGLA_CONJUNCTS.filter(item => {
      return !q || item.conjunct.includes(q) || item.breakdown.includes(q) || item.bijoy.toLowerCase().includes(q) || item.avro.toLowerCase().includes(q) || item.example.includes(q);
    });

    if (filtered.length === 0) {
      this.conjunctsGrid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400">কোনো যুক্তবর্ণ পাওয়া যায়নি।</div>`;
      return;
    }

    this.conjunctsGrid.innerHTML = filtered.map(item => {
      return `
        <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 hover:border-blue-300 transition-all">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-2xl font-black text-blue-700">${item.conjunct}</span>
            <span class="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">${item.breakdown}</span>
          </div>
          <div class="text-xs text-slate-600 mb-1 flex justify-between">
            <span>বিজয়: <code class="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">${item.bijoy}</code></span>
            <span>অভ্র: <code class="bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded font-mono font-bold">${item.avro}</code></span>
          </div>
          <div class="text-[11px] text-slate-400 truncate">উদাহরণ: ${item.example}</div>
        </div>
      `;
    }).join('');
  }

  openCustomModal() {
    this.customModal.classList.remove('hidden');
    this.customModal.classList.add('flex');
    this.customTextInput.value = '';
    this.customTextInput.focus();
  }

  closeCustomModal() {
    this.customModal.classList.add('hidden');
    this.customModal.classList.remove('flex');
  }

  applyCustomText() {
    const text = this.customTextInput.value.trim();
    if (!text) {
      this.showToast('অনুগ্রহ করে কিছু লেখা লিখুন বা পেস্ট করুন।');
      return;
    }

    this.currentText = text;
    this.targetWords = text.split(/\s+/);
    this.closeCustomModal();
    this.resetTest();
    this.showToast('✓ কাস্টম লেখা সফলভাবে লোড হয়েছে!');
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.typingApp = new TypingSpeedApp();
});
