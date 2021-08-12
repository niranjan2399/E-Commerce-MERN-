exports.formHide = (ref1, ref2) => {
  ref1.current.classList.add("hide");
  ref2.current.classList.add("hide");

  setTimeout(() => {
    ref1.current.classList.remove("reveal", "hide");
    ref2.current.classList.remove("reveal", "hide");
  }, 1500);
};
