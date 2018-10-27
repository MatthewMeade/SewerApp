const warningBox = $("#warningBox")[0];
const warningText = $("#warningBox span")[0];

const displayWarning = message => {
  warningBox.classList.add("active");
  warningText.innerHTML = message;
};

const loginButton = $("#loginButton")[0];
const passwordInput = $("#passwordInput")[0];

const submitHandler = e => {
  const pressed = e.keycode || e.which;

  if (pressed != 1 && pressed != 13) {
    return;
  }
  const password = passwordInput.value;
  if (!password) {
    return displayWarning("Enter a password");
  }
  axios
    .post("/users/login", { password })
    .then(res => {
      if (!res.data.token) {
        console.log(res);
        return displayWarning("Unknown Error");
      }

      const link = window.location.href.includes("#")
        ? "#" + window.location.href.split("#").pop()
        : "";
      window.location.href = "/" + link;
    })
    .catch(e => {
      displayWarning("Incorrect Password");
    });
};

loginButton.addEventListener("click", submitHandler);
passwordInput.addEventListener("keydown", submitHandler);
