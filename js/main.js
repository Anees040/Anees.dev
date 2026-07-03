/* ============================================================
   Muhammad Anees — Portfolio interactions
   Vanilla JS · no dependencies
============================================================ */
(function () {
	"use strict";

	const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const isDesktop = window.matchMedia("(min-width: 900px)").matches;

	/* ---------- Preloader ---------- */
	const preloader = document.querySelector("[data-preloader]");
	const counter = document.querySelector("[data-preloader-count]");
	function runPreloader() {
		if (!preloader) return;
		let n = 0;
		const tick = setInterval(function () {
			n += Math.floor(Math.random() * 12) + 4;
			if (n >= 100) { n = 100; clearInterval(tick); }
			if (counter) counter.textContent = n;
			if (n === 100) {
				setTimeout(function () {
					preloader.classList.add("is-done");
					document.body.classList.remove("is-loading");
					kickHeroReveals();
				}, 350);
			}
		}, 120);
	}

	/* ---------- Reveal on scroll ---------- */
	const revealEls = document.querySelectorAll(".reveal");
	const io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
	revealEls.forEach(function (el) { io.observe(el); });

	function kickHeroReveals() {
		document.querySelectorAll(".hero .reveal").forEach(function (el) {
			el.classList.add("is-visible");
		});
	}

	/* ---------- Navbar scroll state + active link + progress ---------- */
	const nav = document.querySelector("[data-nav]");
	const progress = document.querySelector("[data-scroll-progress]");
	const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
	const sections = navLinks
		.map(function (l) { return document.querySelector(l.getAttribute("href")); })
		.filter(Boolean);

	function onScroll() {
		const y = window.scrollY;
		if (nav) nav.classList.toggle("is-scrolled", y > 40);
		if (progress) {
			const h = document.documentElement.scrollHeight - window.innerHeight;
			progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
		}
		let current = "";
		sections.forEach(function (sec) {
			if (y >= sec.offsetTop - 140) current = "#" + sec.id;
		});
		navLinks.forEach(function (l) {
			l.classList.toggle("is-active", l.getAttribute("href") === current);
		});
	}
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	/* ---------- Mobile menu ---------- */
	const toggle = document.querySelector("[data-nav-toggle]");
	if (toggle && nav) {
		toggle.addEventListener("click", function () { nav.classList.toggle("is-open"); });
		document.querySelectorAll(".nav__link").forEach(function (l) {
			l.addEventListener("click", function () { nav.classList.remove("is-open"); });
		});
	}

	/* ---------- Typewriter ---------- */
	const tw = document.querySelector("[data-typewriter]");
	if (tw) {
		const words = (tw.getAttribute("data-words") || "").split("|").filter(Boolean);
		let wi = 0, ci = 0, deleting = false;
		function type() {
			const word = words[wi];
			if (deleting) { ci--; } else { ci++; }
			tw.textContent = word.substring(0, ci);
			let delay = deleting ? 45 : 85;
			if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
			else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
			setTimeout(type, delay);
		}
		if (prefersReduced) { tw.textContent = words[0]; } else { type(); }
	}

	/* ---------- Animated counters ---------- */
	const counters = document.querySelectorAll("[data-count]");
	const cio = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			const target = parseInt(el.getAttribute("data-count"), 10);
			const suffix = el.getAttribute("data-suffix") || "";
			const dur = 1400; const start = performance.now();
			function step(now) {
				const p = Math.min((now - start) / dur, 1);
				const eased = 1 - Math.pow(1 - p, 3);
				el.textContent = Math.floor(eased * target) + suffix;
				if (p < 1) requestAnimationFrame(step);
			}
			requestAnimationFrame(step);
			cio.unobserve(el);
		});
	}, { threshold: 0.6 });
	counters.forEach(function (el) { cio.observe(el); });

	/* ---------- Custom cursor ---------- */
	if (isDesktop && !prefersReduced) {
		const dot = document.querySelector("[data-cursor-dot]");
		const ring = document.querySelector("[data-cursor-ring]");
		let mx = 0, my = 0, rx = 0, ry = 0;
		window.addEventListener("mousemove", function (e) {
			mx = e.clientX; my = e.clientY;
			if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
		});
		function ringLoop() {
			rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
			if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
			requestAnimationFrame(ringLoop);
		}
		ringLoop();
		document.querySelectorAll("a, button, [data-magnetic], .skill-card, .project__art").forEach(function (el) {
			el.addEventListener("mouseenter", function () { if (ring) ring.classList.add("is-hover"); });
			el.addEventListener("mouseleave", function () { if (ring) ring.classList.remove("is-hover"); });
		});
	}

	/* ---------- Magnetic buttons ---------- */
	if (isDesktop && !prefersReduced) {
		document.querySelectorAll("[data-magnetic]").forEach(function (el) {
			el.addEventListener("mousemove", function (e) {
				const r = el.getBoundingClientRect();
				const x = e.clientX - r.left - r.width / 2;
				const y = e.clientY - r.top - r.height / 2;
				el.style.transform = "translate(" + x * 0.25 + "px," + y * 0.35 + "px)";
			});
			el.addEventListener("mouseleave", function () { el.style.transform = ""; });
		});
	}

	/* ---------- Skill card spotlight ---------- */
	document.querySelectorAll(".skill-card").forEach(function (card) {
		card.addEventListener("mousemove", function (e) {
			const r = card.getBoundingClientRect();
			card.style.setProperty("--mx", (e.clientX - r.left) + "px");
			card.style.setProperty("--my", (e.clientY - r.top) + "px");
		});
	});

	/* ---------- Phone tilt ---------- */
	if (isDesktop && !prefersReduced) {
		const tiltEl = document.querySelector("[data-tilt]");
		const visual = document.querySelector(".hero__visual");
		if (tiltEl && visual) {
			visual.addEventListener("mousemove", function (e) {
				const r = visual.getBoundingClientRect();
				const px = (e.clientX - r.left) / r.width - 0.5;
				const py = (e.clientY - r.top) / r.height - 0.5;
				tiltEl.style.transform = "rotateY(" + px * 14 + "deg) rotateX(" + -py * 14 + "deg)";
			});
			visual.addEventListener("mouseleave", function () { tiltEl.style.transform = ""; });
		}
	}

	/* ---------- Footer year ---------- */
	const yearEl = document.querySelector("[data-year]");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	/* ---------- Init ---------- */
	document.body.classList.add("is-loading");
	if (document.readyState === "complete") { runPreloader(); }
	else { window.addEventListener("load", runPreloader); }
	// Safety: never let preloader trap the page
	setTimeout(function () {
		if (preloader && !preloader.classList.contains("is-done")) {
			preloader.classList.add("is-done");
			kickHeroReveals();
		}
	}, 4000);
})();
