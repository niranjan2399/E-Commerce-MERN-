exports.formHide = (ref1, ref2) => {
  document.body.style.overflowY = "auto";
  ref1.current.classList.add("hide");
  ref2.current.classList.add("hide");

  setTimeout(() => {
    ref1.current.classList.remove("reveal", "hide");
    ref2.current.classList.remove("reveal", "hide");
  }, 1500);
};
