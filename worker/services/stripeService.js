export async function createPremiumSession(env, userId) {
  const stripeKey = env.STRIPE_SECRET;
  
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      mode: "payment",
      success_url: "https://globelynksmusic.com/success",
      cancel_url: "https://globelynksmusic.com/cancel",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": "Globelynks Premium",
      "line_items[0][price_data][unit_amount]": "500",
      "line_items[0][quantity]": "1"
    })
  });

  return await response.json();
}