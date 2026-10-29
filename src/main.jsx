import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Filter, Globe2, LoaderCircle, MapPin, Moon, RotateCcw, Search, SlidersHorizontal, Sparkles, Sun, X } from 'lucide-react';
import './styles.css';

const DATA_URL = 'https://yc-oss.github.io/api/companies/all.json';
const translations = {
  tr: {
    live: 'Canlı veri', demo: 'Demo görünümü', companies: 'şirket', source: 'Kaynak veriyi aç',
    eyebrow: 'Y COMBINATOR COMPANY DIRECTORY', heroTitle: <>Bir sonraki <em>büyük</em><br />şirketi keşfet.</>, heroDescription: 'Y Combinator’ın tüm şirketlerini tek bir yerde keşfet, filtrele ve ilham al.',
    company: 'şirket', category: 'kategori', batch: 'batch', search: 'Şirket, sektör, şehir veya etiket ara...', filters: 'Filtreler', sort: 'Sırala', byName: 'İsme göre', byBatch: 'Batch’e göre',
    industry: 'Sektör', region: 'Bölge', status: 'Durum', all: 'Tümü', reset: 'Sıfırla', showing: 'şirket gösteriliyor', loading: 'Şirketler yükleniyor...', noResults: 'Sonuç bulunamadı',
    noResultsDescription: 'Arama veya filtrelerini değiştirerek tekrar dene.', clearFilters: 'Filtreleri temizle', visit: 'Web sitesini ziyaret et', dataSource: 'Veri kaynağı: Y Combinator open data', language: 'Dil', theme: 'Temayı değiştir', title: 'YC Atlas — Y Combinator şirketleri'
  },
  en: {
    live: 'Live data', demo: 'Demo view', companies: 'companies', source: 'Open source data',
    eyebrow: 'Y COMBINATOR COMPANY DIRECTORY', heroTitle: <>Discover the next <em>big</em><br />company.</>, heroDescription: 'Explore, filter, and find inspiration from every Y Combinator company in one place.',
    company: 'companies', category: 'categories', batch: 'batches', search: 'Search company, industry, city, or tag...', filters: 'Filters', sort: 'Sort', byName: 'By name', byBatch: 'By batch',
    industry: 'Industry', region: 'Region', status: 'Status', all: 'All', reset: 'Reset', showing: 'companies shown', loading: 'Loading companies...', noResults: 'No results found',
    noResultsDescription: 'Try changing your search or filters.', clearFilters: 'Clear filters', visit: 'Visit website', dataSource: 'Data source: Y Combinator open data', language: 'Language', theme: 'Toggle theme', title: 'YC Atlas — Y Combinator companies'
  }
};
const fallback = [
  { name: 'Airbnb', slug: 'airbnb', batch: 'W09', status: 'Active', industry: 'Consumer', tags: ['Travel', 'Marketplace'], regions: ['United States'], location: 'San Francisco, CA', description: 'Dünyanın her yerinden konaklama ve deneyim keşfedin.', website: 'https://www.airbnb.com' },
  { name: 'Stripe', slug: 'stripe', batch: 'S09', status: 'Active', industry: 'Fintech', tags: ['Payments', 'Developer Tools'], regions: ['United States', 'Ireland'], location: 'San Francisco, CA', description: 'İnternet şirketleri için finansal altyapı.', website: 'https://stripe.com' },
  { name: 'Figma', slug: 'figma', batch: 'S12', status: 'Active', industry: 'B2B', tags: ['Design', 'Collaboration'], regions: ['United States'], location: 'San Francisco, CA', description: 'Takımların birlikte tasarlamasını sağlayan yaratıcı platform.', website: 'https://www.figma.com' },
  { name: 'Gusto', slug: 'gusto', batch: 'S12', status: 'Active', industry: 'B2B', tags: ['HR Tech', 'SaaS'], regions: ['United States'], location: 'San Francisco, CA', description: 'Modern şirketler için maaş, yan haklar ve insan kaynakları.', website: 'https://gusto.com' },
  { name: 'Rappi', slug: 'rappi', batch: 'S16', status: 'Active', industry: 'Consumer', tags: ['Delivery', 'Marketplace'], regions: ['Latin America'], location: 'Bogotá, Colombia', description: 'Latin Amerika’nın günlük ihtiyaçlar için süper uygulaması.', website: 'https://www.rappi.com' },
  { name: 'Brex', slug: 'brex', batch: 'W17', status: 'Active', industry: 'Fintech', tags: ['Finance', 'B2B'], regions: ['United States'], location: 'San Francisco, CA', description: 'Geleceğin şirketleri için finansal yazılım.', website: 'https://www.brex.com' },
];

