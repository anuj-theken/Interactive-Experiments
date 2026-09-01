/* ==========================================================================
   AGGREGATE — pure functions over window.ROWS (see data.js: one record per
   respondent, `tags` = one entry per life-area category they answered).
   Every chart re-derives its numbers from a filtered slice on every filter
   change instead of reading pre-computed numbers, so the page stays exact
   regardless of which categories / emotions / age bands / cities are active.
   ========================================================================== */
window.Aggregate = (function () {
  const ALL_CATS = [
    "Money & investing", "Groceries", "Fitness & wellness", "Shopping & deals",
    "Learning & hobbies", "Getting around", "Health & medical", "Food & eating out",
    "Travel & holidays", "Going out", "Kids & school", "Weddings",
    "Beauty & self-care", "Pets"
  ];
  const ALL_EMOTIONS = ["Frustrating", "Procrastinate", "Repetitive"];
  const ALL_AGE_BINS = ["<25", "25-34", "35-44", "45-54", "55+"];
  const SYSTEM_LABELS = ["Apps", "Nothing at all", "Family", "Chats", "Friends", "Broker/Agent", "Excel/Spreadsheet", "House staff"];

  const STOPWORDS = new Set(("i me my myself we our ours ourselves you your yours yourself yourselves he him his himself " +
    "she her hers herself it its itself they them their theirs themselves what which who whom this that these those " +
    "am is are was were be been being have has had having do does did doing a an the and but if or because as until " +
    "while of at by for with about against between into through during before after above below to from up down in " +
    "out on off over under again further then once here there when where why how all any both each few more most " +
    "other some such no nor not only own same so than too very s t can will just don should now also im ive dont " +
    "isnt didnt cant couldnt wouldnt wont its it's i've i'm don't didn't can't couldn't wouldnt won't thats that's " +
    "youre you're theres there's ill i'll youll you'll get got one us really much still even lot lots way often " +
    "make making makes go going goes back like ok okay yeah na n a etc via per").split(/\s+/));

  function tokenize(text) {
    return (text || "").toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/)
      .map(w => w.replace(/^'+|'+$/g, ""))
      .filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  }

  /* ------------------------------------------------------------------ */

  // Single-select per dimension — null means "All" (no restriction).
  function defaultFilters() {
    return { cat: null, emotion: null, ageBin: null, city: null };
  }

  // Flattens ROWS into { respondents, tagRows } for the given filter state.
  // A respondent matches if their age/city pass the (optional) age/city
  // restriction AND they have at least one tag passing the cat/emotion
  // restriction. tagRows carries the parent respondent's ageBin/city/pilot
  // alongside each qualifying tag, so age x category style matrices don't
  // need a second pass over ROWS.
  function slice(rows, filters) {
    const respondents = [];
    const tagRows = [];

    rows.forEach(r => {
      if (filters.ageBin && r.ageBin !== filters.ageBin) return;
      if (filters.city && r.city !== filters.city) return;
      const matchingTags = r.tags.filter(t =>
        (!filters.cat || t.cat === filters.cat) &&
        (!filters.emotion || t.emotion === filters.emotion)
      );
      if (matchingTags.length === 0) return;
      respondents.push(r);
      matchingTags.forEach(t => tagRows.push(Object.assign({ ageBin: r.ageBin, city: r.city, pilot: r.pilot }, t)));
    });

    return { respondents, tagRows };
  }

  function median(nums) {
    if (!nums.length) return null;
    const s = nums.slice().sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }

  function wordCount(text) {
    return (text || "").trim().split(/\s+/).filter(Boolean).length;
  }

  const JUNK_STORY = /^(n\.?\/?a\.?|none|nil|no|nothing|not applicable|-+|—+|\.+)$/i;
  function isRealStory(text) {
    const t = (text || "").trim();
    return t.length > 0 && !JUNK_STORY.test(t);
  }

  // Produces a DATA-shaped object (matching the original hand-authored
  // structure) from a filtered { respondents, tagRows } slice.
  function deriveAggregates(rows, filters) {
    filters = filters || defaultFilters();
    const { respondents, tagRows } = slice(rows, filters);
    const selectedCats = filters.cat ? [filters.cat] : ALL_CATS;

    // demand — tag count per category
    const demandMap = {};
    selectedCats.forEach(c => { demandMap[c] = 0; });
    tagRows.forEach(t => { demandMap[t.cat]++; });
    const demand = selectedCats.map(c => ({ cat: c, count: demandMap[c] })).sort((a, b) => b.count - a.count);

    // emotionOverall
    const emotionOverall = {};
    ALL_EMOTIONS.forEach(e => { emotionOverall[e] = 0; });
    tagRows.forEach(t => { emotionOverall[t.emotion]++; });

    // heatmap + quad (dominant emotion + frustShare) per category
    const heatmap = {};
    const quad = [];
    selectedCats.forEach(c => {
      const row = { Frustrating: 0, Procrastinate: 0, Repetitive: 0 };
      heatmap[c] = row;
    });
    tagRows.forEach(t => { heatmap[t.cat][t.emotion]++; });
    selectedCats.forEach(c => {
      const row = heatmap[c];
      const total = row.Frustrating + row.Procrastinate + row.Repetitive;
      const dominant = ALL_EMOTIONS.reduce((best, e) => row[e] > row[best] ? e : best, "Frustrating");
      quad.push({
        cat: c, picked: total,
        frustShare: total ? Math.round((row.Frustrating / total) * 1000) / 10 : 0,
        dominant
      });
    });

    // systems
    const systems = {};
    tagRows.forEach(t => { if (t.system) systems[t.system] = (systems[t.system] || 0) + 1; });

    // age
    const ageBins = {};
    ALL_AGE_BINS.forEach(b => { ageBins[b] = 0; });
    const ages = [];
    respondents.forEach(r => {
      if (r.ageBin) ageBins[r.ageBin]++;
      if (r.age != null) ages.push(r.age);
    });
    const medianAge = median(ages);

    const ageCatCats = demand.slice(0, 4).map(d => d.cat);
    const ageCatMatrix = {};
    const ageEmotionMatrix = {};
    ALL_AGE_BINS.forEach(b => {
      ageCatMatrix[b] = {}; ageCatCats.forEach(c => { ageCatMatrix[b][c] = 0; });
      ageEmotionMatrix[b] = { Frustrating: 0, Procrastinate: 0, Repetitive: 0 };
    });
    tagRows.forEach(t => {
      if (!t.ageBin) return;
      ageEmotionMatrix[t.ageBin][t.emotion]++;
      if (ageCatMatrix[t.ageBin][t.cat] !== undefined) ageCatMatrix[t.ageBin][t.cat]++;
    });

    // cities — top 12 among matching respondents
    const cityCounts = {};
    respondents.forEach(r => { if (r.city) cityCounts[r.city] = (cityCounts[r.city] || 0) + 1; });
    const cities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

    // pilot
    const pilotYes = respondents.filter(r => r.pilot === "yes").length;
    const pilotNo = respondents.filter(r => r.pilot === "no").length;

    // words — top 12, broken down by the top 4 categories (+ Other)
    const wordTotals = {};
    const wordByCat = {};
    tagRows.forEach(t => {
      tokenize(t.story).forEach(w => {
        wordTotals[w] = (wordTotals[w] || 0) + 1;
        if (!wordByCat[w]) wordByCat[w] = {};
        const bucket = ageCatCats.indexOf(t.cat) !== -1 ? t.cat : "Other";
        wordByCat[w][bucket] = (wordByCat[w][bucket] || 0) + 1;
      });
    });
    const topWords = Object.entries(wordTotals).sort((a, b) => b[1] - a[1]).slice(0, 12);
    const wordStackCats = ageCatCats.concat(["Other"]);
    const wordStack = topWords.map(([word, total]) => {
      const row = { word, total };
      wordStackCats.forEach(c => { row[c] = (wordByCat[word] && wordByCat[word][c]) || 0; });
      return row;
    });

    // story extremes per emotion
    const storyExtremes = {};
    ALL_EMOTIONS.forEach(e => {
      const stories = tagRows.filter(t => t.emotion === e && isRealStory(t.story));
      if (!stories.length) { storyExtremes[e] = null; return; }
      const withWords = stories.map(t => ({ words: wordCount(t.story), text: t.story, cat: t.cat }));
      const avg = Math.round((withWords.reduce((s, x) => s + x.words, 0) / withWords.length) * 10) / 10;
      const shortest = withWords.reduce((a, b) => b.words < a.words ? b : a);
      const longest = withWords.reduce((a, b) => b.words > a.words ? b : a);
      storyExtremes[e] = { avg, n: withWords.length, shortest, longest };
    });

    return {
      totalRespondents: respondents.length,
      totalTags: tagRows.length,
      demand, emotionOverall, heatmap, quad, systems,
      ageBins, medianAge, ageCatMatrix, ageCatCats, ageEmotionMatrix,
      cities, pilot: { yes: pilotYes, no: pilotNo, total: pilotYes + pilotNo },
      topWords, wordStack, wordStackCats, storyExtremes,
      tagRows // kept for the sidebar drill-down (sample quotes, per-dimension detail)
    };
  }

  return {
    ALL_CATS, ALL_EMOTIONS, ALL_AGE_BINS, SYSTEM_LABELS,
    defaultFilters, slice, deriveAggregates, tokenize, wordCount, isRealStory
  };
})();
