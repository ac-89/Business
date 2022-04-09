const form = document.getElementById("contact-form");

const formEvent = form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mail = new FormData(form);
  sendMail(mail);
});

const sendMail = (mail) => {
  fetch("/send", {
    method: "post",
    body: mail,
  }).then((response) => {
    return response.json();
  });
};
