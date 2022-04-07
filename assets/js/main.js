//make toggle on page link
let mediaQueryDown = window.matchMedia("(max-width: 991.98px)"),
  mediaQueryUp = window.matchMedia("(min-width: 992px)"),
  pageLink = document.querySelector(".drop-menu"),
  pageIcon = document.querySelector(".plus-icon"),
  subMenu = document.querySelector(".sub-menu"),
  navbar = document.querySelector(".menu"),
  logoImage = document.querySelector(".logo"),
  stickyLogo = document.querySelector(".sticky-logo"),
  containLinks = document.querySelector(".contain"),
  sliderInfo = document.querySelector(".start-sticky"),
  tabLinks = document.querySelectorAll(".tab-link"),
  tabPane = document.querySelectorAll(".tab-pane"),
  rowLayout = document.querySelectorAll(".layout"),
  colLayout,
  submitBtn = document.querySelectorAll(".submit"),
  productSlider = document.querySelector(".my-slider"),
  productDetails = document.querySelector(".product-content"),
  productDetailsContainer = document.querySelector(".item-container"),
  passTypeEl = document.querySelectorAll("[type='password']"),
  categorySelect = document.querySelector("select.category-select"),
  productContainer = document.querySelector(".product-list"),
  spanOfNumberProducts = document.querySelector(".number-of-products"),
  cartIcon = document.querySelectorAll(".icon-content"),
  productsInCart = document.querySelector(".cart-list"),
  plusIcon,
  minusIcon,
  shoppingCart = document.querySelectorAll(".cart-number"),
  addToCart,
  cartArr = [];
if (mediaQueryDown.matches) {
  if (pageLink != null) {
    pageLink.addEventListener("click", () => {
      if (subMenu != null) {
        if (subMenu.style.display === "block") {
          subMenu.style.display = "none";
        } else {
          subMenu.style.display = "block";
          subMenu.style.transform = "translateY(0)";
        }
      }
      //subMenu.classList.toggle("open");
      if (pageIcon.classList.contains("fa-plus")) {
        pageIcon.classList.remove("fa-plus");
        pageIcon.classList.add("fa-minus");
      } else {
        pageIcon.classList.remove("fa-minus");
        pageIcon.classList.add("fa-plus");
      }
    });
  }
}
let animateArr = document.querySelectorAll(".animate"),
  scrollTopBtn = document.querySelector(".go-to-top");
window.onscroll = function () {
  //animation on section
  animateSections(animateArr);
  //show go to top btn
  if (scrollTopBtn != null) {
    this.scrollY >= 400
      ? (scrollTopBtn.style.display = "block")
      : (scrollTopBtn.style.display = "none");
  }
  //navbar sticky
  if (mediaQueryUp.matches) {
    if (sliderInfo != null) {
      let infoHeight = sliderInfo.offsetHeight;
      let infoOffset = sliderInfo.offsetTop;
      if (this.scrollY > infoOffset + infoHeight) {
        navbar.classList.add("sticky");
        logoImage.style.display = "none";
        stickyLogo.style.display = "block";
        containLinks.classList.remove("container");
        containLinks.classList.add("container-fluid");
      } else {
        navbar.classList.remove("sticky");
        logoImage.style.display = "block";
        stickyLogo.style.display = "none";
        containLinks.classList.remove("container-fluid");
        containLinks.classList.add("container");
      }
    }
  } else {
    if (logoImage != null && stickyLogo != null) {
      logoImage.style.display = "block";
      stickyLogo.style.display = "none";
    }
  }
};
function animateSections(arr) {
  arr.forEach((el) => {
    if (window.scrollY >= el.parentElement.offsetTop - 600) {
      el.classList.add("animate-sections");
    }
  });
}
if (scrollTopBtn != null) {
  scrollTopBtn.onclick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
}

