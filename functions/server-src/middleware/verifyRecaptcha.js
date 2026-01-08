const fetch = global.fetch || require('node-fetch');

module.exports = async function verifyRecaptcha(req, res, next) {
  try {
    const token = req.body?.recaptchaToken || req.headers['x-recaptcha-token'] || req.query.recaptchaToken;
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return res.status(400).json({ message: 'Recaptcha not configured' });
    if (!token) return res.status(400).json({ message: 'Recaptcha token missing' });

    const resp = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await resp.json();
    if (!data.success) return res.status(403).json({ message: 'Recaptcha verification failed' });

    // optional: check score for v3
    req.recaptcha = data;
    next();
  } catch (err) {
    next(err);
  }
};
