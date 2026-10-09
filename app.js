/**
 * CatchUp AI - Frontend Application Controller
 * Handles UI interactions, engine execution, rendering, export utilities, and modal settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AI Engine
  const engine = new CatchUpEngine();

  // Current state
  let currentAnalysis = null;
  let currentSampleKey = null;

  // DOM Elements
  const chatInput = document.getElementById('chatInput');
  const charCount = document.getElementById('charCount');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const sampleBtns = document.querySelectorAll('.btn-sample');

  const loadingBox = document.getElementById('loadingBox');
  const loadingStep = document.getElementById('loadingStep');
  const emptyState = document.getElementById('emptyState');
  const resultsDashboard = document.getElementById('resultsDashboard');
  const errorBanner = document.getElementById('errorBanner');
  const errorMessage = document.getElementById('errorMessage');

  // Stats elements
  const statMessages = document.getElementById('statMessages');
  const statParticipants = document.getElementById('statParticipants');
  const statHighPriority = document.getElementById('statHighPriority');
  const statActionItems = document.getElementById('statActionItems');

  // Dashboard content elements
  const summaryTopic = document.getElementById('summaryTopic');
  const summaryBulletsList = document.getElementById('summaryBulletsList');
  const importantBadge = document.getElementById('importantBadge');
  const importantItemsList = document.getElementById('importantItemsList');
  const actionBadge = document.getElementById('actionBadge');
  const actionItemsList = document.getElementById('actionItemsList');
  const deadlinesList = document.getElementById('deadlinesList');
  const mentionsCloud = document.getElementById('mentionsCloud');

  // Priority matrix elements
  const countHigh = document.getElementById('countHigh');
  const countMed = document.getElementById('countMed');
  const countLow = document.getElementById('countLow');
  const itemsHigh = document.getElementById('itemsHigh');
  const itemsMed = document.getElementById('itemsMed');
  const itemsLow = document.getElementById('itemsLow');

  // Export buttons
  const copySummaryBtn = document.getElementById('copySummaryBtn');
  const downloadReportBtn = document.getElementById('downloadReportBtn');
  const printReportBtn = document.getElementById('printReportBtn');
  const toastNotice = document.getElementById('toastNotice');

  // Settings & Privacy modal
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const privacyBadge = document.getElementById('privacyBadge');
  const privacyDot = document.getElementById('privacyDot');
  const privacyStatusText = document.getElementById('privacyStatusText');
  const privacyDisclaimerText = document.getElementById('privacyDisclaimerText');
  const engineBadgeText = document.getElementById('engineBadgeText');

  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const engineSelect = document.getElementById('engineSelect');
  const apiKeyGroup = document.getElementById('apiKeyGroup');
  const apiKeyInput = document.getElementById('apiKeyInput');

  // --- 1. Textarea & Character Counter ---
  function updateCharCount() {
    const text = chatInput.value;
    const chars = text.length;
    const lines = text ? text.split(/\r?\n/).filter(l => l.trim()).length : 0;
    charCount.textContent = `${chars.toLocaleString()} characters | ${lines} lines`;
  }

  chatInput.addEventListener('input', () => {
    updateCharCount();
    hideError();
  });

  // Shortcut: Ctrl+Enter or Cmd+Enter to trigger analysis
  chatInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runAnalysis();
    }
  });

  // --- 2. Sample Button Handlers ---
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleMap = (typeof window !== 'undefined' && window.SAMPLE_CONVERSATIONS) ? window.SAMPLE_CONVERSATIONS : (typeof SAMPLE_CONVERSATIONS !== 'undefined' ? SAMPLE_CONVERSATIONS : null);
      if (sampleMap && sampleMap[sampleKey]) {
        currentSampleKey = sampleKey;
        chatInput.value = sampleMap[sampleKey].rawText;
        updateCharCount();
        hideError();

        // Update active class on sample buttons
        sampleBtns.forEach(b => {
          if (b.getAttribute('data-sample') === sampleKey) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        // Trigger instant analysis for quick demonstration
        runAnalysis();
      }
    });
  });

  // --- 3. Run Analysis Flow ---
  analyzeBtn.addEventListener('click', runAnalysis);

  async function runAnalysis() {
    const text = chatInput.value.trim();
    if (!text) {
      showError("Please paste a conversation or select one of the sample buttons first.");
      return;
    }

    hideError();
    emptyState.style.display = 'none';
    resultsDashboard.style.display = 'none';
    loadingBox.style.display = 'block';

    try {
      // Step-by-step progress animation for live presentation
      loadingStep.textContent = "Step 1/4: Parsing messages, timestamps & participants...";
      await delay(250);

      loadingStep.textContent = "Step 2/4: Extracting blockers, decisions & announcements...";
      await delay(250);

      loadingStep.textContent = "Step 3/4: Identifying tasks, explicit owners & deadlines...";
      await delay(250);

      loadingStep.textContent = "Step 4/4: Calculating priority rationale & generating summary...";
      await delay(200);

      const result = await engine.analyze(text);
      currentAnalysis = result;

      // Render the results
      renderDashboard(result);

      loadingBox.style.display = 'none';
      resultsDashboard.style.display = 'block';

      // Scroll smoothly to dashboard if on mobile or small window
      resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      loadingBox.style.display = 'none';
      emptyState.style.display = 'block';
      showError(err.message || "An unexpected error occurred during analysis.");
    }
  }

  // --- 4. Render Dashboard View ---
  function renderDashboard(data) {
    // 4.1 Stats
    statMessages.textContent = data.meta.totalMessages;
    statParticipants.textContent = data.meta.totalParticipants;
    statHighPriority.textContent = data.priorityMatrix.high.count;
    statActionItems.textContent = data.actionItems.length;

    // 4.2 Engine Badge & Disclosures
    engineBadgeText.textContent = `Engine: ${data.provider} (${data.isLocal ? '100% Local / Private' : 'Cloud AI'})`;

    // 4.3 Summary & Topic
    summaryTopic.textContent = data.summary.mainTopic;
    summaryBulletsList.innerHTML = '';
    data.summary.bulletPoints.forEach(bullet => {
      const li = document.createElement('li');
      li.className = 'summary-bullet-item';
      li.innerHTML = `
        <span class="bullet-dot"></span>
        <span>${escapeHtml(bullet)}</span>
      `;
      summaryBulletsList.appendChild(li);
    });

    // 4.4 Important Messages & Decisions
    importantBadge.textContent = `${data.importantItems.length} Extracted`;
    importantItemsList.innerHTML = '';
    if (data.importantItems.length === 0) {
      importantItemsList.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-light-muted); font-size: 0.85rem;">
          No critical blockers or formal decisions detected in this snippet.
        </div>
      `;
    } else {
      data.importantItems.forEach(item => {
        const card = document.createElement('div');
        const typeClass = item.type.toLowerCase();
        card.className = `important-item-card ${typeClass}`;

        card.innerHTML = `
          <div class="item-meta-top">
            <div class="item-tags-left">
              <span class="tag-type ${typeClass}">${escapeHtml(item.type)}</span>
              <span class="badge-priority ${item.priority.toLowerCase()}">${item.priority} Priority</span>
            </div>
            <span class="item-sender">${escapeHtml(item.sender)} • ${escapeHtml(item.timestamp)}</span>
          </div>
          <div class="item-title">${escapeHtml(item.title)}</div>
          <div class="item-quote-evidence">
            <span class="quote-label">Supporting Evidence Quote:</span>
            “${escapeHtml(item.quote)}”
          </div>
        `;
        importantItemsList.appendChild(card);
      });
    }

    // 4.5 Action Items
    actionBadge.textContent = `${data.actionItems.length} Tasks`;
    actionItemsList.innerHTML = '';
    if (data.actionItems.length === 0) {
      actionItemsList.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-light-muted); font-size: 0.85rem;">
          No explicit tasks or requests found in this snippet.
        </div>
      `;
    } else {
      data.actionItems.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.id = `card-${task.id}`;

        const isUnassigned = task.assignee.includes('Unassigned');
        const ownerClass = isUnassigned ? 'badge-owner unassigned' : 'badge-owner';

        let deadlineBadge = '';
        if (task.deadline === 'None specified') {
          deadlineBadge = `<span class="badge-deadline none">⏳ No deadline specified</span>`;
        } else if (task.deadlineType === 'Confirmed') {
          deadlineBadge = `<span class="badge-deadline confirmed">🎯 Confirmed: ${escapeHtml(task.deadline)}</span>`;
        } else {
          deadlineBadge = `<span class="badge-deadline ambiguous">⚠️ Ambiguous: ${escapeHtml(task.deadline)}</span>`;
        }

        card.innerHTML = `
          <input type="checkbox" class="task-checkbox" id="check-${task.id}" aria-label="Mark task done">
          <div class="task-main">
            <div class="task-desc">${escapeHtml(task.task)}</div>
            <div class="task-badges">
              <span class="${ownerClass}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${escapeHtml(task.assignee)}
              </span>
              ${deadlineBadge}
              <span class="badge-priority ${task.priority.toLowerCase()}">${task.priority} Priority</span>
            </div>
            <div style="margin-top: 0.4rem; font-size: 0.72rem; color: var(--text-light-muted);">
              <strong>Context:</strong> “${escapeHtml(task.sourceQuote)}” (${escapeHtml(task.sender)})
            </div>
          </div>
        `;

        // Checkbox interaction
        const checkbox = card.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            card.classList.add('is-completed');
          } else {
            card.classList.remove('is-completed');
          }
        });

        actionItemsList.appendChild(card);
      });
    }

    // 4.6 Priority Matrix
    renderPriorityMatrix(data.priorityMatrix);

    // 4.7 Deadlines & Mentions
    renderDeadlines(data.deadlinesAndDates);
    renderMentions(data.mentions);
  }

  // --- 4.6 Render Priority Breakdown with Rationale ---
  function renderPriorityMatrix(matrix) {
    countHigh.textContent = matrix.high.count;
    countMed.textContent = matrix.medium.count;
    countLow.textContent = matrix.low.count;

    renderTierItems(itemsHigh, matrix.high.items);
    renderTierItems(itemsMed, matrix.medium.items);
    renderTierItems(itemsLow, matrix.low.items);
  }

  function renderTierItems(container, items) {
    container.innerHTML = '';
    if (!items || items.length === 0) {
      container.innerHTML = `<div style="font-size: 0.72rem; color: var(--text-muted); padding: 0.3rem 0;">No items in this tier</div>`;
      return;
    }

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'tier-item-pill';
      el.innerHTML = `
        <div class="tier-item-title">${escapeHtml(item.title)}</div>
        <div class="tier-item-reason"><strong>Why:</strong> ${escapeHtml(item.reason)}</div>
      `;
      container.appendChild(el);
    });
  }

  // --- 4.7 Render Deadlines (Confirmed vs Ambiguous) ---
  function renderDeadlines(deadlines) {
    deadlinesList.innerHTML = '';
    if (!deadlines || deadlines.length === 0) {
      deadlinesList.innerHTML = `<div style="font-size: 0.75rem; color: var(--text-light-muted); padding: 0.5rem 0;">No dates or deadlines identified.</div>`;
      return;
    }

    deadlines.forEach(d => {
      const card = document.createElement('div');
      card.className = 'deadline-card';
      const badgeClass = d.isConfirmed ? 'badge-deadline confirmed' : 'badge-deadline ambiguous';
      card.innerHTML = `
        <div class="deadline-info">
          <span class="deadline-date">${escapeHtml(d.dateText)}</span>
          <span class="deadline-context" title="${escapeHtml(d.context)}">${escapeHtml(d.context)}</span>
        </div>
        <span class="${badgeClass}">${escapeHtml(d.status)}</span>
      `;
      deadlinesList.appendChild(card);
    });
  }

  // --- 4.8 Render Direct Mentions ---
  function renderMentions(mentions) {
    mentionsCloud.innerHTML = '';
    if (!mentions || mentions.length === 0) {
      mentionsCloud.innerHTML = `<div style="font-size: 0.75rem; color: var(--text-light-muted); padding: 0.5rem 0;">No direct @mentions found.</div>`;
      return;
    }

    // Group mentions by handle
    const handleMap = {};
    mentions.forEach(m => {
      if (!handleMap[m.handle]) handleMap[m.handle] = [];
      handleMap[m.handle].push(m);
    });

    Object.keys(handleMap).forEach(handle => {
      const chip = document.createElement('div');
      chip.className = 'mention-chip';
      chip.innerHTML = `
        <span>${escapeHtml(handle)}</span>
        <span style="font-size: 0.65rem; opacity: 0.75;">(${handleMap[handle].length}x)</span>
      `;
      chip.title = `Mentioned by: ${handleMap[handle].map(h => h.mentionedBy).join(', ')}`;
      mentionsCloud.appendChild(chip);
    });
  }

  // --- 5. Reset Action ---
  resetBtn.addEventListener('click', () => {
    chatInput.value = '';
    updateCharCount();
    hideError();
    resultsDashboard.style.display = 'none';
    loadingBox.style.display = 'none';
    emptyState.style.display = 'block';
    sampleBtns.forEach(b => b.classList.remove('active'));
    currentAnalysis = null;
    currentSampleKey = null;
  });

  // --- 6. Export Utilities ---
  copySummaryBtn.addEventListener('click', () => {
    if (!currentAnalysis) return;

    const reportText = generatePlainTextReport(currentAnalysis);
    navigator.clipboard.writeText(reportText).then(() => {
      showToast("Report copied to clipboard!");
    }).catch(() => {
      showToast("Unable to copy to clipboard.");
    });
  });

  downloadReportBtn.addEventListener('click', () => {
    if (!currentAnalysis) return;
    const reportText = generatePlainTextReport(currentAnalysis);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CatchUp-AI-Report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Report downloaded successfully!");
  });

  printReportBtn.addEventListener('click', () => {
    window.print();
  });

  function generatePlainTextReport(data) {
    let out = `====================================================\n`;
    out += `CATCHUP AI — "WHAT DID I MISS?" REPORT\n`;
    out += `Generated: ${new Date().toLocaleString()}\n`;
    out += `Processing Engine: ${data.provider}\n`;
    out += `Privacy Status: ${data.privacyDisclosure}\n`;
    out += `====================================================\n\n`;

    out += `[1] PRIMARY TOPIC:\n${data.summary.mainTopic}\n\n`;

    out += `[2] EXECUTIVE SUMMARY:\n`;
    data.summary.bulletPoints.forEach((b, i) => {
      out += `• ${b}\n`;
    });
    out += `\n`;

    out += `[3] IMPORTANT MESSAGES & DECISIONS (${data.importantItems.length}):\n`;
    data.importantItems.forEach((item, i) => {
      out += `(${item.type.toUpperCase()}) [${item.priority} Priority] ${item.title}\n`;
      out += `   Sender: ${item.sender} (${item.timestamp})\n`;
      out += `   Evidence: "${item.quote}"\n\n`;
    });

    out += `[4] ACTION ITEMS (${data.actionItems.length}):\n`;
    data.actionItems.forEach((task, i) => {
      out += `[ ] ${task.task}\n`;
      out += `    Assignee: ${task.assignee} (${task.assigneeType})\n`;
      out += `    Deadline: ${task.deadline} (${task.deadlineType || 'None'})\n`;
      out += `    Priority: ${task.priority} - ${task.priorityReason}\n\n`;
    });

    out += `[5] DEADLINES & DATES:\n`;
    data.deadlinesAndDates.forEach(d => {
      out += `• ${d.dateText} [${d.status}] - Context: "${d.context}"\n`;
    });

    return out;
  }

  // --- 7. Settings Modal & Privacy Configuration ---
  privacyBadge.addEventListener('click', openSettings);
  openSettingsBtn.addEventListener('click', openSettings);

  function openSettings() {
    settingsModal.style.display = 'flex';
  }

  function closeSettings() {
    settingsModal.style.display = 'none';
  }

  closeSettingsBtn.addEventListener('click', closeSettings);
  cancelSettingsBtn.addEventListener('click', closeSettings);

  engineSelect.addEventListener('change', () => {
    if (engineSelect.value === 'local') {
      apiKeyGroup.style.display = 'none';
    } else {
      apiKeyGroup.style.display = 'block';
      apiKeyInput.placeholder = engineSelect.value === 'gemini' 
        ? "Paste Google Gemini API Key (e.g. AIzaSy...)" 
        : "Paste OpenAI API Key (e.g. sk-...)";
    }
  });

  saveSettingsBtn.addEventListener('click', () => {
    const selectedMode = engineSelect.value;
    const key = apiKeyInput.value.trim();

    if (selectedMode === 'local') {
      engine.setEngineConfig('local', null, '');
      privacyDot.style.background = '#10b981';
      privacyDot.style.boxShadow = '0 0 6px #10b981';
      privacyStatusText.textContent = '100% Local NLP (Zero Cloud Sharing)';
      privacyDisclaimerText.textContent = 'Local-first mode active. Your conversations are not uploaded anywhere.';
      showToast("Switched to Local NLP Mode.");
    } else {
      if (!key) {
        alert("Please enter a valid API key for " + (selectedMode === 'gemini' ? 'Google Gemini' : 'OpenAI') + " or choose Local Mode.");
        return;
      }
      engine.setEngineConfig('cloud', selectedMode, key);
      privacyDot.style.background = '#06b6d4';
      privacyDot.style.boxShadow = '0 0 6px #06b6d4';
      privacyStatusText.textContent = `Cloud AI Mode (${selectedMode === 'gemini' ? 'Gemini' : 'OpenAI'})`;
      privacyDisclaimerText.textContent = `Transmitting directly to ${selectedMode === 'gemini' ? 'Google Gemini' : 'OpenAI'} API via HTTPS.`;
      showToast("Cloud AI configured successfully.");
    }

    closeSettings();
  });

  // --- 8. Helper Utilities ---
  function showError(msg) {
    errorMessage.textContent = msg;
    errorBanner.style.display = 'flex';
  }

  function hideError() {
    errorBanner.style.display = 'none';
  }

  function showToast(text) {
    toastNotice.textContent = text;
    toastNotice.style.display = 'block';
    setTimeout(() => {
      toastNotice.style.display = 'none';
    }, 2800);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Pre-load Sample 1 into textarea on page load for immediate testing readiness
  const initialSamples = (typeof window !== 'undefined' && window.SAMPLE_CONVERSATIONS) ? window.SAMPLE_CONVERSATIONS : (typeof SAMPLE_CONVERSATIONS !== 'undefined' ? SAMPLE_CONVERSATIONS : null);
  if (initialSamples && initialSamples.launchCrunch) {
    chatInput.value = initialSamples.launchCrunch.rawText;
    updateCharCount();
  }
});
