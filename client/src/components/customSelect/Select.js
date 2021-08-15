export default class Select {
  constructor(element) {
    this.element = element;
    this.customElement = document.createElement("div");
    this.labelWrapper = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.labelRight = document.createElement("div");
    this.labelIcon = document.createElement("img");
    this.optionsCustomElement = document.createElement("ul");
    this.options = getFormattedOptions(element.querySelectorAll("option"));

    // set custom elements
    setupCustomElement(this);
    element.style.display = "none";
    element.after(this.customElement);
  }

  // get selected option
  get selectedOption() {
    return this.options.find((option) => option.selected);
  }

  // set/unset selected
  selectValue(val) {
    const currentSelected = this.options.find((option) => option.value === val);
    const prevSelected = this.selectedOption;

    prevSelected.selected = false;

    currentSelected.selected = true;

    this.optionsCustomElement
      .querySelector(`[data-value="${prevSelected.value}"]`)
      .classList.remove("selected");
    const newSelectedOption = this.optionsCustomElement.querySelector(
      `[data-value="${currentSelected.value}"]`
    );
    newSelectedOption.classList.add("selected");
    newSelectedOption.scrollIntoView({ block: "nearest" });

    this.labelElement.innerText = currentSelected.label;
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }
}

const setupCustomElement = (select) => {
  select.customElement.classList.add("csContainer");
  select.customElement.tabIndex = 0;

  select.labelWrapper.classList.add("csContainer__labelWrapper");
  select.customElement.append(select.labelWrapper);

  select.labelElement.classList.add("csContainer__label");
  select.labelElement.innerText = select.selectedOption.label;
  select.labelWrapper.append(select.labelElement);

  select.labelRight.classList.add("csContainer__labelRight");
  select.labelWrapper.append(select.labelRight);

  select.labelIcon.classList.add("csContainer__icon");
  select.labelIcon.setAttribute(
    "src",
    "https://img.icons8.com/ios-glyphs/90/ffffff/chevron-down.png"
  );
  select.labelRight.append(select.labelIcon);

  select.optionsCustomElement.classList.add("csContainer__options");
  select.options.forEach((option) => {
    const li = document.createElement("li");
    li.classList.add("csContainer__option");
    li.classList.toggle("selected", option.selected);
    li.innerText = option.label;
    li.dataset.value = option.value;
    li.setAttribute("name", option.name);
    select.optionsCustomElement.append(li);
    li.addEventListener("click", () => {
      select.selectValue(option.value);
      select.optionsCustomElement.classList.remove("show");
    });
  });
  select.customElement.append(select.optionsCustomElement);

  // events
  select.labelWrapper.addEventListener("click", () => {
    select.optionsCustomElement.classList.toggle("show");
  });

  select.customElement.addEventListener("blur", () => {
    select.optionsCustomElement.classList.remove("show");
  });

  // eslint-disable-next-line no-unused-vars
  let searchTerm = "";
  let debounceTimeout;
  select.customElement.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Space":
        select.optionsCustomElement.classList.toggle("show");
        break;

      case "ArrowUp":
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;

      case "ArrowDown":
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;

      case "Enter":
      case "Escape":
        select.optionsCustomElement.classList.remove("show");
        break;

      default: {
        clearTimeout(debounceTimeout);
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = "";
        }, 500);

        const searchOption = select.options.find((option) => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });

        if (searchOption) {
          select.selectValue(searchOption.value);
        }
        break;
      }
    }
  });
};

const getFormattedOptions = (optionElements) => {
  return [...optionElements].map((option) => {
    return {
      value: option.value,
      selected: option.selected,
      name: option.name,
      label: option.label,
      element: option,
    };
  });
};
