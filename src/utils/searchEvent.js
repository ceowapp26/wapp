const debounce = (fn, time, to = 0) => {
  to ? clearTimeout(to) : (to = setTimeout(fn, time));
};

const updateFilter = (element, viewPort, searchValue, f) => {
  if ( viewPort ) {
    viewPort.scrollIntoView({
      behavior: "smooth",
    });
  }

  let m;
  switch (f) {
    case "author":
      m = "inauthor:";
      break;
    case "subject":
      m = "subject:";
      break;
    default:
      m = "";
  }
  if(element) searchValue = m + element.innerHTML;
  debounce(updateFilter, 1000);
  return searchValue;
};

export { debounce, updateFilter };
