// ============================================================
//  MAPA DE OPORTUNIDADES CON IA — app.js
// ============================================================

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE SUPABASE
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://knsipibqjvrlkanmyjes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuc2lwaWJxanZybGthbm15amVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDAzOTAsImV4cCI6MjA5NzExNjM5MH0.7vQK08n7OMnRBeOPZm4SN6Wv4-JovBAl5rdiuxcUJLg';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────
// ESTADO GLOBAL
// ─────────────────────────────────────────────
let allOpportunities = [];
let filteredOpportunities = [];

// ─────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadOpportunities();

  // Escuchar cambios en tiempo real desde Supabase
  db.channel('opportunities')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => {
      loadOpportunities();
    })
    .subscribe();
});

// ─────────────────────────────────────────────
// CARGAR OPORTUNIDADES DESDE SUPABASE
// ─────────────────────────────────────────────
async function loadOpportunities() {
  try {
    const { data, error } = await db
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allOpportunities = data || [];
    updateStats();
    updateFilterOptions();
    applyFilters();
  } catch (err) {
    console.error('Error al cargar:', err);
    showToast('Error al cargar las oportunidades. Verifica la configuración de Supabase.', 'error');
    document.getElementById('opportunities-grid').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Error de conexión</h3>
        <p>No se pudo conectar a Supabase. Revisa las credenciales en app.js</p>
      </div>
    `;
  }
}

// ─────────────────────────────────────────────
// ESTADÍSTICAS ANIMADAS
// ─────────────────────────────────────────────
function updateStats() {
  const cities     = new Set(allOpportunities.map(o => o.city)).size;
  const countries  = new Set(allOpportunities.map(o => o.country)).size;
  const totalLikes = allOpportunities.reduce((sum, o) => sum + (o.likes || 0), 0);

  animateNumber('stat-total',     allOpportunities.length);
  animateNumber('stat-cities',    cities);
  animateNumber('stat-countries', countries);
  animateNumber('stat-likes',     totalLikes);
}

function animateNumber(id, target) {
  const el      = document.getElementById(id);
  const current = parseInt(el.textContent) || 0;
  const diff    = target - current;
  if (diff === 0) return;

  const steps = 20;
  let step = 0;
  const interval = setInterval(() => {
    step++;
    el.textContent = Math.round(current + (diff * step) / steps);
    if (step >= steps) {
      el.textContent = target;
      clearInterval(interval);
    }
  }, 20);
}

// ─────────────────────────────────────────────
// ACTUALIZAR OPCIONES DE FILTROS
// ─────────────────────────────────────────────
function updateFilterOptions() {
  const citySelect    = document.getElementById('filter-city');
  const countrySelect = document.getElementById('filter-country');

  const currentCity    = citySelect.value;
  const currentCountry = countrySelect.value;

  const cities    = [...new Set(allOpportunities.map(o => o.city))].sort();
  const countries = [...new Set(allOpportunities.map(o => o.country))].sort();

  citySelect.innerHTML = '<option value="">🏙️ Todas las ciudades</option>' +
    cities.map(c => `<option value="${c}" ${c === currentCity ? 'selected' : ''}>${c}</option>`).join('');

  countrySelect.innerHTML = '<option value="">🌎 Todos los países</option>' +
    countries.map(c => `<option value="${c}" ${c === currentCountry ? 'selected' : ''}>${c}</option>`).join('');
}

// ─────────────────────────────────────────────
// FILTROS
// ─────────────────────────────────────────────
function applyFilters() {
  const city     = document.getElementById('filter-city').value;
  const country  = document.getElementById('filter-country').value;
  const category = document.getElementById('filter-category').value;

  filteredOpportunities = allOpportunities.filter(o => {
    if (city     && o.city     !== city)     return false;
    if (country  && o.country  !== country)  return false;
    if (category && o.category !== category) return false;
    return true;
  });

  const count = document.getElementById('results-count');
  count.textContent = filteredOpportunities.length === allOpportunities.length
    ? `${allOpportunities.length} oportunidades`
    : `${filteredOpportunities.length} de ${allOpportunities.length} oportunidades`;

  renderOpportunities();
}

function resetFilters() {
  document.getElementById('filter-city').value     = '';
  document.getElementById('filter-country').value  = '';
  document.getElementById('filter-category').value = '';
  applyFilters();
}

// ─────────────────────────────────────────────
// RENDERIZAR CARDS
// ─────────────────────────────────────────────
function renderOpportunities() {
  const grid = document.getElementById('opportunities-grid');

  if (filteredOpportunities.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔭</div>
        <h3>No hay oportunidades aquí todavía</h3>
        <p>¡Sé el primero en publicar una oportunidad de negocio con IA!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredOpportunities.map(op => createCard(op)).join('');
}

function createCard(op) {
  const catClass      = getCategoryClass(op.category);
  const catIcon       = getCategoryIcon(op.category);
  const potentialClass = getPotentialClass(op.potential);
  const potentialIcon  = getPotentialIcon(op.potential);
  const dateStr       = formatDate(op.created_at);

  return `
    <div class="card" id="card-${op.id}">
      <div class="card-header">
        <span class="card-category ${catClass}">${catIcon} ${op.category}</span>
        <span class="card-potential ${potentialClass}">${potentialIcon} ${op.potential}</span>
      </div>
      <div class="card-name">${escapeHtml(op.name)}</div>
      <div class="card-location">
        📍 <span>${escapeHtml(op.city)}</span> · ${escapeHtml(op.country)}
      </div>
      <div class="card-section">
        <div class="card-section-label">Problema</div>
        <div class="card-section-text">${escapeHtml(op.problem)}</div>
      </div>
      <div class="card-ai-solution">
        <div class="card-section-label">🤖 Solución con IA</div>
        <div class="card-section-text">${escapeHtml(op.ai_solution)}</div>
      </div>
      <div class="card-footer">
        <span class="card-date">${dateStr}</span>
        <button class="btn-like" id="like-btn-${op.id}" onclick="likeOpportunity('${op.id}', ${op.likes || 0})">
          ♥ <span id="like-count-${op.id}">${op.likes || 0}</span>
        </button>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// DAR LIKE
// ─────────────────────────────────────────────
async function likeOpportunity(id, currentLikes) {
  const btn     = document.getElementById(`like-btn-${id}`);
  const countEl = document.getElementById(`like-count-${id}`);

  // Evitar doble like en la misma sesión
  if (!btn || btn.classList.contains('liked')) return;

  btn.classList.add('liked');
  const newLikes = currentLikes + 1;
  countEl.textContent = newLikes;

  try {
    const { error } = await db
      .from('opportunities')
      .update({ likes: newLikes })
      .eq('id', id);

    if (error) throw error;

    // Actualizar estado local
    const op = allOpportunities.find(o => o.id === id);
    if (op) op.likes = newLikes;
    updateStats();

    showToast('¡Like registrado! 💜', 'success');
  } catch (err) {
    console.error('Error al dar like:', err);
    btn.classList.remove('liked');
    countEl.textContent = currentLikes;
    showToast('Error al registrar el like', 'error');
  }
}

// ─────────────────────────────────────────────
// PUBLICAR OPORTUNIDAD
// ─────────────────────────────────────────────
async function submitOpportunity(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.innerHTML = '<span>⏳</span> Publicando...';

  const newOp = {
    name:        document.getElementById('input-name').value.trim(),
    city:        document.getElementById('input-city').value.trim(),
    country:     document.getElementById('input-country').value.trim(),
    problem:     document.getElementById('input-problem').value.trim(),
    ai_solution: document.getElementById('input-ai-solution').value.trim(),
    category:    document.getElementById('input-category').value,
    potential:   document.getElementById('input-potential').value,
    likes:       0,
  };

  try {
    const { error } = await db.from('opportunities').insert([newOp]);
    if (error) throw error;

    closeModal();
    document.getElementById('form-opportunity').reset();
    showToast('¡Oportunidad publicada con éxito! 🚀', 'success');
    await loadOpportunities();
  } catch (err) {
    console.error('Error al publicar:', err);
    showToast('Error al publicar la oportunidad. Intenta de nuevo.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>🚀</span> Publicar Oportunidad';
  }
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
function openModal() {
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('input-name').focus(), 300);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─────────────────────────────────────────────
// TOAST (NOTIFICACIONES)
// ─────────────────────────────────────────────
let toastTimeout;

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type]} ${msg}`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─────────────────────────────────────────────
// FUNCIONES DE UTILIDAD
// ─────────────────────────────────────────────
function getCategoryClass(cat) {
  const map = {
    'Tecnología':     'cat-tecnologia',
    'Salud':          'cat-salud',
    'Educación':      'cat-educacion',
    'Comercio':       'cat-comercio',
    'Transporte':     'cat-transporte',
    'Alimentación':   'cat-alimentacion',
    'Sostenibilidad': 'cat-sostenibilidad',
    'Otro':           'cat-otro',
  };
  return map[cat] || 'cat-otro';
}

function getCategoryIcon(cat) {
  const map = {
    'Tecnología':     '🖥️',
    'Salud':          '🏥',
    'Educación':      '📚',
    'Comercio':       '🛍️',
    'Transporte':     '🚗',
    'Alimentación':   '🍽️',
    'Sostenibilidad': '🌱',
    'Otro':           '💡',
  };
  return map[cat] || '💡';
}

function getPotentialClass(p) {
  return p === 'Alto' ? 'potential-alto' : p === 'Medio' ? 'potential-medio' : 'potential-bajo';
}

function getPotentialIcon(p) {
  return p === 'Alto' ? '🚀' : p === 'Medio' ? '📈' : '🔍';
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}
