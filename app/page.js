"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [formStatus, setFormStatus] = useState(null); // 'sending', 'success', 'error', null
  const canvasRef = useRef(null);

  // 1. Theme Initialization & Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('kw-theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kw-theme', newTheme);
  };

  // 2. Custom Cursor & Hover Effects
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cr');
    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animateCursor = () => {
      if (cursor && ring) {
        cursor.style.left = `${mx - 4}px`;
        cursor.style.top = `${my - 4}px`;
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = `${rx - 15}px`;
        ring.style.top = `${ry - 15}px`;
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .svc, .case-card, .founder-card, .eng-card, .philo-card, .founder-photo-wrap');
    const addHover = () => document.body.classList.add('cx');
    const removeHover = () => document.body.classList.remove('cx');

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  // 3. Scroll Reveal & Navbar Shrink
  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
      
      // Active Nav Links
      let current = '';
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === '#' + current) a.classList.add('active');
        else a.classList.remove('active');
      });
    };

    window.addEventListener('scroll', handleScroll);

    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
    
    // Initial check for elements in viewport
    setTimeout(() => {
      revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
      });
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealEls.forEach(el => observer.unobserve(el));
    };
  }, []);

  // 4. Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      speed: 0.3 + Math.random() * 0.6,
      size: 0.5 + Math.random() * 1.2,
      maxOpacity: 0.15 + Math.random() * 0.3,
      life: Math.random()
    }));

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      const c = isDarkMode ? '200,169,110' : '154,110,46';
      
      particles.forEach(p => {
        p.y -= p.speed;
        p.life += 0.002;
        if (p.y < -10 || p.life > 1) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
        }
        const lo = p.life < 0.1 ? p.life * 10 : (p.life > 0.9 ? (1 - p.life) * 10 : 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${p.maxOpacity * lo})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 5. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.fname.value,
      email: e.target.femail.value,
      type: e.target.ftype.value,
      message: e.target.fmessage.value,
    };

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in required fields.");
      return;
    }

    setFormStatus('sending');
    
    // Simulate API call for now
    setTimeout(() => {
        setFormStatus('success');
        e.target.reset();
        setTimeout(() => setFormStatus(null), 5000);
    }, 1500);
  };

  return (
    <>
      <div id="cursor"></div>
      <div id="cr"></div>

      <nav id="navbar">
        <a href="#hero" className="nav-logo">
          <div className="nav-lm">KW</div>
          <div className="nav-lt">Kuralara <span>WebFlux</span></div>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" id="themeToggle" title="Toggle theme" onClick={toggleTheme}>
            {isDark ? '\u2600' : '\u263E'}
          </button>
          <a href="#contact" className="btn-nav">Start a Project</a>
        </div>
      </nav>

      <section id="hero">
        <div className="h-gl h-gl-v"></div>
        <div className="h-gl h-gl-h"></div>
        <div className="h-orb h-orb-1"></div>
        <div className="h-orb h-orb-2"></div>
        <canvas ref={canvasRef} id="particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}></canvas>

        <div className="hero-inner">
          <div className="hero-content">
            <div className="h-badge reveal"><div className="hb-dot"></div>Software Studio &nbsp;&#183;&nbsp; Tamil Nadu</div>
            <h1 className="h-headline reveal d1">We design and build<br /><em>scalable</em> web<br />applications.</h1>
            <p className="h-sub reveal d2">Engineered with clean architecture,<br />built for long-term growth.</p>
            <p className="h-philo reveal d3">For early-stage startups and product teams<br />that need structure from day one.</p>
            
            <div className="h-actions reveal d4">
              <div className="btn-grp">
                  <a href="#contact" className="btn-p">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Start a Project
                  </a>
                  <a href="#work" className="btn-s">View Our Work &#8594;</a>
              </div>
              <div className="cta-subtext">Typically responds within 24 hours</div>
            </div>
          </div>

          <div className="hsc reveal d2">
            <div className="hsc-head">
              <div className="hsc-dots">
                <div className="hsc-dot" style={{ background: '#FF5F57' }}></div>
                <div className="hsc-dot" style={{ background: '#FFBD2E' }}></div>
                <div className="hsc-dot" style={{ background: '#28CA41' }}></div>
              </div>
              <div className="hsc-ttl">system.architecture</div>
            </div>
            <div className="hsc-body">
              <div className="hsc-lbl">Engineering Stack</div>
              <div className="hsc-stack">
                <div className="hsc-si"><div className="hsc-sd"></div>MongoDB</div>
                <div className="hsc-si"><div className="hsc-sd"></div>Express.js</div>
                <div className="hsc-si"><div className="hsc-sd"></div>React.js</div>
                <div className="hsc-si"><div className="hsc-sd"></div>Node.js</div>
              </div>
              <div className="hsc-metrics">
                <div className="hsc-metric">
                  <div className="hsc-mnum">100<span style={{ fontSize: '18px' }}>%</span></div>
                  <div className="hsc-mlbl">Modular Design</div>
                </div>
                <div className="hsc-metric">
                  <div className="hsc-mnum">Zero</div>
                  <div className="hsc-mlbl">Tech Debt</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-ind">
          <div className="scroll-line"></div>
          <span className="scroll-txt">Scroll</span>
        </div>
      </section>

      <div className="divider"></div>

      <section id="audience" className="sf" style={{ background: 'var(--bg2)' }}>
        <div className="si">
          <div className="sl reveal">01 — Audience</div>
          <div className="about-grid" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="st reveal d1" style={{ marginBottom: 0 }}>Who We<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Work With.</em></h2>
            </div>
            <div className="reveal d2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="ab-pill"><span className="ab-pn">&#10003;</span><span className="ab-pt">Early-stage founders building SaaS products</span></div>
              <div className="ab-pill"><span className="ab-pn">&#10003;</span><span className="ab-pt">Startups scaling beyond their initial MVP</span></div>
              <div className="ab-pill"><span className="ab-pn">&#10003;</span><span className="ab-pt">Teams with unstable or messy codebases</span></div>
              <div className="ab-pill"><span className="ab-pn">&#10003;</span><span className="ab-pt">Businesses building secure internal systems</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="about" className="sw">
        <div className="about-grid">
          <div>
            <div className="sl reveal">02 — Studio</div>
            <h2 className="st reveal d1" style={{ marginBottom: '32px' }}>Engineering-<br />Driven<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>By Design.</em></h2>
          </div>
          <div>
            <p className="about-bq reveal"><strong>Kuralara WebFlux</strong> is a software development studio founded by engineers who believe products fail not because of design — but because of <strong>weak architecture.</strong></p>
            
            <p className="about-body reveal d1">We are not a freelance service. We are an engineering-driven startup focused on building software that is structured to survive growth.</p>
            
            <p className="about-body reveal d2">Every product we deliver is designed with system clarity before UI decoration, database modeling before dashboards, and secure access before admin panels. <em>A product without architecture is just a demo.</em></p>
            
            <div className="about-info reveal d3">
              <div className="ic"><div className="ic-lbl">Primary Stack</div><div className="ic-val">MERN — Full Stack</div></div>
              <div className="ic"><div className="ic-lbl">Status</div><div className="ic-val" style={{ color: 'var(--gold)' }}>Open for Projects &#9679;</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="philosophy" className="sf" style={{ background: 'var(--bg2)' }}>
        <div className="si">
          <div className="sl reveal">03 — Philosophy</div>
          <h2 className="st reveal d1" style={{ marginBottom: '48px' }}>How We <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Think.</em></h2>
          <div className="philo-grid">
            <div className="philo-card reveal">
              <div className="philo-code">01 // System Clarity</div>
              <div className="philo-title">Architecture Before Aesthetics</div>
              <p className="philo-desc">We design the system before the screen. Folder structure, data models, and API contracts are defined before a component is built.</p>
            </div>
            <div className="philo-card reveal d1">
              <div className="philo-code">02 // No Shortcuts</div>
              <div className="philo-title">Build Slow. Build Right.</div>
              <p className="philo-desc">Maintainability and stability are non-negotiable. Every technical decision we make is designed for the next two years of your growth.</p>
            </div>
            <div className="philo-card reveal d2">
              <div className="philo-code">03 // Modular Design</div>
              <div className="philo-title">Separation of Concerns</div>
              <p className="philo-desc">Clean controller-service-model separation. Each layer has a single responsibility. No spaghetti code. No coupled business logic.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="services" className="sw">
        <div className="sl reveal">04 — Expertise</div>
        <h2 className="st reveal d1">What We<br />Build.</h2>
        <div className="services-grid">
          <div className="svc reveal">
            <div className="svc-n">01 / FULL-STACK</div>
            <div className="svc-title">Scalable Web Applications</div>
            <p className="svc-desc">Production-ready MERN systems designed for rapid growth, high performance, and long-term maintainability.</p>
            <ul className="svc-list">
              <li>MERN Stack Systems</li>
              <li>Modular Frontend Architecture</li>
            </ul>
          </div>
          <div className="svc reveal d1">
            <div className="svc-n">02 / INFRASTRUCTURE</div>
            <div className="svc-title">Structured Backend Systems</div>
            <p className="svc-desc">Clean, layered architecture with secure REST APIs, role-based authentication, and robust error handling.</p>
            <ul className="svc-list">
              <li>Controller-Service-Model Pattern</li>
              <li>Secure API Development</li>
            </ul>
          </div>
          <div className="svc reveal d2">
            <div className="svc-n">03 / FOUNDATIONS</div>
            <div className="svc-title">Architecture-First Products</div>
            <p className="svc-desc">We build the technical foundation for SaaS platforms, marketplaces, and internal enterprise tools.</p>
            <ul className="svc-list">
              <li>SaaS MVP Foundations</li>
              <li>Admin & Internal Tools</li>
            </ul>
          </div>
        </div>
        <div className="section-footer reveal d3">
            <a href="#contact" className="btn-s">Discuss Your Project Requirements &#8594;</a>
        </div>
      </section>

      <div className="divider"></div>

      <section id="process" className="sf" style={{ background: 'var(--bg2)' }}>
        <div className="si">
          <div className="sl reveal">05 — Engineering Workflow</div>
          <h2 className="st reveal d1" style={{ marginBottom: '24px' }}>How We<br />Work.</h2>
          <p className="reveal d2" style={{ fontSize: '18px', color: 'var(--tm)', marginBottom: '56px' }}>A structured engineering workflow from idea to production.</p>
          
          <div className="process-grid">
            <div className="ps reveal">
              <div className="ps-num">01</div>
              <div className="ps-title">Business Logic</div>
              <p className="ps-desc">We learn your domain, users, constraints and growth goals before touching code.</p>
            </div>
            <div className="ps reveal d1">
              <div className="ps-num">02</div>
              <div className="ps-title">Architecture</div>
              <p className="ps-desc">System design document, folder structure and module boundaries defined first.</p>
            </div>
            <div className="ps reveal d2">
              <div className="ps-num">03</div>
              <div className="ps-title">Data Models</div>
              <p className="ps-desc">Schema design with relationships, indexes and constraints formulated early.</p>
            </div>
            <div className="ps reveal d3">
              <div className="ps-num">04</div>
              <div className="ps-title">Modular APIs</div>
              <p className="ps-desc">Layered REST APIs with clean separation, auth, validation and error handling.</p>
            </div>
            <div className="ps reveal d4">
              <div className="ps-num">05</div>
              <div className="ps-title">Frontend Integration</div>
              <p className="ps-desc">Clean React components connecting to the API — modular and state-managed.</p>
            </div>
            <div className="ps reveal d5">
              <div className="ps-num">06</div>
              <div className="ps-title">Deployment</div>
              <p className="ps-desc">Production deployment with configs, CI/CD, monitoring and documentation.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="work" className="sw">
        <div className="sl reveal">06 — Proven Output</div>
        <h2 className="st reveal d1">Case Studies<br />&amp; Architecture.</h2>
        
        <div className="cases-grid">
          <div className="case-card reveal d2">
            <div className="case-panel">
              <div className="case-n">FEATURED BUILD / 01</div>
              <h3 className="case-title">SaaS Platform Architecture</h3>
              <div className="case-stack">
                <span className="c-tag">MERN Stack</span>
                <span className="c-tag">JWT Auth</span>
                <span className="c-tag">Cloud Deployment</span>
              </div>
              <p className="case-desc"><strong>Problem:</strong> An early-stage SaaS product required a scalable backend foundation capable of handling complex relational data without accumulating immediate technical debt.</p>
              <p className="case-desc"><strong>Approach:</strong> We designed a strictly modular architecture, implemented stateless REST APIs with secure role-based access control, and normalized the database schema for future scalability.</p>
              <p className="case-desc"><strong>Outcome:</strong> Delivered a highly scalable system foundation alongside a clean, comprehensively documented codebase ready for immediate team handoff and feature scaling.</p>
            </div>
            <div className="case-div"></div>
            <div className="case-panel alt">
               <div className="hsc-metrics">
                <div className="hsc-metric" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <div className="hsc-mnum" style={{ fontSize: '32px' }}>100%</div>
                  <div className="hsc-mlbl">Modular Separation</div>
                </div>
                <div className="hsc-metric" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <div className="hsc-mnum" style={{ fontSize: '32px' }}>Zero</div>
                  <div className="hsc-mlbl">Tech Debt Inherited</div>
                </div>
              </div>
            </div>
          </div>

          <div className="case-card reveal">
            <div className="case-panel">
              <div className="case-n">FEATURED BUILD / 02</div>
              <h3 className="case-title">Marketplace Backend System</h3>
              <div className="case-stack">
                <span className="c-tag">Node.js</span>
                <span className="c-tag">Express</span>
                <span className="c-tag">MongoDB Aggregations</span>
              </div>
              <p className="case-desc"><strong>Problem:</strong> A multi-vendor marketplace struggled with slow query times and tightly coupled business logic making new feature additions hazardous.</p>
              <p className="case-desc"><strong>Approach:</strong> Extracted core business logic into isolated service layers, implemented complex MongoDB aggregation pipelines for performant querying, and standardized error handling.</p>
              <p className="case-desc"><strong>Outcome:</strong> Massively reduced API response times, decoupled the architecture for safe feature iteration, and established a reliable CI/CD deployment pipeline.</p>
            </div>
            <div className="case-div"></div>
            <div className="case-panel alt">
               <div className="hsc-metrics">
                <div className="hsc-metric" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <div className="hsc-mnum" style={{ fontSize: '32px' }}>Secured</div>
                  <div className="hsc-mlbl">API Endpoints</div>
                </div>
                <div className="hsc-metric" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                  <div className="hsc-mnum" style={{ fontSize: '32px' }}>Layered</div>
                  <div className="hsc-mlbl">Architecture</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-footer reveal">
            <a href="#contact" className="btn-s">Start Your Build &#8594;</a>
        </div>
      </section>

      <div className="divider"></div>

      <section id="engagement" className="sf" style={{ background: 'var(--bg2)' }}>
        <div className="si">
          <div className="sl reveal">07 — Delivery</div>
          <h2 className="st reveal d1" style={{ marginBottom: '56px' }}>Engagement Model.</h2>
          
          <div className="eng-grid">
            <div className="eng-card reveal d1">
              <div className="eng-num">01</div>
              <h4 className="eng-title">Discovery</h4>
              <p className="eng-desc">We map out your product requirements, user workflows, technical constraints, and long-term business goals.</p>
            </div>
            <div className="eng-card reveal d2">
              <div className="eng-num">02</div>
              <h4 className="eng-title">System Design</h4>
              <p className="eng-desc">We blueprint the database schema, API contracts, and core architecture before a single line of code is written.</p>
            </div>
            <div className="eng-card reveal d3">
              <div className="eng-num">03</div>
              <h4 className="eng-title">Development</h4>
              <p className="eng-desc">We execute the build using clean, modular code practices—prioritizing security, stability, and high performance.</p>
            </div>
            <div className="eng-card reveal d4">
              <div className="eng-num">04</div>
              <h4 className="eng-title">Delivery</h4>
              <p className="eng-desc">We deploy your product to a production environment, complete with comprehensive documentation and support.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="team" className="sw">
        <div className="sl reveal">08 — The Engineering Team</div>
        <h2 className="st reveal d1">Meet the<br />Founders.</h2>

        {/* --- NEW JOINT PHOTO BANNER --- */}
        <div className="founder-photo-wrap reveal d2">
          <div className="founder-photo-inner">
            <Image 
              src="/founder.png" 
              alt="Kurinji Eswar & Lakshara Anand - Founders of Kuralara WebFlux" 
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
            />
          </div>
          <div className="founder-photo-caption">
            <span className="f-cap-name">Kurinji Eswar JA</span>
            <span style={{ color: 'var(--gold)' }}>&#183;</span>
            <span className="f-cap-name">Lakshara Anand VV</span>
            <span className="f-cap-role">Co-Founders, Kuralara WebFlux</span>
          </div>
        </div>
        {/* ------------------------------ */}

        <div className="founders-grid">
          <div className="founder-card reveal d3">
            <div className="f-name">Kurinji Eswar JA</div>
            <div className="f-role">Co-Founder &amp; Software Engineer</div>
            <div className="f-sub">B.Tech CSE &#183; SRM University</div>
            <p className="f-bio">Kurinji architects scalable backend systems and modular frontend applications. Focused heavily on building long-term, maintainable infrastructures, his expertise spans the full MERN stack, database optimization, and deployment pipelines. He ensures every product fundamentally avoids early technical debt.</p>
            <div className="f-tags">
              <span className="f-tag">System Architecture</span>
              <span className="f-tag">Backend Scaling</span>
              <span className="f-tag">Full-Stack Dev</span>
            </div>
            <div className="f-links">
              <a href="https://linkedin.com/in/kurinji-eswar" target="_blank" className="f-link" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://github.com/Kurinji-Eswar" target="_blank" className="f-link" title="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
            </div>
          </div>
          
          <div className="founder-card reveal d4">
            <div className="f-name">Lakshara Anand VV</div>
            <div className="f-role">Co-Founder &amp; Software Engineer</div>
            <div className="f-sub">B.Tech CSE &#183; SRM University</div>
            <p className="f-bio">Lakshara builds robust application logic and resilient data pipelines. Focused on engineering systems that scale effortlessly, her work covers intelligent integrations, REST API design, and strict architectural standards. She ensures the codebase remains clean, predictable, and fully secure.</p>
            <div className="f-tags">
              <span className="f-tag">Clean Architecture</span>
              <span className="f-tag">API Design</span>
              <span className="f-tag">Full-Stack Dev</span>
            </div>
            <div className="f-links">
              <a href="https://linkedin.com/in/lakshara-anand" target="_blank" className="f-link" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://github.com/Lakshara-Anand-VV" target="_blank" className="f-link" title="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="trust" className="sf" style={{ background: 'var(--bg2)' }}>
        <div className="si">
          <div className="sl reveal">09 — The Guarantee</div>
          <h2 className="st reveal d1" style={{ textAlign: 'center', marginBottom: 0 }}>Why Kuralara <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>WebFlux</em></h2>
          
          <div className="trust-grid reveal d2">
            <div className="ic"><div className="ic-val" style={{ textAlign: 'center', fontWeight: 500 }}>Engineering-first approach</div></div>
            <div className="ic"><div className="ic-val" style={{ textAlign: 'center', fontWeight: 500 }}>Clean, maintainable systems</div></div>
            <div className="ic"><div className="ic-val" style={{ textAlign: 'center', fontWeight: 500 }}>Built for long-term scalability</div></div>
            <div className="ic"><div className="ic-val" style={{ textAlign: 'center', fontWeight: 500 }}>Transparent development process</div></div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section id="contact" className="sw">
        <div className="contact-layout">
          <div>
            <div className="sl reveal">10 — Contact</div>
            <h2 className="contact-title reveal d1">Have a<br />product<br />to <em>build?</em></h2>
            <p className="contact-body reveal d2">We work with early-stage founders, structured startups and established product teams. If you need an engineering team that prioritizes robust structure over rushed features, we want to hear from you.</p>
            <a href="mailto:contact@kuralarawebflux.com" className="contact-email reveal d3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              contact@kuralarawebflux.com
            </a>
          </div>
          <div className="reveal d1">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <div className="form-label">Name</div>
                  <input type="text" className="form-input" placeholder="Your name" id="fname" required />
                </div>
                <div className="form-group">
                  <div className="form-label">Email</div>
                  <input type="email" className="form-input" placeholder="your@email.com" id="femail" required />
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Project Type</div>
                <input type="text" className="form-input" placeholder="e.g. SaaS platform / Internal admin tool..." id="ftype" />
              </div>
              <div className="form-group">
                <div className="form-label">Tell Us About Your Project</div>
                <textarea className="form-textarea" placeholder="e.g. We are at the MVP stage and need a scalable backend foundation. Our timeline is..." id="fmessage" required></textarea>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                  <button type="submit" className="form-submit" disabled={formStatus === 'sending'}>
                    {formStatus === 'sending' ? 'Sending...' : 'Send Message \u2192'}
                  </button>
                  <div style={{ fontSize: '11px', color: 'var(--tm)', fontFamily: 'var(--font-mono), monospace', marginTop: '8px' }}>
                      Typically responds within 24 hours &nbsp;&#183;&nbsp; Initial discussion is free
                  </div>
              </div>

              {formStatus === 'success' && <div id="form-success">&#10003; Message sent! We'll get back to you within 24 hours.</div>}
              {formStatus === 'error' && <div id="form-error">Something went wrong. Please email us directly.</div>}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-copy">&copy; 2026 Kuralara WebFlux. All rights reserved.</div>
          <div className="footer-tagline">"Build slow. Build right. <span>Scale confidently.</span>"</div>
          <a href="#hero" className="back-top">&#8593;</a>
        </div>
      </footer>
    </>
  );
}