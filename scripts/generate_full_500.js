import fs from 'fs';

// Helper to sanitize tool objects
function createTool(id, name, category, desc, func, status, cc, browser, lowend, warnet, vps, apikey, oss, github, site, pros, cons, usecase, difficulty, money, score, verify = true) {
  return {
    id: id.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
    name,
    category,
    desc,
    func,
    status,
    cc: Boolean(cc),
    browser: Boolean(browser),
    lowend: Boolean(lowend),
    warnet: warnet,
    vps: Boolean(vps),
    apikey: Boolean(apikey),
    oss: Boolean(oss),
    github: github || '',
    site: site || '',
    pros,
    cons,
    usecase,
    difficulty,
    money,
    score: Number(score.toFixed(1)),
    verify: Boolean(verify)
  };
}

console.log("Script template ready.");
