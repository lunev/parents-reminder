import extract from "extract-zip";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const unzipPrev = async () => {
  const buildDir = path.resolve(__dirname, "..", "build");
  const releaseDir = path.resolve(__dirname, "..", "release");

  if (!fs.existsSync(releaseDir)) {
    console.error("❌ Folder 'release' not found.");
    return;
  }

  const files = fs
    .readdirSync(releaseDir)
    .filter((f) => f.endsWith(".zip"))
    .map((f) => ({
      name: f,
      path: path.join(releaseDir, f),
      time: fs.statSync(path.join(releaseDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error("❌ No ZIP files found in 'release' folder.");
    return;
  }

  const latestZip = files[0].path;
  console.log(`📦 Unzipping: ${files[0].name}...`);

  try {
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }

    await extract(latestZip, { dir: buildDir });

    console.log("✅ Success! Previous version is now in /build.");
    console.log("👉 Go to chrome://extensions and click 'Refresh'.");
  } catch (err) {
    console.error("❌ Extraction failed:", err);
  }
};

unzipPrev();