//preloader animation
let preloader = document.querySelector(".preloader");
window.addEventListener("DOMContentLoaded", () => {
  loadJson();
  setTimeout(() => {
    preloader.style.display = "none";
  }, 1200);
});
function loadJson() {
  fetch("../../products.json")
    .then((response) => response.json())
    .then((data) => {
      drawProducts(data, tabPane);
      makeSelectOfCategory(data);
      showProducts(data);
      addItemTocart(cartArr);
    });
}
function drawProducts(products, tabs) {
  tabs.forEach((tab) => {
    products.forEach((product) => {
      rowLayout.forEach((row) => {
        if (
          tab.id === product.category &&
          row.dataset.category === product.category
        ) {
          colLayout = document.createElement("div");
          colLayout.className = "col-layout col-md-6 col-lg-4";
          colLayout.dataset.category = product.category;
          let productApi = document.createElement("div");
          productApi.classList.add("popular-product", "product-api");
          productApi.dataset.cate = product.category;
          productApi.dataset.availible = product.availibility;
          let imageContainer = document.createElement("div");
          imageContainer.className = "image";
          let image = document.createElement("img");
          image.setAttribute("src", product.imgsrc);
          image.setAttribute("data-srcs", product.subimgsrc);
          image.alt = "product image";
          imageContainer.append(image);
          productApi.append(imageContainer);
          let head = document.createElement("h3");
          let anchor = document.createElement("a");
          anchor.href = "product-detail.html";
          anchor.className = "product-link";
          let textAnchor = document.createTextNode(product.name);
          anchor.append(textAnchor);
          head.append(anchor);
          productApi.append(head);
          let span = document.createElement("span");
          span.className = "price";
          span.textContent = `$${product.price}`;
          productApi.append(span);
          addToCart = document.createElement("i");
          addToCart.className = "fas fa-cart-arrow-down add-cart";
          productApi.appendChild(addToCart);
          colLayout.appendChild(productApi);
          row.append(colLayout);
          cartArr.push(addToCart);
        }
      });
    });
  });
}