const arrayify = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
const normalize = (c, i) => ({
  id: c.id || c.slug || `${c.name || 'company'}-${i}`,
  name: c.name || c.title || 'İsimsiz şirket', slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-') || '',
  batch: c.batch || c.batch_name || '—', status: c.status || 'Active', industry: c.industry || c.industries?.[0] || 'Other',
  tags: arrayify(c.tags || c.industries), regions: arrayify(c.regions || c.region || c.country), location: c.location || arrayify(c.all_locations).join(', ') || [c.city, c.country].filter(Boolean).join(', ') || 'Konum belirtilmemiş',
  description: c.one_liner || c.description || c.long_description || 'YC şirketi', website: c.website || c.url || '', logo: c.small_logo_thumb_url || c.logo || ''
});

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('yc-atlas-language') || 'tr');
  const [theme, setTheme] = useState(() => localStorage.getItem('yc-atlas-theme') || 'light');
  const t = translations[language];
  const [companies, setCompanies] = useState(fallback.map(normalize));
  const [loading, setLoading] = useState(true); const [live, setLive] = useState(false); const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('All'); const [batch, setBatch] = useState('All'); const [region, setRegion] = useState('All'); const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('name'); const [showFilters, setShowFilters] = useState(false);
  useEffect(() => { const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 7000); fetch(DATA_URL, { signal: controller.signal }).then(r => r.json()).then(data => { const list = Array.isArray(data) ? data : data.companies || []; if (list.length) { setCompanies(list.map(normalize)); setLive(true); } }).catch(() => {}).finally(() => { clearTimeout(timeout); setLoading(false); }); return () => { clearTimeout(timeout); controller.abort(); }; }, []);
  const options = (key) => [...new Set(companies.flatMap(c => arrayify(c[key])).filter(x => x && x !== '—'))].sort();
  const filtered = useMemo(() => companies.filter(c => {
    const haystack = [c.name, c.description, c.industry, c.location, c.batch, ...c.tags, ...c.regions].join(' ').toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (industry === 'All' || c.industry === industry) && (batch === 'All' || c.batch === batch) && (region === 'All' || c.regions.includes(region)) && (status === 'All' || c.status === status);
  }).sort((a,b) => sort === 'batch' ? b.batch.localeCompare(a.batch) : a.name.localeCompare(b.name)), [companies, query, industry, batch, region, status, sort]);
  const reset = () => { setQuery(''); setIndustry('All'); setBatch('All'); setRegion('All'); setStatus('All'); };
  const activeFilters = [industry, batch, region, status].filter(x => x !== 'All').length;
  useEffect(() => { localStorage.setItem('yc-atlas-language', language); document.documentElement.lang = language; document.title = t.title; }, [language, t.title]);
  useEffect(() => { localStorage.setItem('yc-atlas-theme', theme); document.documentElement.dataset.theme = theme; }, [theme]);
  return <div className="app">
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">Y</span><span>YC <i>Atlas</i></span></a><div className="nav-note"><span className="live-dot" />{live ? t.live : t.demo} <span className="divider" />{companies.length.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} {t.companies}</div><div className="nav-actions"><button className="theme-toggle" onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')} aria-label={t.theme} title={t.theme}>{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}</button><label className="language-select"><Globe2 size={15} /><span className="sr-only">{t.language}</span><select value={language} onChange={e => setLanguage(e.target.value)} aria-label={t.language}><option value="tr">TR</option><option value="en">EN</option></select><ChevronDown size={13} /></label><a className="source-link" href={DATA_URL} target="_blank">{t.source} <ArrowUpRight size={15} /></a></div></header>
    <main id="top"><section className="hero"><div className="eyebrow"><Sparkles size={15} /> {t.eyebrow}</div><h1>{t.heroTitle}</h1><p>{t.heroDescription}</p><div className="hero-stats"><div><strong>{companies.length.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</strong><span>{t.company}</span></div><div><strong>{options('industry').length}</strong><span>{t.category}</span></div><div><strong>{options('batch').length}</strong><span>{t.batch}</span></div></div></section>
    <section className="directory"><div className="toolbar"><div className="search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}</div><button className={`filter-toggle ${showFilters || activeFilters ? 'selected' : ''}`} onClick={() => setShowFilters(v => !v)}><SlidersHorizontal size={17} /> {t.filters} {activeFilters > 0 && <b>{activeFilters}</b>}</button><label className="sort"><span>{t.sort}</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label={t.sort}><option value="name">{t.byName}</option><option value="batch">{t.byBatch}</option></select><ChevronDown size={15} /></label></div>
    {showFilters && <div className="filters"><Select label={t.industry} allLabel={t.all} value={industry} set={setIndustry} list={options('industry')} /><Select label={t.batch} allLabel={t.all} value={batch} set={setBatch} list={options('batch')} /><Select label={t.region} allLabel={t.all} value={region} set={setRegion} list={options('regions')} /><Select label={t.status} allLabel={t.all} value={status} set={setStatus} list={options('status')} /><button className="reset" onClick={reset}><RotateCcw size={15} /> {t.reset}</button></div>}
    <div className="result-line"><span><strong>{loading ? '...' : filtered.length.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</strong> {t.showing}</span>{query && <span className="query-pill">“{query}”</span>}</div>
    {loading ? <div className="loading"><LoaderCircle className="spin" /> {t.loading}</div> : filtered.length ? <VirtualizedCompanyGrid companies={filtered} language={language} visitLabel={t.visit} /> : <div className="empty"><div><Search size={24} /></div><h3>{t.noResults}</h3><p>{t.noResultsDescription}</p><button onClick={reset}>{t.clearFilters}</button></div>}
    </section></main><footer><span>YC Atlas</span><span>{t.dataSource}</span></footer></div>;
}
function Select({ label, allLabel, value, set, list }) { return <label className="select-wrap"><span>{label}</span><div><select value={value} onChange={e => set(e.target.value)}><option value="All">{allLabel}</option>{list.map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={15} /></div></label>; }
function VirtualizedCompanyGrid({ companies, visitLabel }) {
  const gridRef = useRef(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const updateColumns = () => {
      const width = grid.clientWidth;
      const minCardWidth = width <= 600 ? width : width <= 900 ? 270 : 280;
      const nextColumns = width <= 600 ? 1 : Math.max(1, Math.floor((width + 15) / (minCardWidth + 15)));
      setColumns(current => current === nextColumns ? current : nextColumns);
    };
    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const grouped = [];
    for (let index = 0; index < companies.length; index += columns) grouped.push(companies.slice(index, index + columns));
    return grouped;
  }, [companies, columns]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 300,
    overscan: 3,
    getItemKey: index => `${columns}-${index}`,
    measureElement: element => element.getBoundingClientRect().height,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [columns, virtualizer]);

  useEffect(() => {
    virtualizer.measure();
    virtualizer.scrollToIndex(0);
  }, [companies, virtualizer]);

  return <div ref={gridRef} className="grid virtual-grid" style={{ display: 'block', position: 'relative', height: `${virtualizer.getTotalSize()}px` }}>
    {virtualizer.getVirtualItems().map(row => <div key={row.key} ref={virtualizer.measureElement} data-index={row.index} className="virtual-row" style={{ transform: `translateY(${row.start}px)`, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {rows[row.index].map(company => <Card key={company.id} company={company} visitLabel={visitLabel} />)}
    </div>)}
  </div>;
}
const Card = React.memo(function Card({ company: c, visitLabel }) { return <article className="card"><div className="card-top"><div className="logo">{c.logo ? <img src={c.logo} alt="" /> : c.name.slice(0,1)}</div><span className="batch">{c.batch}</span></div><h2>{c.name}</h2><p>{c.description}</p><div className="meta"><span><MapPin size={14} /> {c.location}</span><span><BriefcaseBusiness size={14} /> {c.industry}</span></div><div className="tags">{c.tags.slice(0,3).map(t => <span key={t}>{t}</span>)}</div>{c.website && <a className="visit" href={c.website} target="_blank">{visitLabel} <ArrowUpRight size={15} /></a>}</article>; });
createRoot(document.getElementById('root')).render(<App />);
