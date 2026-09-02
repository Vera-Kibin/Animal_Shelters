export async function recordConsent(req, res, next) {
  try {
    const consent = {
      id: `consent-${Date.now()}`,
      user_id: req.body.user_id,
      consent_type: req.body.consent_type,
      granted: req.body.granted,
      recordedAt: new Date().toISOString(),
    };

    res.status(201).json({ success: true, data: consent });
  } catch (err) {
    next(err);
  }
}
