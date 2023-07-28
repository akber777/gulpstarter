// all select
const multiData = [];

const clearSelect = (e, multi) => {
  if (multi) {
    $(e).each(function (index, item) {
      item.sumo.unSelectAll();
    });
  } else {
    e.sumo.unSelectAll();
  }
};

$(".selectSumo").each(function (index, item) {
  const selectedStart = $(item).SumoSelect({
    renderLi: (li, originalOption) =>
      $(originalOption).attr("data-color")
        ? $(li).append(
            `<div class="backColorSelect" style="background-color:${$(
              originalOption
            ).attr("data-color")}" />`
          )
        : li,
  });
  selectedStart.sumo.unSelectAll();

  if ($(item).hasClass("noNext")) {
    multiData.push(selectedStart);
    $(item)
      .parent(".SumoSelect ")
      .find(".clearAllSelect")
      .on("click", clearSelect.bind(null, multiData, true));
  } else {
    $(item)
      .parent(".SumoSelect ")
      .find(".clearAllSelect")
      .on("click", clearSelect.bind(null, selectedStart, false));
  }
});

// slide filter

const filterBtn = $(".js-main-search-slide-down");

filterBtn.on("click", function () {
  $(".slide-blk").toggleClass("is-open");

  filterBtn
    .find("span")
    .text(!$(".slide-blk").hasClass("is-open") ? "Daha çox filtr" : "Gizlet");
});

// slider for cars detail
const mainSlider = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 7,
  freeMode: true,
  watchSlidesProgress: true,
});

const thumbSlider = new Swiper(".mySwiper2", {
  on: {
    transitionStart: () => {
      $(".mySwiper2 .swiper-slide").each(function (index, item) {
        if ($(item).hasClass("swiper-slide-active")) {
          $(".product-photos__slider-top-i_background").remove();
          $(item).append(
            `<span class="product-photos__slider-top-i_background" style=background-image:url(${$(
              item
            )
              .find("img")
              .attr("src")}) />`
          );
        }
      });
    },
  },
  loop: true,
  spaceBetween: 10,
  center: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: mainSlider,
  },
});

$(".mySwiper .swiper-slide").on("mouseover", function () {
  thumbSlider.slideTo($(this).index());
});

$(".mySwiper2 .swiper-slide").each(function (index, item) {
  if ($(item).hasClass("swiper-slide-active")) {
    $(".product-photos__slider-top-i_background").remove();
    $(item).append(
      `<span class="product-photos__slider-top-i_background" style=background-image:url(${$(
        item
      )
        .find("img")
        .attr("src")}) />`
    );
  }
});

// open popup

const openPopup = (item, className, removeItem, locate, e) => {
  e.preventDefault();
  if (locate === "home") {
    item.toggleClass("service-form");
    item.find(".price").addClass("hideBlock");

    item.find(".aboutPremium").addClass("showBlock");

    item.find(".prompt").addClass("hideBlock");

    item.find(".payment-form").addClass("showBlock");
  } else {
    item.toggleClass(className);
    removeItem.removeClass(className);
    $(
      '<div class="reveal-modal-bg" style="opacity: 0.8; display: block; cursor: pointer;"></div>'
    ).insertAfter(item);
  }
};

// open Modal

const allModal = [
  {
    main: ".js-click-edit-request",
    popup: ".confirm-edit",
  },
  {
    main: ".js-click-expire-request",
    popup: ".confirm-expire",
  },
  {
    main: "#bump_open",
    popup: "#bump_modal",
  },
  {
    main: "#vip_open",
    popup: "#vip_modal",
  },
  {
    main: "#featured_open",
    popup: "#featured_modal",
  },
  {
    main: "#next_premium",
    popup: ".reveal-modal-premium",
    locate: "home",
  },
  {
    main: "#featured_open_premium",
    popup: "#featured_modal_premium",
  },
  {
    main: ".az-payments-type-terminal",
    popup: "#terminal-promotion-modal",
  },
  {
    main: ".js-product-report-btn",
    popup: "#report",
  },
  {
    main: "#pin-recovery",
    popup: ".pin-recovery",
    remove: ".confirm-edit",
  },
  {
    main: "#pin_recovery_via_sms",
    popup: "#pin_recovery_modal",
  },
  {
    main: "#pin_recovery_via_email",
    popup: ".pin-recovery-email",
  },
];

