# Security Documentation

## nth-check ReDoS Vulnerability

### Overview
A Regular Expression Denial of Service (ReDoS) vulnerability exists in the `nth-check` package (versions < 2.0.1). This can cause denial of service when parsing specially crafted invalid CSS `nth-check` expressions due to exponential backtracking in the regex pattern `\s*(?:([+-]?)\s*(\d+))?`.

### Impact Assessment
- **Severity**: High (CVSS score for ReDoS vulnerabilities)
- **Usage in Project**: `nth-check` is a transitive dependency of `svgo` (via `@svgr/webpack` in `react-scripts`). It is used during the build process for CSS selector parsing in SVG optimization.
- **Exploitability**: Low risk for this project. The vulnerability affects build-time processing of static assets, not runtime user input. An attacker would need to control SVG or CSS files in the build pipeline, which is unlikely in standard development/deployment.
- **Mitigation**: Updated to `nth-check@^2.1.1` via package.json overrides to ensure the patched version is used.

### Proof of Concept
Located in `docs/security/pocs/PoC.js`. Demonstrates the vulnerability in unpatched versions by timing parse operations on crafted inputs.

To run (requires Node.js and nth-check):
```bash
cd docs/security/pocs
npm install nth-check@1.0.0  # Install vulnerable version for demo
node PoC.js
```

Expected output in vulnerable versions shows exponential time growth (e.g., ~1ms, 2ms, 4ms, 8ms, ...). Note: Execution may take longer on slower systems; the PoC is optimized for practicality.

### Recommendations
- Keep dependencies updated to patched versions.
- Monitor for new security advisories in build tools.
- If processing user-supplied CSS/SVG, implement input validation and length limits.
- To verify nth-check version: Run `cd frontend && npm ls nth-check` (should show ^2.1.1).
- Track upstream dependencies (e.g., svgo, @svgr/webpack, react-scripts) for updates that include patched nth-check, allowing removal of the override.

### References
- [GitHub Advisory](https://github.com/advisories/GHSA-rp65-9cf3-cjxr)
- [nth-check Repository](https://github.com/fb55/nth-check)
