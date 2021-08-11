exports.handleError = (e) => {
  const toHandle = e.target;
  toHandle.classList.remove("error");

  toHandle.classList.add("error");
};
