type RULE_RESPONSE = 'block' | 'whitelist' | 'captcha'

export async function addIpRule(
  ip: string,
  rule_response: RULE_RESPONSE = 'block'
) {
  // TODO: Check if IP is valid.
  try {
    // Adding new Custom Rule
    const req = await fetch(
      `https://customer-api.datadome.co/1.0/protection/custom-rules?apikey=${process.env.DATADOME_MANAGEMENT_KEY}`,
      {
        method: 'POST',
        headers: { Accept: '*/*', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            rule_name: `ip_rule_${ip}`, // Needs to be unique
            query: `ip:${ip}`,
            rule_response: rule_response,
            rule_priority: 'high',
          },
        }),
      }
    )
    const response = await req.json()
    if (response.status !== 200) {
      throw new Error(JSON.stringify(response))
    }
    return response
  } catch (err: any) {
    console.log('Error', err)
    throw new Error(err)
  }
}

export async function removeRuleById(customRuleId: string) {
  try {
    const req = await fetch(
      `https://customer-api.datadome.co/1.0/protection/custom-rules/${customRuleId}?apikey=${process.env.DATADOME_MANAGEMENT_KEY}`,
      {
        method: 'DELETE',
        headers: { Accept: '*/*', 'Content-Type': 'application/json' },
      }
    )
    return req.json()
  } catch (err) {
    console.log('Error', err)
  }
}

export async function getAllRules() {
  try {
    const req = await fetch(
      `https://customer-api.datadome.co/1.0/protection/custom-rules?apikey=${process.env.DATADOME_MANAGEMENT_KEY}`,
      {
        method: 'GET',
        headers: { Accept: '*/*', 'Content-Type': 'application/json' },
      }
    )
    const {
      data: { custom_rules },
    } = await req.json()
    return custom_rules
  } catch (err) {
    console.log('Error', err)
  }
}
