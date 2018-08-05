const $ = s => {
  const e = [...document.querySelectorAll(s)];
  return e.length > 1 ? e : e[0];
};

const warningBox = $("#warningBox");
const warningText = $("#warningBox span");

const displayWarning = message => {
  warningBox.classList.add("active");
  warningText.innerHTML = message;
};

const loginButton = $("#loginButton");
const passwordInput = $("#passwordInput");

loginButton.addEventListener("click", e => {
  const password = passwordInput.value;

  if (!password) {
    return displayWarning("Enter a password");
  }

  post("/users/login", { password })
    .then(res => {
      if (!res.token) {
        return displayWarning("Unknown Error");
      }

      window.location.href = "/";
    })
    .catch(e => {
      displayWarning("Incorrect Password");
    });
});
