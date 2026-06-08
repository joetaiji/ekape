// fullpage
const fullpageContainer = () => {
	let bullet = ['메인', '소통마당', /*'소통마당',*/ '홍보마당', /*'입찰공고',*/ '사업마당', 'footer'];
	var $type = $("html").attr("class");

	if ($type === "main") {
		const FULLPAGE_ANCHORS = ["visual", "community", "media", "business", "mfooter"];
		const FULLPAGE_SCROLLING_SPEED = 1000;
		const FULLPAGE_RESPONSIVE_MQ = window.matchMedia("(max-width: 1280px), (max-height: 900px)");

		const $fullpageSections = () => $("#container").children(".section");

		const isFullpageResponsive = () =>
			FULLPAGE_RESPONSIVE_MQ.matches ||
			$("html").hasClass("fp-responsive") ||
			$("body").hasClass("fp-responsive") ||
			$("#container").hasClass("fp-responsive");

		const isFullpageActive = () =>
			typeof $.fn.fullpage !== "undefined" &&
			typeof $.fn.fullpage.moveTo === "function" &&
			($("html").hasClass("fp-enabled") || $("body").hasClass("fp-enabled")) &&
			!isFullpageResponsive();

		const getSectionIndex = (section) => $fullpageSections().index(section);

		const getActiveSection = () => $("#container > .section.active").first();

		const isSectionViewportAligned = (section) =>
			!!section && Math.abs(section.getBoundingClientRect().top) < 8;

		const isBodyScrolled = () =>
			!!(
				window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop
			);

		const enableFullpageScrolling = () => {
			if (typeof $.fn.fullpage.setAllowScrolling === "function") {
				$.fn.fullpage.setAllowScrolling(true);
			}
			if (typeof $.fn.fullpage.setMouseWheelScrolling === "function") {
				$.fn.fullpage.setMouseWheelScrolling(true);
			}
		};

		const resetPageScroll = () => {
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		};

		const moveFullpageToSection = (section) => {
			if (!isFullpageActive() || !section) return;

			const index = getSectionIndex(section);
			if (index < 0) return;

			const anchor = FULLPAGE_ANCHORS[index];

			if (typeof $.fn.fullpage.silentMoveTo === "function") {
				$.fn.fullpage.silentMoveTo(anchor);
			} else {
				$.fn.fullpage.moveTo(index + 1);
			}

			resetPageScroll();
			enableFullpageScrolling();
		};

		const syncFullpageFocus = (target) => {
			const section = target.closest("#container .section");
			if (!section) return;

			const $activeSection = getActiveSection();
			const isActive = $activeSection.length && section === $activeSection[0];
			const isAligned = isSectionViewportAligned(section);
			const needsMove = !isActive || !isAligned || isBodyScrolled();

			if (!needsMove) {
				resetPageScroll();
				enableFullpageScrolling();
				return;
			}

			moveFullpageToSection(section);

			if (target === document.activeElement && typeof target.focus === "function") {
				target.focus({ preventScroll: true });
			}
		};

		const handleFullpageFocusSync = (e) => {
			if (!isFullpageActive()) return;

			const target = e.target;
			if (!target.closest("#container .section")) return;

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					syncFullpageFocus(target);
				});
			});
		};

		const handleFullpageScrollGuard = () => {
			if (!isFullpageActive() || !isBodyScrolled()) return;

			resetPageScroll();

			const $activeSection = getActiveSection();
			if ($activeSection.length) {
				moveFullpageToSection($activeSection[0]);
			}
		};

		const unbindFullpageFocusSync = () => {
			document.removeEventListener("focusin", handleFullpageFocusSync, true);
			window.removeEventListener("scroll", handleFullpageScrollGuard);
		};

		const bindFullpageFocusSync = () => {
			unbindFullpageFocusSync();

			if (!isFullpageActive()) return;

			document.addEventListener("focusin", handleFullpageFocusSync, true);
			window.addEventListener("scroll", handleFullpageScrollGuard, { passive: true });
		};

		const syncFullpageFocusSyncMode = () => {
			if (isFullpageActive()) {
				bindFullpageFocusSync();
				return;
			}

			unbindFullpageFocusSync();
		};

		$("#container").fullpage({
			anchors: FULLPAGE_ANCHORS,
			navigationTooltips: bullet,
			navigation: true,
			navigationPosition: "none",
			showActiveTooltip: true,
			menu: "#menu",
			responsiveWidth: 1280,
			responsiveHeight: 900,
			scrollingSpeed: FULLPAGE_SCROLLING_SPEED,
			slidesNavigation: true,
			keyboardScrolling: true,
			normalScrollElements: ".section-press-list ul",
			onResponsive: syncFullpageFocusSyncMode,
			afterResponsive: syncFullpageFocusSyncMode,
			afterLoad: function () {
				if (!isFullpageResponsive()) {
					resetPageScroll();
					enableFullpageScrolling();
				}
			},
		});

		syncFullpageFocusSyncMode();

		if (typeof FULLPAGE_RESPONSIVE_MQ.addEventListener === "function") {
			FULLPAGE_RESPONSIVE_MQ.addEventListener("change", syncFullpageFocusSyncMode);
		} else if (typeof FULLPAGE_RESPONSIVE_MQ.addListener === "function") {
			FULLPAGE_RESPONSIVE_MQ.addListener(syncFullpageFocusSyncMode);
		}


		for(let i = 0; i <= $('#fp-nav li').length; ++i) {
			$('#fp-nav li').eq(i).find('a').append(`<p><b>${bullet[i]}</b><i class="sr-only">섹션으로 이동</i></p>`)
			$("#fp-nav li").eq(i).find(">.fp-tooltip, a>span").remove();
		}
	}
}


