gsap.to("h1", {opacity: 1, duration: 1, delay: .5});

gsap.to(".rhs h2", {
  delay: 1,
  duration: 1.5,
  opacity: 1,
  stagger: .25 // 0.1 seconds between when each ".box" element starts animating
});