$.each(allModal, function (index, item) {
  $(item.main).on(
    "click",
    openPopup.bind(
      this,
      $(item.popup),
      "reveal-modal_opened",
      $(item.remove),
      item.locate
    )
  );
});

$(".close-reveal-modal,.tz-modal__header-close").on("click", function () {
  $(".reveal-modal_opened").removeClass("reveal-modal_opened");
  $(".reveal-modal-bg").remove();

  $(".reveal-modal-premium").removeClass("service-form");
  $(".reveal-modal-premium").find(".price").removeClass("hideBlock");

  $(".reveal-modal-premium").find(".aboutPremium").removeClass("showBlock");

  $(".reveal-modal-premium").find(".prompt").removeClass("hideBlock");

  $(".reveal-modal-premium").find(".payment-form").removeClass("showBlock");
});

$("#change_home_premium").on("click", function () {

  $(".reveal-modal-premium").removeClass("service-form");
  $(".reveal-modal-premium").find(".price").removeClass("hideBlock");
  $(".reveal-modal-premium").find(".aboutPremium").removeClass("showBlock");
  $(".reveal-modal-premium").find(".prompt").removeClass("hideBlock");
  $(".reveal-modal-premium").find(".payment-form").removeClass("showBlock");
});

// add-cars open input file for downloading

$(".pond-new-img").on("click", function () {
  $(".pond-new-img-field").trigger("click");
});

$(".pond-img-card").each(function (index, item) {
  $(item).on("click", function () {
    $(".pond-new-img-field").trigger("click");
  });
});

$(".pond-new-img-field").on("change", function (e) {
  const addImage = (image) => {
    return `<div class="pond-img">
                <div class="pond-img-thumb-container"><a target="_blank"><img class="pond-img-thumb"
                            src="${image}"></a>
                </div>
                <div class="pond-img-actions"><a class="pond-img-delete" href="#" title="Silmək"></a>
                </div>
    </div>`;
  };

  $.each(this.files, function (index, _file) {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      $(".allImagesDiv").append(addImage(e.target.result));

      $(".pond-img-card").each(function (_index, _img) {
        if (index === _index) {
          $(this).css({
            display: "none",
          });
        }
      });

      $(".pond-img-delete").each(function (index, item) {
        $(item).on("click", function (e) {
          e.preventDefault();

          $(this).parent().parent().remove();

          $($(".pond-img-card")[index]).css({
            display: "block",
          });
        });
      });
    };

    fileReader.readAsDataURL(_file);
  });
});

// observer for cars detail

const options = {
  root: window.document,
  rootMargin: "0px",
};

const productHeader = document.querySelector(".product-heading-container");
const productSideBar = document.querySelector(".js-sticky-sidebar");
const breadCrumbsContainer = document.querySelector(".breadcrumbs-container");
const bannerCars = document.querySelector(".sameAnnouncement");
const footer = document.querySelector(".footer");

// observer breadcrumbs
const observerBreadCrumbs = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      $(productHeader).css({
        position: "fixed",
        top: 0,
        borderBottom: "1px solid #eaebf2",
      });

      $(productSideBar).css({
        position: "fixed",
        top: 70,
      });
    } else {
      $(productHeader).css({
        position: "relative",
        top: 0,
        borderBottom: "unset",
      });

      $(productSideBar).css({
        position: "relative",
        top: 0,
      });
    }
  });
}, options);

let isVisibleFromBanner = null;

const observerBanner = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      $(productSideBar).css({
        position: "relative",
        top: 0,
      });
    } else {
      if (isVisibleFromBanner) {
        $(productSideBar).css({
          position: "fixed",
          top: 70,
        });
      }
    }
  });
}, options);

const observerFooter = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisibleFromBanner = false;
      $(productSideBar).css({
        position: "relative",
        top: 0,
      });
    } else {
      isVisibleFromBanner = true;
    }
  });
}, options);

$(window).on("scroll", function () {
  observerBreadCrumbs.observe(breadCrumbsContainer);
  observerBanner.observe(bannerCars);
  observerFooter.observe(footer);
});
