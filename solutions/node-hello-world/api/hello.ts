module.exports = async (req, res) => {
  const apiKey = 'UsFenY7QpHuDKyYG961seFUd8xwHFC8N';
  const listingId = '613014927246709169';
  const startDate = '2025-03-01';
  const endDate = '2025-12-31';
  try {
    const response = await fetch(`https://api.pricelabs.co/listings/${listingId}/pricing?start_date=${startDate}&end_date=${endDate}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
