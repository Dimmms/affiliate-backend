
fetch("https://web-production-bf13b.up.railway.app/create-transaction", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name, email, phone, product_description, gross_amount
  })
})
