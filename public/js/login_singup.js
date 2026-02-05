const usname = document.querySelector(".name");
const contact = document.querySelector(".contact");
const password = document.querySelector(".password");
const confirmPassword = document.querySelector(".confirmPassword");
const profilephoto = document.querySelector(".profilephoto");
const submitbtn = document.querySelector(".send");

contact.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
  }
});

function validateForm() {
  let isValid = true;


  [usname, contact, password, confirmPassword].forEach(input => {
    if (!input || !input.value.trim()) {
      isValid = false;
      if (input) input.classList.add("error");

      setTimeout(() => {
        if (input) input.classList.remove("error");
      }, 300);
    }

  });

  if (password.value != confirmPassword.value) {
    isValid = false;
    if (password) password.classList.add("error");
    if (confirmPassword) confirmPassword.classList.add("error");

    setTimeout(() => {
      if (password) password.classList.remove("error");
      if (confirmPassword) confirmPassword.classList.remove("error");
    }, 300);
  }




  if (!contact || !/^\d{10}$/.test(contact.value)) {
    isValid = false;
    if (contact) {
      contact.classList.add("error");
    }
  }






  return isValid;
}

submitbtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const data = {
    name: usname.value,
    contact: contact.value,
    password: password.value,
    profilephoto: '',
    confirmPassword: confirmPassword.value
  };

  try {
    const res = await fetch("/auth/singup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  

    const result = await res.json();
    console.log(result);

    if (!result.success) {
      if (result.field === "contact") {
        contact.classList.add("error");
      }

      if (result.field === "password") {
        password.classList.add("error");
        confirmPassword.classList.add("error");
      }

      alert(result.message);
      return;
    }

    window.location.href = "/";

  } catch (err) {
    console.error("Fetch error 👉", err);
  }
});