// 비쥬얼 관련 스크립트
const mvisual = () => {
	var $container;

	const mvisualSlide = () => {
		$container = document.querySelector(".section-visual");
		const $slider = $container.querySelector(".section-visual-bg");

        const $util = $container.querySelector(".slide-util");
        const $slidePrev = $util.querySelector('button[data-slide-action="move-prev"]');
        const $slideNext = $util.querySelector('button[data-slide-action="move-next"]');

        const $slidePage = $util.querySelector(".slide-util-page");
        const $slideCurrent = $slidePage.querySelector(".slide-util-page-current");
        const $slideTotal = $slidePage.querySelector(".slide-util-page-total");

        const $slidePlay = $util.querySelector('button[data-slide-action="auto-play"]');
        const $slideStop = $util.querySelector('button[data-slide-action="auto-stop"]');

        let $slideLength = $slider.querySelectorAll(".swiper-slide").length;

        const $slide = new Swiper($slider, {
            slidesPerView: "auto",
            speed:1000,
            autoplay : {
            	delay: 7500,
				disableOnInteraction: false,
            },
            effect: "fade",
	        loop: true,
	        fadeEffect: {
	            crossFade: true,
	        },
            navigation: {
                nextEl: $slideNext, 
                prevEl: $slidePrev, 
            },
            on: {
            	init: function() {
            		$slideCurrent.innerHTML = "1";
					$slideTotal.innerHTML = $slideLength;

					$slidePlay.addEventListener('click', function() {
						$slide.autoplay.start();
					});

					$slideStop.addEventListener('click', function() {
						$slide.autoplay.stop();
					});
            	},
            	slideChange: function() {
            		$slideCurrent.innerHTML = this.realIndex + 1;
            	}
            }
        });
	}

	mvisualSlide();

	const mvisualMenu = () => {
		$container = $(".section-visual");

		const $menuContainer = $container.find(".section-visual-menu");
		const $menuToggle = $menuContainer.find(".section-visual-menu-list>li>a");
		const $menuSub = $menuToggle.siblings(".section-visual-menu-sub");
		const $menuSubClose = $menuContainer.find(".section-visual-menu-close");
		const $menuTotal = $menuContainer.find(".section-visual-menu-total");
		const $menuTotalClose = $menuTotal.find(".menu-total-close");

		$menuSub.each(function(){
			const $menuSubCode = $(this).html();
			$menuTotal.append("<div class='section-visual-menu-total-column'>"+ $menuSubCode +"</div>");
		});


		$menuToggle.on("click", function(e) {
			const $blankCheck = $(this).attr("target");
			console.log($blankCheck);
			if ($blankCheck != "_blank") {
				e.preventDefault();
				$menuToggle.removeClass("on");
				$(this).addClass("on");
			}
		});

		$menuSub.on("mouseleave", function() {
			if ($(window).width() > 1023) {
				$(this).siblings("a").removeClass("on");
			}
		});
		
		$menuSubClose.on("click", function() {
			$(this).parent().parent().siblings("a").removeClass("on");
		});

		$menuTotalClose.on("click", function(e) {
			e.preventDefault();
			$menuToggle.removeClass("on");
		});

	}

	mvisualMenu();
}

