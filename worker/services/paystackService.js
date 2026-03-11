export const paystackService = {

  async createPremiumSession(userId, env) {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "xto1971@gmail.com",
        amount: 500000, // ₦5000 (kobo)
        callback_url: `${env.SITE_URL}/api/payment-success?type=premium&userId=${userId}`
      })
    });

    return res;
  },

  async createVerifySession(userId, env) {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "customer@email.com",
        amount: 1000000, // ₦10000
        callback_url: `${env.SITE_URL}/api/payment-success?type=verify&userId=${userId}`
      })
    });

    return res;
  }
};