if (submitBtn != null) {
  submitBtn.forEach((submit) => {
    submit.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

rowLayout.forEach((row) => {
  row.addEventListener("click", collectProductDetails);
});
function collectProductDetails(e) {
  if (e.target.classList.contains("product-link")) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}
function getProductInfo(product) {
  let productInfo = {
    id: Date.now(),
    mainSrc: product.querySelector(".image img").src,
    subSrcs: product.querySelector(".image img").dataset.srcs,
    name: product.querySelector("h3 a").textContent,
    category: product.dataset.cate,
    price: product.querySelector(".price").textContent,
    availible: product.dataset.availible,
  };
  addProductToLocalStorage(productInfo);
}
function addProductToLocalStorage(product) {
  localStorage.setItem("product-details", JSON.stringify(product));
}
function getProductFromLocalStorage() {
  let detail = localStorage.getItem("product-details");
  if (detail) {
    let itemDetail = JSON.parse(detail);
    addProductDetails(itemDetail);
  }
}
getProductFromLocalStorage();

function addProductDetails(product) {
  let srcs = product.subSrcs.split(",");
  if (productSlider != null) {
    if (productSlider.innerHTML != "") {
      productSlider.innerHTML = "";
      productSlider.innerHTML = `<div class="main-src" data-dot="<span><img src='${product.mainSrc}'></span>"><img src="${product.mainSrc}" alt=""></div>
    <div data-dot="<span><img src='${srcs[0]}'></span>"><img src="${srcs[0]}" alt=""></div>
    <div data-dot="<span><img src='${srcs[1]}'></span>"><img src="${srcs[1]}" alt=""></div>
    <div data-dot="<span><img src='${srcs[2]}'></span>"><img src="${srcs[2]}" alt=""></div>`;
    }
  }
  if (productDetails != null) {
    if (productDetails.innerHTML != "") {
      productDetails.innerHTML = "";
      productDetails.innerHTML = `<h3>${product.name}</h3>
      <span class="price">${product.price}</span>
      <div class="category">
          <span>category</span>
          <a href="#">: ${product.category}</a>
      </div>
      <div class="availibility">
          <span>availibility</span>
          <span>: ${product.availible}</span>
      </div>`;
    }
  }
}
if (passTypeEl != null) {
  passTypeEl.forEach((el) => {
    let passIcon = el.parentElement.querySelector("i");
    passIcon.addEventListener("click", (e) => {
      const type = el.getAttribute("type") === "password" ? "text" : "password";
      el.setAttribute("type", type);
      if (passIcon.classList.contains("fa-eye")) {
        passIcon.classList.remove("fa-eye");
        passIcon.classList.add("fa-eye-slash", "show");
      } else {
        passIcon.classList.remove("fa-eye-slash");
        passIcon.classList.add("fa-eye", "show");
      }
    });
  });
}
function makeSelectOfCategory(products) {
  let arr = [];
  products.forEach((product) => {
    arr.push(product.category);
  });
  let setOne = new Set(arr);
  for (let item of setOne) {
    let option = document.createElement("option");
    option.value = item;
    let optionText = document.createTextNode(item);
    option.appendChild(optionText);
    if (categorySelect != null) {
      categorySelect.appendChild(option);
    }
  }
  if (typeof jQuery !== "undefined") {
    $(categorySelect).niceSelect("update");
  }
}
function showProducts(products) {
  if (categorySelect != null) {
    categorySelect.onchange = () => {
      let selectOptions = categorySelect.options[categorySelect.selectedIndex];
      productContainer.innerHTML = "";
      products
        .filter((product) => product.category === selectOptions.value)
        .forEach((item) => {
          let colOfProduct = document.createElement("div");
          colOfProduct.className = "col-xl-4 col-lg-6 col-md-6 col-sm-6";
          let oneProduct = document.createElement("div");
          oneProduct.className = "single-product";
          colOfProduct.appendChild(oneProduct);
          let imageDiv = document.createElement("div");
          imageDiv.className = "image";
          oneProduct.appendChild(imageDiv);
          let image = document.createElement("img");
          image.src = item.imgsrc;
          imageDiv.appendChild(image);
          let productCaption = document.createElement("div");
          productCaption.className = "product-caption";
          oneProduct.appendChild(productCaption);
          let title = document.createElement("h3");
          let link = document.createElement("a");
          link.href = "#";
          let linkText = document.createTextNode(item.name);
          link.appendChild(linkText);
          title.appendChild(link);
          productCaption.appendChild(title);
          let price = document.createElement("span");
          price.textContent = `$${item.price}`;
          productCaption.appendChild(price);
          if (productContainer != null) {
            productContainer.appendChild(colOfProduct);
          }
        });
      spanOfNumberProducts.innerHTML = `${productContainer.childElementCount} Product found`;
    };
  }
}
if (cartIcon != null) {
  cartIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      location.href = "../../card.html";
    });
  });
}
function addItemTocart(arr) {
  let items = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", (e) => {
      if (typeof Storage !== undefined) {
        let item = {
          id: i + 1,
          name: arr[i].parentElement.querySelector("h3 a").textContent,
          image: arr[i].parentElement.querySelector(".image img").src,
          price: arr[i].parentElement
            .querySelector("span")
            .textContent.slice(
              1,
              arr[i].parentElement.querySelector("span").textContent.length
            ),
          no: 1,
        };
        if (JSON.parse(localStorage.getItem("items")) === null) {
          items.push(item);
          localStorage.setItem("items", JSON.stringify(items));
          window.location.reload();
        } else {
          const localItems = JSON.parse(localStorage.getItem("items"));
          localItems.map((data) => {
            if (item.id == data.id) {
              item.no = data.no + 1;
            } else {
              items.push(data);
            }
          });
          items.push(item);
          localStorage.setItem("items", JSON.stringify(items));
          window.location.reload();
        }
      } else {
        alert("local storage is not working on your browser");
      }
    });
  }
}