// 커뮤니티 관련 스크립트
const mcommunity = () => {
	var $container; 

	// 메인용 탭
	const mcommunityTab = (item) => {
		$container = $(".section-community");
		const $item = $container.find(item);

		const $firstButton = $item.find(".section-tab-button:first");
		const $firstDesc = $item.find(".section-tab-desc:first");
		const $firstUtil = $item.find(".section-tab-util:first");

		$firstButton.addClass("on");
		$firstDesc.show();
		$firstUtil.addClass("on");

		const $firstButtonText = $firstButton.find("span").text();

		$item.prepend(
			"<button type='button' class='section-tab-toggle'><span>"+ $firstButtonText +"</span></button>" +
			"<ul class='section-tab-toggle-list'></ul>"
		);

		$item.children(".section-tab-button").each(function() {
			const $buttonSource = $(this).clone().appendTo($(this).siblings(".section-tab-toggle-list"));
		});

		$(".section-tab-toggle-list").find(">a").wrap("<li></li>");

		const $button = $item.find(".section-tab-button");
		const $desc = $item.find(".section-tab-desc");
		const $util = $item.find(".section-tab-util");
		const $toggle = $item.find(".section-tab-toggle");
		const $toggleList = $item.find(".section-tab-toggle-list");

		$button.on("click", function(event){
			const $text = $(this).html();
			const $target = $(this).attr("href");
			const $targetDesc = $desc.filter($target);

			if (!$(this).hasClass("on")) {
				$button.removeClass("on");
				$(`.section-tab-button[href="${$target}"]`).addClass("on");
				$desc.hide();
				$util.removeClass("on");
				$targetDesc.fadeIn(500).prev(".section-tab-util").addClass("on");
				$toggle.html($text).removeClass("on");
				$toggle.removeClass("on");
			}
			event.preventDefault();
		})
	}

	// 배너 슬라이드
	const mcommunitySlideBanner = () => {
		$container = document.querySelector(".section-community-banner");
		const $sliders = $container.querySelectorAll(".slide-container");

		$sliders.forEach(function($slider) {
			var $slide = undefined;
            const $sliderParent = $slider.parentNode;
            const $util = $sliderParent.previousElementSibling;
            const $slidePrev = $util.querySelector('button[data-slide-action="move-prev"]');
            const $slideNext = $util.querySelector('button[data-slide-action="move-next"]');

            const $slidePage = $util.querySelector(".slide-util-page");
            const $slideCurrent = $slidePage.querySelector(".slide-util-page-current");
            const $slideTotal = $slidePage.querySelector(".slide-util-page-total");

            const $slidePlay = $util.querySelector('button[data-slide-action="auto-play"]');
            const $slideStop = $util.querySelector('button[data-slide-action="auto-stop"]');

            let $slideLength = $slider.querySelectorAll(".swiper-slide").length;

            $slidePlay.classList.add("off");

            $slide = new Swiper($slider, {
                slidesPerView: "auto",
                speed:1000,
                //loop:true,
                autoplay : {
                	delay: 6000,
					disableOnInteraction: false,
                },
                navigation: {
                    nextEl: $slideNext, 
                    prevEl: $slidePrev, 
                },
                on: {
                	init: function() {
                		$slideCurrent.innerHTML = "1";
						$slideTotal.innerHTML = $slideLength;

						$slidePlay.addEventListener('click', function() {
							$slidePlay.classList.add("off");
							$slideStop.classList.remove("off");
							$slide.autoplay.start();
						});

						$slideStop.addEventListener('click', function() {
							$slideStop.classList.add("off");
							$slidePlay.classList.remove("off");
							$slide.autoplay.stop();
						});
                	},
                	slideChange: function() {
                		$slideCurrent.innerHTML = this.realIndex + 1;
                	}
                }
            });

            const $tabButton = $container.querySelectorAll(".section-tab-button");

            $tabButton.forEach(function(button) {
            	button.addEventListener("click", function(){
	            	$slide.slideTo(0);
	            	$slide.autoplay.stop();
	            	$slider.classList.add("none-transition");
	            	setTimeout(function(){
	            		$slide.autoplay.start();
	            		$slider.classList.remove("none-transition");
	            	}, 50);
            	});
            });
		});
	}


	// 게시판 슬라이드
	const mcommunitySlideBoard = () => {
		$container = document.querySelector(".section-community-board");
		const $sliders = $container.querySelectorAll(".slide-container");

		$sliders.forEach(function($slider) {
			var $slide = undefined;
            const $sliderParent = $slider.parentNode;
            const $util = $sliderParent.previousElementSibling;
            const $slidePrev = $util.querySelector('button[data-slide-action="move-prev"]');
            const $slideNext = $util.querySelector('button[data-slide-action="move-next"]');
            
        	$slide = new Swiper($slider, {
                slidesPerView: "auto",
                speed:1000,
                navigation : {
                    nextEl : $slideNext, 
                    prevEl : $slidePrev, 
                },
            });

            const $tabButton = $container.querySelectorAll(".section-tab-button");
	        $tabButton.forEach(function(button) {
	        	button.addEventListener("click", function(){
	            	$slide.slideTo(0);
	            	$slider.classList.add("none-transition");
	            	setTimeout(function(){
	            		$slider.classList.remove("none-transition");
	            	}, 50);
	        	});
	        });
        });
	}


	mcommunityTab(".section-community-banner");
	mcommunityTab(".section-community-board");
	mcommunitySlideBanner();
	mcommunitySlideBoard();
}


