(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let taxToggle = document.getElementById("switchCheckDefault");
let taxInfo = document.getElementsByClassName("tax-info");
let prices = document.getElementsByClassName("price");

taxToggle.addEventListener("click", () => {
  const showTax = taxInfo[0].style.display !== "inline";

  for (let i = 0; i < prices.length; i++) {
    let priceElement = prices[i];
    let taxElement = taxInfo[i];
    let basePrice = parseInt(priceElement.getAttribute("data-price"));

    if (showTax) {
      taxElement.style.display = "inline";
      let withTax = Math.round(basePrice * 1.18);
      priceElement.innerText = `${withTax.toLocaleString("en-IN")}`;
    } else {
      taxElement.style.display = "none";
      priceElement.innerText = `${basePrice.toLocaleString("en-IN")}`;
    }
  }
});
