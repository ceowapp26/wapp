class Utils {
  constructor(){
  this.getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}40`;
  /*window.addEventListener("appinstalled", (evt) => {
    localStorage.setItem("pwaInstalled", "yes");
    pwaInstalled = true;
    document.getElementById("installPWA").style.display = "none";
  });

  this.toggleSwitch.addEventListener("change", this.switchTheme, false);
  let pwaInstalled = localStorage.getItem("pwaInstalled") == "yes";
  if (window.matchMedia("(display-mode: standalone)").matches) {
    localStorage.setItem("pwaInstalled", "yes");
    pwaInstalled = true;
  }
  if (window.navigator.standalone === true) {
    localStorage.setItem("pwaInstalled", "yes");
    pwaInstalled = true;
  }
  if (pwaInstalled) {
    document.getElementById("installPWA").style.display = "none";
  } else {
    document.getElementById("installPWA").style.display = "inline-flex";
  }
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    deferredPrompt = e;
  });*/
  }
  getBooks = async (book) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${book}`
    );
    const data = await response.json();
    return data;
  }

  getGoogleBooks = async (userID, bookshelfID) => {
    const response = await fetch(
      `https://books.google.com/books?uid=${userID}/bookshelves/${bookshelfID}`
    );
    const data = await response.json();
    return data;
  }

   extractThumbnail = ({ imageLinks }) => {
    const DEFAULT_THUMBNAIL = "icons/logo.svg";
    if (!imageLinks || !imageLinks.thumbnail) {
      return DEFAULT_THUMBNAIL;
    }
    return imageLinks.thumbnail.replace("http://", "https://");
  }
  switchTheme = ({ target }) => {
    if (target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      document
        .querySelector("meta[name=theme-color]")
        .setAttribute("content", "#090b28");
      localStorage.setItem("marcdownTheme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document
        .querySelector("meta[name=theme-color]")
        .setAttribute("content", "#ffffff");
      localStorage.setItem("marcdownTheme", "light");
    }
  }

  async installPWA() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(({ outcome }) => {
        if (outcome === "accepted") {
          console.log("Your PWA has been installed");
        } else {
          console.log("User chose to not install your PWA");
        }
        deferredPrompt = null;
      });
    }
  }  
}

export default Utils;



