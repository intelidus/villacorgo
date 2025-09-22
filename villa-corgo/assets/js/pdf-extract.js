// PDF extraction helpers (client-side using PDF.js via CDN)
(function () {
  async function extractPdfText(url) {
    if (!window.pdfjsLib) return '';
    try {
      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((it) => it.str).join('\n');
        text += (i > 1 ? '\n\n' : '') + pageText;
      }
      return text;
    } catch (err) {
      console.error('PDF extract error', err);
      return '';
    }
  }

  function normalizeLines(text) {
    return text
      .replace(/\r/g, '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  function buildBulletsFromText(text) {
    const lines = normalizeLines(text);
    const bullets = [];
    for (const line of lines) {
      if (/^(•|\-|–|\*|\u2022)\s*/.test(line)) {
        bullets.push(line.replace(/^(•|\-|–|\*|\u2022)\s*/, ''));
      } else if (/[:]\s*$/.test(line)) {
        bullets.push(line);
      }
    }
    if (bullets.length < 5) {
      // Fallback: take first 25 non-trivial lines
      return lines.filter((l) => l.length > 3).slice(0, 25);
    }
    return bullets;
  }

  function renderBullets(container, bullets) {
    if (!container) return;
    const ul = document.createElement('ul');
    ul.className = 'feature-list';
    bullets.forEach((b) => {
      const li = document.createElement('li');
      li.textContent = b;
      ul.appendChild(li);
    });
    container.innerHTML = '';
    container.appendChild(ul);
  }

  function parseTypologies(text) {
    const lines = normalizeLines(text).slice(0, 500);
    const typologyCounts = { T0: 0, T1: 0, T2: 0, T3: 0, T4: 0 };
    const typologyAreas = { T0: [], T1: [], T2: [], T3: [], T4: [] };
    const areaRegex = /(\d+[\.,]?\d*)\s*(m²|m2)/i;
    for (const line of lines) {
      const tMatch = line.match(/\bT\s*([0-4])\b/i);
      if (tMatch) {
        const key = `T${tMatch[1]}`;
        typologyCounts[key]++;
        const areaMatch = line.match(areaRegex);
        if (areaMatch) {
          const num = parseFloat(areaMatch[1].replace(',', '.'));
          if (!Number.isNaN(num)) typologyAreas[key].push(num);
        }
      }
    }
    return { counts: typologyCounts, areas: typologyAreas };
  }

  function renderTypologiesTable(container, data) {
    if (!container) return;
    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = '<thead><tr><th>Tipologia</th><th>Nº frações</th><th>Áreas (min–max m²)</th></tr></thead>';
    const tbody = document.createElement('tbody');
    ['T0','T1','T2','T3','T4'].forEach((k) => {
      const count = data.counts[k] || 0;
      const arr = data.areas[k] || [];
      let areaText = '—';
      if (arr.length) {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        areaText = `${min.toFixed(1)} – ${max.toFixed(1)}`;
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${count}</td><td>${areaText}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
  }

  async function init() {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Materiais (acabamentos)
    const acabEl = document.getElementById('acabamentos-list');
    if (acabEl) {
      const text = await extractPdfText('assets/img/galeria/ACABAMENTOS (vendas).pdf');
      const bullets = buildBulletsFromText(text);
      renderBullets(acabEl, bullets);
    }

    // Tipologias resumo
    const tipEl = document.getElementById('tipologias-table');
    if (tipEl) {
      let text = '';
      // tentar vários PDFs possíveis
      const candidates = [
        'assets/img/plantas/LOTE 2__fogos.pdf',
        'assets/img/plantas/Índice.pdf',
        'assets/img/plantas/Indice.pdf'
      ];
      for (const url of candidates) {
        try {
          text = await extractPdfText(url);
          if (text && text.length > 50) break;
        } catch (_) {}
      }
      if (text) {
        const data = parseTypologies(text);
        renderTypologiesTable(tipEl, data);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();

