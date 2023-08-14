gsap.to("h1", {opacity: 1, duration: 1, delay: .5});

gsap.to(".rhs p", {
  delay: .5,
  duration: 1.5,
  opacity: 1,
  stagger: .5 // 0.1 seconds between when each ".box" element starts animating
});
