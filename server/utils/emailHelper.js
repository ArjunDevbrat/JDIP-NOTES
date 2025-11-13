const dns = require('dns').promises;

function isGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
}

async function hasMXRecord(domain) {
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch (e) {
    return false;
  }
}

module.exports = { isGmail, hasMXRecord };
