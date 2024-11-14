// Wiking Custom Grid Script

$(".draggable_section").each(function (index) {
    let sectionEl = $(this);
    let canvasEl = $(this).find(".draggable_canvas");
    let handleClass = "draggable_list";
    let listEl = $(this).find("." + handleClass);
    let itemClass = ".draggable_item";
    let textEl = $(this).find(".draggable_title_text");
    let itemEl = $(this).find(".draggable_item");
    let scaleEl = $(this).find(".draggable-scale");
    let itemOpacity = itemEl.css("opacity");
    let columnCount = 9;
    let maxItems = columnCount * columnCount;
  
    if (itemEl.length % columnCount === 0) {
      itemEl.last().remove();
      itemEl = $(this).find(itemClass);
    }
    let totalItems = itemEl.length;
    for (let i = maxItems; i < totalItems; i++) {
      itemEl.eq(i).remove();
    }
    while (totalItems < maxItems) {
      itemEl.each(function (index) {
        if (totalItems < maxItems) {
          $(this).clone().appendTo(listEl);
          totalItems++;
        }
      });
    }
    itemEl = $(this).find(itemClass);
  
    gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
    gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
    gsap.fromTo(canvasEl, { opacity: 0 }, { opacity: 1 });
  
    let images = $(this).find(".draggable_img");
    
    // Timeline for zooming with a slower, smoother easing
    let zoomOutTl = gsap.timeline({ paused: true });
    let zoomInTl = gsap.timeline({ paused: true });
    
    zoomOutTl.to(canvasEl, { scale: 0.75, duration: 1, ease: "power1.out" }); // Slower zoom out with power1 easing
    zoomInTl.to(canvasEl, { scale: 1, duration: 1, ease: "power1.out" });     // Slower zoom in with power1 easing
    
    let pressTl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power3.out" } });
    pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
    pressTl.to(scaleEl, { scale: 1.1 }, "<");
    pressTl.to(textEl, { filter: "blur(30px)", opacity: 0, yPercent: 100 }, "<");
  
    // Smoother snapping animation
    function makeSlideActive(x, y) {
      let xValue = Math.round(x * (columnCount - 1)) + 1;
      let yValue = Math.round(y * (columnCount - 1)) + 1;
      let activeIndex = (yValue - 1) * columnCount + xValue - 1;
      let activeItem = itemEl.eq(activeIndex);
      textEl.text(activeItem.find(".draggable_title").text());
  
      // Apply smooth transition to the active item
      gsap.to(itemEl, { opacity: 0.5, duration: 0.5, ease: "power2.out" }); // Fade out other items
      gsap.to(activeItem, { opacity: 1, duration: 0.5, ease: "expo.out" }); // Smoothly focus on active item
    }
  
    let slider = new Dragdealer(canvasEl[0], {
      handleClass: handleClass,
      x: 0.5,
      y: 0.5,
      steps: columnCount,
      horizontal: true,
      vertical: true,
      speed: 0.5,
      loose: true,
      slide: true,
      requestAnimationFrame: true,
      dragStartCallback: function (x, y) {
        sectionEl.addClass("is-grabbing");
        gsap.to(itemEl, { opacity: itemOpacity, duration: 0.25 });
        pressTl.play();
        zoomOutTl.restart();
      },
      dragStopCallback: function (x, y) {
        sectionEl.removeClass("is-grabbing");
        pressTl.reverse();
        zoomInTl.restart();
      },
      callback: function (x, y) {
        makeSlideActive(x, y);
      }
    });
    
    makeSlideActive(slider.getValue()[0], slider.getValue()[1]);
  });