/* 250218_사업공고 임시주석
const mannounce = () => {

	// 사업공고 슬라이드
	var $container;

	const mannounceSlide = () => {
		$container = document.querySelector(".section-announce");
		const $slider = $container.querySelector(".slide-container");
        const $slide = new Swiper($slider, {
            slidesPerView: "auto",
            speed:1000,
        });
	}

	mannounceSlide();
}
*/



const mmedia = () => {
	var $container;

	// 발간물(웹진/사례집 등) 탭 + 썸네일 슬라이더(수동) + 더보기 동기화
	const mmediaNewsletter = () => {
		const $root = document.querySelector(".section-media-newsletter [data-newsletter]");
		if (!$root) return;

		const $tabs = Array.from($root.querySelectorAll(".newsletter-tab[data-newsletter-tab]"));
		const $tabpanel = $root.querySelector(".newsletter-panel");
		const $more = $root.querySelector("[data-newsletter-more]");

		const $slider = $root.querySelector("[data-newsletter-slider]");
		const $wrapper = $slider?.querySelector(".swiper-wrapper");
		const $util = $root.querySelector(".newsletter-slider-util");
		const $prev = $util?.querySelector('button[data-newsletter-slide-action="move-prev"]');
		const $next = $util?.querySelector('button[data-newsletter-slide-action="move-next"]');
		const $current = $util?.querySelector(".newsletter-slider-current");
		const $total = $util?.querySelector(".newsletter-slider-total");

		if (!$slider || !$wrapper || !$prev || !$next || !$current || !$total || !$more || !$tabpanel) return;

		const $slideItems = Array.from($wrapper.querySelectorAll(".swiper-slide"));
		const $slideLinks = $slideItems.map((li) => li.querySelector("[data-newsletter-slide-link]"));
		const $slideImgs = $slideItems.map((li) => li.querySelector("[data-newsletter-slide-img]"));

		const getTemplateSlides = (key) => {
			const tpl = $root.querySelector(`template[data-newsletter-slides=\"${key}\"]`);
			if (!tpl) return [];
			const frag = tpl.content.cloneNode(true);
			const lis = Array.from(frag.querySelectorAll(".swiper-slide"));
			return lis
				.map((li) => {
					const a = li.querySelector("a");
					const img = li.querySelector("img");
					if (!a || !img) return null;
					return { href: a.getAttribute("href") || "#", img: img.getAttribute("src") || "", alt: img.getAttribute("alt") || "" };
				})
				.filter(Boolean);
		};

		const getTemplateMore = (key) => {
			const tpl = $root.querySelector(`template[data-newsletter-more=\"${key}\"]`);
			if (!tpl) return null;
			const a = tpl.content.querySelector("a");
			if (!a) return null;
			return {
				href: a.getAttribute("href") || "#",
				onclick: a.getAttribute("onclick") || "",
			};
		};

		const applySlidesToMarkup = (slides) => {
			// 슬라이드 마크업은 HTML에 고정 노출, JS는 속성만 갱신
			const max = Math.min($slideItems.length, slides.length);
			for (let i = 0; i < $slideItems.length; i++) {
				const li = $slideItems[i];
				const link = $slideLinks[i];
				const img = $slideImgs[i];
				const s = slides[i];

				if (!li || !link || !img) continue;

				if (i < max && s) {
					li.style.display = "";
					link.setAttribute("href", s.href);
					img.setAttribute("src", s.img);
					img.setAttribute("alt", s.alt || "");
				} else {
					li.style.display = "none";
				}
			}
		};

		const setMoreLink = (key) => {
			const more = getTemplateMore(key) || {
				href: $more.getAttribute("href") || "#",
				onclick: $more.getAttribute("onclick") || "",
			};
			$more.setAttribute("href", more.href);
			if (more.onclick) {
				$more.setAttribute("onclick", more.onclick);
			} else {
				$more.removeAttribute("onclick");
			}
		};

		const setActiveTabA11y = (activeKey) => {
			$tabs.forEach((btn) => {
				const isOn = btn.getAttribute("data-newsletter-tab") === activeKey;
				btn.classList.toggle("on", isOn);
				btn.setAttribute("aria-selected", isOn ? "true" : "false");
				if (isOn) $tabpanel.setAttribute("aria-labelledby", btn.id);
			});
		};

		const syncSlideTabIndex = () => {
			$slideItems.forEach((li, i) => {
				const link = $slideLinks[i];
				if (!link) return;
				const isHidden = li.style.display === "none";
				const isActive = li.classList.contains("swiper-slide-active");
				link.tabIndex = !isHidden && isActive ? 0 : -1;
			});
		};

		const focusFirstThumb = () => {
			// 탭 선택 후 썸네일 첫 링크로 포커스 이동 (키보드 Tab 순서는 건드리지 않음)
			requestAnimationFrame(() => {
				const $firstLink = getFirstThumbLink();
				if ($firstLink) $firstLink.focus();
			});
		};

		const getFirstThumbLink = () =>
			$slider.querySelector(".swiper-slide-active a") ||
			$root.querySelector('.newsletter-slider-thumb .swiper-slide:not([style*="display: none"]) a');

		const getActiveThumbLink = () => $slider.querySelector(".swiper-slide-active a");

		let swiper = null;

		const focusActiveSlideLink = () => {
			// 슬라이드 이동 시 활성 슬라이드의 첫 링크로 포커스 동기화
			// (키보드 사용자용: 버튼/슬라이더 영역에 포커스가 있을 때만 실행)
			const activeEl = document.activeElement;
			const shouldSync =
				(activeEl && $root.contains(activeEl)) &&
				(activeEl.closest(".newsletter-slider") || activeEl.closest(".newsletter-slider-util"));

			if (!shouldSync) return;

			requestAnimationFrame(() => {
				const $activeSlide = $slider.querySelector(".swiper-slide-active");
				const $link = $activeSlide?.querySelector("a");
				if ($link) $link.focus();
			});
		};

		const initSwiper = () => {
			const slideLength = $slider.querySelectorAll(".swiper-slide:not([style*=\"display: none\"])").length;
			$current.textContent = "1";
			$total.textContent = String(slideLength || 1);

			swiper = new Swiper($slider, {
				slidesPerView: 1,
				speed: 600,
				loop: false,
				autoplay: false,
				preventClicks: false,
				preventClicksPropagation: false,
				navigation: {
					nextEl: $next,
					prevEl: $prev,
				},
				on: {
					slideChange: function () {
						$current.textContent = String(this.realIndex + 1);
						syncSlideTabIndex();
					},
					slideChangeTransitionEnd: function () {
						focusActiveSlideLink();
					},
				},
			});
			syncSlideTabIndex();
		};

		const rebuildSwiper = () => {
			if (swiper) {
				swiper.destroy(true, true);
				swiper = null;
			}
			initSwiper();
		};

		let isInitialLoad = true;

		const applyCategory = (key, { moveFocus = !isInitialLoad } = {}) => {
			const keySafe = key || "webzine";
			const slides = getTemplateSlides(keySafe);
			setActiveTabA11y(keySafe);
			setMoreLink(keySafe);
			applySlidesToMarkup(slides);
			rebuildSwiper();
			if (moveFocus) focusFirstThumb();
			isInitialLoad = false;
		};

		// events
		$tabs.forEach((btn) => {
			btn.addEventListener("click", () => applyCategory(btn.getAttribute("data-newsletter-tab")));
			btn.addEventListener("keydown", (e) => {
				// basic roving for tabs
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					const i = $tabs.indexOf(btn);
					$tabs[(i + 1) % $tabs.length].focus();
				}
				if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const i = $tabs.indexOf(btn);
					$tabs[(i - 1 + $tabs.length) % $tabs.length].focus();
				}
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					applyCategory(btn.getAttribute("data-newsletter-tab"));
				}
			});
		});

		applyCategory("webzine");
	};

	// media 알림판 슬라이더
	const mmediaSlideBanner = () => {
		$container = document.querySelector(".section-media-banner");
		const $slider = $container.querySelector(".slide-container");

        const $util = $container.querySelector(".slide-util");
        const $slidePrev = $util.querySelector('button[data-slide-action="move-prev"]');
        const $slideNext = $util.querySelector('button[data-slide-action="move-next"]');

        const $slidePage = $util.querySelector(".slide-util-page");
        const $slideCurrent = $slidePage.querySelector(".slide-util-page-current");
        const $slideTotal = $slidePage.querySelector(".slide-util-page-total");

        const $slidePlay = $util.querySelector('button[data-slide-action="auto-play"]');
        const $slideStop = $util.querySelector('button[data-slide-action="auto-stop"]');

        let $slideLength = $slider.querySelectorAll(".swiper-slide").length;

        $slidePlay.classList.add("off");

        const $slide = new Swiper($slider, {
            slidesPerView: "auto",
            speed:1000,
            //loop:true,
            autoplay : {
            	delay: 7500,
				disableOnInteraction: false,
            },
            navigation: {
                nextEl: $slideNext, 
                prevEl: $slidePrev, 
            },
            on: {
            	init: function() {
            		$slideCurrent.innerHTML = "1";
					$slideTotal.innerHTML = $slideLength;

					$slidePlay.addEventListener('click', function() {
						$slidePlay.classList.add("off");
						$slideStop.classList.remove("off");
						$slide.autoplay.start();
					});

					$slideStop.addEventListener('click', function() {
						$slideStop.classList.add("off");
						$slidePlay.classList.remove("off");
						$slide.autoplay.stop();
					});
            	},
            	slideChange: function() {
            		$slideCurrent.innerHTML = this.realIndex + 1;
            	}
            }
        });
	}


	// media 축산원TV 슬라이더
	const mmediaSlideTV = () => {
		$container = document.querySelector(".section-media-tv");
		const $slider = $container.querySelector(".slide-container");
        const $util = $container.querySelector(".slide-util");
        const $slidePrev = $util.querySelector('button[data-slide-action="move-prev"]');
        const $slideNext = $util.querySelector('button[data-slide-action="move-next"]');

        const $slide = new Swiper($slider, {
            slidesPerView: "auto",
            speed:1000,
            //loop:true,
            navigation: {
                nextEl: $slideNext, 
                prevEl: $slidePrev, 
            },
        });
	}

	const mmediaRolling = () => {
		var $slider = new Swiper(".section-media-rolling", {
			//loop: true,
			speed: 7500,
			slidesPerView: 'auto',
			freeMode: true,
			autoplay: {
				delay: 1,
				disableOnInteraction: false,
			},
		});
	}

	const mmediaResize = () => {
		const $newsletter = $(".section-media-newsletter");
		let $titleHeight = $newsletter.find(".section-media-title").outerHeight();
		let $groupHeight = $(".section-media-group").outerHeight();
		let $height = $groupHeight - $titleHeight;

		if ($(window).width() > 1023) {
			$newsletter.find(".section-media-newsletter-card").css("height", $height);
		} else {
			$newsletter.find(".section-media-newsletter-card").removeAttr("style");
		}
	}

	mmediaNewsletter();
	mmediaSlideBanner();
	mmediaSlideTV();
	mmediaRolling();


	$(window).on("load resize", function() {
		mmediaResize();
	});
}


$(function () {
	fullpageContainer();
	mvisual();
	mcommunity();
	//mannounce();
	mmedia();
	
	$(".section-footer").find(".page-anchor").remove();
});