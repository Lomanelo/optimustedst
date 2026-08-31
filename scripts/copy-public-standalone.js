/**
 * Firebase App Hosting's Next.js adapter skips copying public/ when a partial
 * public/ already exists in the standalone bundle (NFT tracing). Merge the
 * public tree into the standalone server dir once so images and
 * programs/index.json are actually served — without duplicating .next/static
 * (the adapter already copies that) which blew the image past Cloud Run's
 * import limit (~770MB vs ~106MB).
 */
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return { files: 0, bytes: 0 };
  fs.mkdirSync(dest, { recursive: true });
  let files = 0;
  let bytes = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      const inner = copyDir(from, to);
      files += inner.files;
      bytes += inner.bytes;
    } else {
      try {
        let buf = fs.readFileSync(from);
        if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
          buf = buf.subarray(3);
        }
        fs.writeFileSync(to, buf);
        files += 1;
        bytes += buf.length;
      } catch (err) {
        console.warn(`copy-public-standalone: skip ${from}: ${err.message}`);
      }
    }
  }
  return { files, bytes };
}

function isServerDir(dir) {
  return fs.existsSync(path.join(dir, 'server.js'));
}

const root = process.cwd();
const standaloneRoot = path.join(root, '.next', 'standalone');
if (!fs.existsSync(standaloneRoot)) {
  console.log('copy-public-standalone: no .next/standalone (skip)');
  process.exit(0);
}

let target = standaloneRoot;
if (!isServerDir(target)) {
  const nested = fs.readdirSync(standaloneRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(standaloneRoot, e.name))
    .find(isServerDir);
  if (nested) target = nested;
}

const publicSrc = path.join(root, 'public');
const result = copyDir(publicSrc, path.join(target, 'public'));
console.log(
  `copy-public-standalone: merged ${result.files} files (${(result.bytes / 1048576).toFixed(1)} MB) into ${path.relative(root, target)}`
);
