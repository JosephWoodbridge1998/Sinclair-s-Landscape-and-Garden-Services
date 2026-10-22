(() => {
  'use strict';
  function init() {
    if (document.getElementById('project-gallery')) return;
    const intro = document.getElementById('about-work');
    if (!intro) return;
    const base = 'images/projects/';
    const entries = [
      ['Back garden pergola','Before & After',['back-garden-pergola']],
      ['Fence panel replacement','Before & After',['fence-panel-replacement']],
      ['Garden gate installation','Before & After',['garden-gate']],
      ['Garden clearance','Before & After',['garden-clearance-overview','garden-clearance-details']],
      ['Fox and Hounds hedge trimming','Before & After',['fox-and-hounds-hedges']],
      ['Ditch clearance','Before & After',['ditch-clearance']],
      ['Garden path construction','Work stages',['garden-path']],
      ['Covered garden seating','Before & After',['covered-seating']],
      ['Patio installation','Before & After',['patio-installation']]
    ];
    const active = [
      ['Fish pond','Projects in progress',['fish-pond-pending']],
      ['Garden clearance','Projects in progress',['garden-clearance-underway']],
      ['Garden renovation','Projects in progress',['garden-renovation-underway']],
      ['Driveway','Projects in progress',['driveway-pending']]
    ];
    const visual = intro.querySelector('.showcase-visual');
    if (visual) {
      visual.replaceChildren();
      visual.classList.add('van-panel');
      const image = document.createElement('img');
      image.src = base + 'work-van.webp';
      image.alt = "Sinclair's Landscape and Garden Services branded work van";
      image.loading = 'lazy'; image.decoding = 'async'; visual.append(image);
    }
    const section = document.createElement('section');
    section.id = 'work'; section.className = 'section project-gallery';
    section.innerHTML = `<div class="container" id="project-gallery"><div class="section-head"><div class="section-tag">Our Work</div><h2>Real gardens. Real transformations.</h2><p>Explore our Before &amp; After photographs and follow our projects in progress. Select a photograph to see the full image.</p></div><div class="project-filters" role="group" aria-label="Filter projects"><button type="button" data-view="all" aria-pressed="true">All projects</button><button type="button" data-view="completed" aria-pressed="false">Before &amp; After</button><button type="button" data-view="active" aria-pressed="false">Projects in progress</button></div><div data-group="completed"><h3 class="project-group-title">Before &amp; After</h3><p class="project-group-note">See the difference, from garden clearances to new outdoor spaces. Construction-stage photographs are labelled separately.</p><div class="project-grid" id="completed-projects"></div></div><div data-group="active" class="active-project-group"><h3 class="project-group-title">Projects in progress</h3><p class="project-group-note">Follow the work as it takes shape. These photographs show projects that are not yet presented as complete.</p><div class="project-grid" id="active-projects"></div></div><div class="project-enquiry"><p>Your garden could be our next transformation.</p><a class="btn" href="#contact">Discuss your project →</a></div></div>`;
    intro.after(section);
    const dialog = document.createElement('dialog'); dialog.className = 'project-lightbox';
    dialog.setAttribute('aria-labelledby','project-lightbox-title');
    dialog.innerHTML = `<div class="lightbox-toolbar"><h3 id="project-lightbox-title"></h3><button type="button" class="lightbox-close" aria-label="Close full image">Close ×</button></div><img alt=""><div class="lightbox-navigation"><button type="button" class="lightbox-prev">← Previous image</button><span aria-live="polite"></span><button type="button" class="lightbox-next">Next image →</button></div>`;
    document.body.append(dialog);
    let current = null, position = 0;
    function renderImage() {
      const img = dialog.querySelector('img'); img.src = base + current[2][position] + '.webp';
      img.alt = current[0] + ' — ' + current[1] + ', image ' + (position + 1);
      dialog.querySelector('h3').textContent = current[0] + ' · ' + current[1];
      dialog.querySelector('.lightbox-navigation span').textContent = (position + 1) + ' / ' + current[2].length;
      dialog.querySelector('.lightbox-prev').disabled = position === 0;
      dialog.querySelector('.lightbox-next').disabled = position === current[2].length - 1;
      dialog.querySelector('.lightbox-navigation').hidden = current[2].length === 1;
    }
    function open(entry) { current = entry; position = 0; renderImage(); dialog.showModal(); }
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => { if(position > 0) { position--; renderImage(); } });
    dialog.querySelector('.lightbox-next').addEventListener('click', () => { if(position < current[2].length - 1) { position++; renderImage(); } });
    dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
    function card(entry, ongoing) {
      const article = document.createElement('article'); article.className = 'project-card' + (ongoing ? ' project-card-active' : '');
      const button = document.createElement('button'); button.type = 'button'; button.className = 'project-image-button';
      button.setAttribute('aria-label', 'View ' + entry[0] + ' — ' + entry[1]);
      const img = document.createElement('img'); img.src = base + entry[2][0] + '.webp'; img.alt = entry[0] + ' — ' + entry[1];
      img.loading = 'lazy'; img.decoding = 'async'; button.append(img);
      const hint = document.createElement('span'); hint.className = 'project-view-hint';
      hint.textContent = entry[2].length > 1 ? 'View ' + entry[2].length + ' images ↗' : 'View full image ↗';
      button.append(hint); button.addEventListener('click', () => open(entry));
      const text = document.createElement('div'); text.className = 'project-card-text';
      const badge = document.createElement('span'); badge.className = 'project-status' + (ongoing ? ' is-active' : ''); badge.textContent = entry[1];
      const title = document.createElement('h4'); title.textContent = entry[0];
      text.append(badge,title); article.append(button,text); return article;
    }
    entries.forEach(e => section.querySelector('#completed-projects').append(card(e,false)));
    active.forEach(e => section.querySelector('#active-projects').append(card(e,true)));
    section.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.view;
      section.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      section.querySelectorAll('[data-group]').forEach(group => { group.hidden = view !== 'all' && group.dataset.group !== view; });
    }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
