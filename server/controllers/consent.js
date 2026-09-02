const consents = [];

export async function recordConsent(req, res, next) {
  try {
    const consent = {
      id: `consent-${Date.now()}`,
      user_id: req.user.id,
      consent_type: req.body.consent_type,
      granted: req.body.granted,
      recordedAt: new Date().toISOString(),
    };

    consents.push(consent);
    res.status(201).json({ success: true, data: consent });
  } catch (err) {
    next(err);
  }
}
