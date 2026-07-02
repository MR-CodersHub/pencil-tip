document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Featured Mentor Detailed Profile Data ─────────────────────────────────────
  const featuredMentor = {
    name: "Elena Rostova",
    role: "Master of Sketching & Watercolor",
    spec: "Gestural Drawing & Wet-on-Wet Watercolor",
    experience: "15+ Years",
    intro: "With over 15 years in graphite drawing and botanical watercolor, Elena's classes focus on structural sketching, precision perspective, and dynamic wet-on-wet washes.",
    img: "images/faculty_2.png",
    badges: ["Watercolor", "Structural Sketching", "Perspective Drawing", "Botanical Illustration", "Floral Wet Washes", "Life Drawing"],
    students: "980+",
    workshops: "35",
    courses: "9",
    bio: "A celebrated illustrator and watercolorist trained at the Repin St. Petersburg State Academic Institute of Fine Arts, Elena Rostova brings over 15 years of studio teaching to Pencil Tip Academy. Her classes blend structural graphite precision with the luminous freedom of wet-on-wet watercolor — nurturing students from foundational mark-making to exhibition-ready compositions. Elena's botanical studies and gestural figure work have been published in leading international art journals.",
    education: "BFA in Printmaking and Illustration – Repin Institute of Fine Arts, St. Petersburg",
    certifications: "Registered Artist Educator – International Watercolor Society",
    awards: [
      "Gold Medal for Excellence in Watercolor (2021)",
      "Outstanding Educator of the Year Award – Pencil Tip Academy (2024)",
      "Best Botanical Series – North American Illustration Guild (2019)"
    ],
    philosophy: "Patience and observation are the foundation of watercolor. Let the water guide your hand — but let your structure guide the water.",
    featuredArt: [
      "Wet Wash Florals Series (Watercolor, 2024)",
      "Structural Charcoal Volume Studies (Charcoal on Paper, 2025)",
      "Garden Light — Botanical Illustration (Watercolor, 2023)"
    ],
    coursesTaught: [
      "Structural Charcoal Mapping & Volume Studies",
      "Watercolor Florals & Wet-on-Wet Dynamics",
      "Perspective Drawing for Beginners & Intermediate"
    ],
    achievements: [
      "25+ students published in international botanical illustration journals.",
      "8 students received national grants for independent illustrative projects.",
      "5 alumni held their first solo watercolor exhibitions."
    ],
    socials: {
      web: "#",
      instagram: "#",
      behance: "#"
    }
  };

  // ── 2. Modal References ────────────────────────────────────────────────────
  const modal = document.getElementById('mentorModal');
  const modalBody = document.getElementById('mentorModalBody');
  const closeBtn = document.getElementById('mentorModalCloseBtn');
  const backdrop = document.getElementById('mentorModalBackdrop');
  let triggerButton = null;

  if (!modal || !modalBody || !closeBtn || !backdrop) return;

  // ── 3. Build Modal HTML ──────────────────────────────────────────────────
  function buildProfileHTML(mentor) {
    const awardsHTML = mentor.awards.map(a => `<li>${a}</li>`).join('');
    const artHTML = mentor.featuredArt.map(art => `<li>${art}</li>`).join('');
    const coursesHTML = mentor.coursesTaught.map(c => `<li>${c}</li>`).join('');
    const achievementsHTML = mentor.achievements.map(a => `<li>${a}</li>`).join('');

    let socialsHTML = '';
    if (mentor.socials.web) socialsHTML += `<a href="${mentor.socials.web}" target="_blank" rel="noopener">Website</a>`;
    if (mentor.socials.instagram) socialsHTML += `<a href="${mentor.socials.instagram}" target="_blank" rel="noopener">Instagram</a>`;
    if (mentor.socials.behance) socialsHTML += `<a href="${mentor.socials.behance}" target="_blank" rel="noopener">Behance</a>`;
    if (mentor.socials.artstation) socialsHTML += `<a href="${mentor.socials.artstation}" target="_blank" rel="noopener">ArtStation</a>`;

    return `
      <div class="mentor-profile-grid">
        <aside class="mentor-profile-sidebar">
          <div class="profile-img-wrap">
            <img src="${mentor.img}" alt="${mentor.name}">
          </div>
          <div class="profile-quick-stats">
            <div class="quick-stat-row"><span>Experience</span><span>${mentor.experience}</span></div>
            <div class="quick-stat-row"><span>Students</span><span>${mentor.students}</span></div>
            <div class="quick-stat-row"><span>Workshops</span><span>${mentor.workshops}</span></div>
            <div class="quick-stat-row"><span>Courses</span><span>${mentor.courses}</span></div>
          </div>
        </aside>

        <article class="mentor-profile-details">
          <h2 id="modalMentorName">${mentor.name}</h2>
          <span class="modal-role">${mentor.role}</span>
          <span class="modal-spec-tag">${mentor.spec}</span>

          <h3 class="detail-section-title">Biography</h3>
          <p>${mentor.bio}</p>

          <h3 class="detail-section-title">Teaching Philosophy</h3>
          <blockquote class="philosophy-quote">"${mentor.philosophy}"</blockquote>

          <h3 class="detail-section-title">Education & Credentials</h3>
          <ul class="detail-list">
            <li><strong>Education:</strong> ${mentor.education}</li>
            <li><strong>Certifications:</strong> ${mentor.certifications}</li>
          </ul>

          <h3 class="detail-section-title">Awards & Honors</h3>
          <ul class="detail-list">${awardsHTML}</ul>

          <h3 class="detail-section-title">Featured Works</h3>
          <ul class="detail-list">${artHTML}</ul>

          <h3 class="detail-section-title">Courses Handled</h3>
          <ul class="detail-list">${coursesHTML}</ul>

          <h3 class="detail-section-title">Student Triumphs & Success</h3>
          <ul class="detail-list">${achievementsHTML}</ul>

          <div class="portfolio-links">${socialsHTML}</div>
        </article>
      </div>
    `;
  }

  // ── 4. Open / Close Modal ─────────────────────────────────────────────────
  function openModal() {
    modalBody.innerHTML = buildProfileHTML(featuredMentor);
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (triggerButton) triggerButton.focus();
  }

  // ── 5. Event Listeners ────────────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-full-profile-btn');
    if (!btn) return;
    triggerButton = btn;
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