//draw product in cart
if (JSON.parse(localStorage.getItem("items"))) {
  JSON.parse(localStorage.getItem("items")).map((item) => {
    let row = document.createElement("div");
    row.className = "row product-in-cart";
    row.dataset.key = item.id;
    let deleteItem = document.createElement("i");
    deleteItem.className = "fas fa-window-close delete";
    row.appendChild(deleteItem);
    let colOne = document.createElement("div");
    colOne.className = "col-5 col-lg-8 col-md-7";
    let product = document.createElement("div");
    product.className = "product";
    let image = document.createElement("div");
    image.className = "image";
    let imageSrc = document.createElement("img");
    imageSrc.setAttribute("src", item.image);
    image.appendChild(imageSrc);
    let title = document.createElement("div");
    title.className = "text";
    let titleContent = document.createElement("p");
    let titleText = document.createTextNode(item.name);
    titleContent.appendChild(titleText);
    title.appendChild(titleContent);
    product.append(image, title);
    colOne.appendChild(product);
    let colTwo = document.createElement("div");
    colTwo.className = "col-2 col-md-1 d-flex ";
    let price = document.createElement("span");
    price.classList.add("product-price");
    let priceValue = document.createTextNode(`$${item.price}`);
    price.appendChild(priceValue);
    colTwo.appendChild(price);
    let colThree = document.createElement("div");
    colThree.className = "col-3 col-lg-2";
    let productNumber = document.createElement("div");
    productNumber.className = "product-number";
    plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus plus";
    inputField = document.createElement("input");
    inputField.className = "num form-control";
    inputField.type = "text";
    inputField.value = item.no;
    minusIcon = document.createElement("i");
    minusIcon.className = "fas fa-minus minus";
    productNumber.append(plusIcon, inputField, minusIcon);
    colThree.appendChild(productNumber);
    let colFour = document.createElement("div");
    colFour.className = "col-2 col-md-1 d-flex justify-content-center";
    let totalPrice = document.createElement("span");
    totalPrice.className = "product-total-price";
    let priceNumber = +item.price;
    let totalPriceText = document.createTextNode(
      `$${priceNumber * +inputField.value}`
    );
    totalPrice.appendChild(totalPriceText);
    colFour.appendChild(totalPrice);
    row.append(colOne, colTwo, colThree, colFour);
    if (productsInCart != null) {
      productsInCart.appendChild(row);
    }
  });
}

//add increment & decrement
let plusBtn = document.querySelectorAll(".plus"),
  minusBtn = document.querySelectorAll(".minus");
if (plusBtn != null) {
  for (let i = 0; i < plusBtn.length; i++) {
    let pBtn = plusBtn[i];
    pBtn.addEventListener("click", (e) => {
      btnClicked = e.target;
      let input = btnClicked.parentElement.children[1];
      if (input.value !== "") {
        if (+input.value <= 9) {
          let newVal = +input.value + 1;
          input.value = newVal;
        }
      }
    });
  }
}
if (minusBtn != null) {
  for (let i = 0; i < minusBtn.length; i++) {
    let mBtn = minusBtn[i];
    mBtn.addEventListener("click", (e) => {
      btnClicked = e.target;
      let input = btnClicked.parentElement.children[1];
      if (input.value !== "") {
        if (+input.value > 0 && +input.value <= 10) {
          let newVal = +input.value - 1;
          input.value = newVal;
        }
      }
    });
  }
}
//add number of products to cart
let num = 0;
shoppingCart.forEach((shopEl) => {
  if (JSON.parse(localStorage.getItem("items"))) {
    JSON.parse(localStorage.getItem("items")).map((item) => {
      num = num + item.no;
    });
    shopEl.innerHTML = num;
  }
});
//delete item cart
let message;
function deleteProduct() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      let deleteParent = e.target.parentElement;
      deleteParent.remove();

      let local = JSON.parse(localStorage.getItem("items")).filter(
        (item) => item.id != deleteParent.dataset.key
      );
      localStorage.setItem("items", JSON.stringify(local));
      window.location.reload();

      if (productsInCart.innerHTML == "") {
        let message = `<span class="message">Cart List Is Empty</span>`;
        productsInCart.innerHTML = message;
        shoppingCart.forEach((el) => {
          el.innerHTML = `0`;
        });
      }
    }
  });
  if (JSON.parse(localStorage.getItem("items"))) {
    if (JSON.parse(localStorage.getItem("items")).length === 0) {
      if (productsInCart != null) {
        if (productsInCart.innerHTML == "") {
          message = `<span class="message">Cart List Is Empty</span>`;
          productsInCart.innerHTML = message;
        }
      }
    }
  }
}
deleteProduct();
