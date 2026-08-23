#!/usr/bin/env node
/**
 * Media Optimization Script
 *
 * Converts PNG images to WebP/AVIF format for optimal performance
 * Usage: node scripts/optimize-media.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MEDIA_DIR = path.join(__dirname, "../public/media");
const QUALITY_PRESETS = {
  high: { quality: 85, effort: 6 },
  medium: { quality: 80, effort: 5 },
  light: { quality: 75, effort: 4 },
};

/**
 * Optimization Targets
 * Format: { inputPath, formats: ['webp', 'avif'], quality: 'high'|'medium'|'light' }
 */
const OPTIMIZATION_TARGETS = [
  // Service images (1.5-1.8 MB each - convert to WebP/AVIF)
  { input: "service/service_1.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_2.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_3.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_4.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_5.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_6.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/service_7.png", formats: ["webp", "avif"], quality: "high" },

  // Large banners and misc images
  { input: "service/hero.png", formats: ["webp", "avif"], quality: "high" },
  { input: "service/banner.png", formats: ["webp", "avif"], quality: "high" },
  { input: "experience/banner_img.png", formats: ["webp", "avif"], quality: "medium" },
  { input: "skills/1.png", formats: ["webp", "avif"], quality: "medium" },

  // Project images
  { input: "fiji_external_application/image1.png", formats: ["webp"], quality: "high" },
  { input: "vnpf_mobile/composite-thumb.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/1.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/2.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/3.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/4.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/5.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/6.png", formats: ["webp"], quality: "high" },
  { input: "galaxy-sofas/7.png", formats: ["webp"], quality: "high" },

  // FlatLay - convert JPG to WebP
  { input: "working/projects-flatlay.jpg", formats: ["webp"], quality: "high" },
];

/**
 * Optimizes an image to multiple formats
 */
async function optimizeImage(inputPath, formats, qualityPreset) {
  const fullInputPath = path.join(MEDIA_DIR, inputPath);
  const inputExt = path.extname(inputPath);
  const inputBaseName = path.basename(inputPath, inputExt);
  const inputDir = path.dirname(inputPath);

  if (!fs.existsSync(fullInputPath)) {
    console.warn(`⚠️  Input not found: ${fullInputPath}`);
    return { success: false, file: inputPath, reason: "not found" };
  }

  const inputStats = fs.statSync(fullInputPath);
  const originalSize = inputStats.size;
  const preset = QUALITY_PRESETS[qualityPreset] || QUALITY_PRESETS.high;

  const results = {
    file: inputPath,
    originalSize,
    success: true,
    outputs: [],
  };

  try {
    const image = sharp(fullInputPath);
    const metadata = await image.metadata();

    for (const format of formats) {
      try {
        const outputFilename = `${inputBaseName}.${format}`;
        const outputPath = path.join(MEDIA_DIR, inputDir, outputFilename);

        let pipeline = image.clone();

        // Apply format-specific optimization
        if (format === "webp") {
          pipeline = pipeline.webp({ quality: preset.quality, effort: preset.effort });
        } else if (format === "avif") {
          pipeline = pipeline.avif({ quality: preset.quality, effort: preset.effort });
        }

        const buffer = await pipeline.toBuffer();
        fs.writeFileSync(outputPath, buffer);

        const fileStats = fs.statSync(outputPath);
        const newSize = fileStats.size;
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

        results.outputs.push({
          format,
          size: newSize,
          savings: `${savings}%`,
          path: path.relative(MEDIA_DIR, outputPath),
        });

        console.log(`  ✓ ${format.toUpperCase()}: ${(newSize / 1024).toFixed(2)} KB (${savings}% savings)`);
      } catch (err) {
        console.error(`  ✗ ${format.toUpperCase()} failed: ${err.message}`);
        results.outputs.push({ format, error: err.message });
      }
    }
  } catch (err) {
    console.error(`✗ Failed to process ${inputPath}: ${err.message}`);
    results.success = false;
    results.error = err.message;
  }

  return results;
}

/**
 * Main optimization process
 */
async function main() {
  console.log("🖼️  MEDIA OPTIMIZATION SCRIPT");
  console.log("============================\n");

  let totalOriginal = 0;
  let totalOptimized = 0;
  const allResults = [];

  for (const target of OPTIMIZATION_TARGETS) {
    console.log(`📦 Processing: ${target.input}`);
    const result = await optimizeImage(target.input, target.formats, target.quality);

    if (result.success) {
      totalOriginal += result.originalSize;
      result.outputs.forEach((output) => {
        if (output.size) {
          totalOptimized += output.size;
        }
      });
      allResults.push(result);
    }
  }

  // Summary
  console.log("\n📊 OPTIMIZATION SUMMARY");
  console.log("=======================");
  console.log(`Original Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized Total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);

  const overallSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  console.log(`Total Savings: ${overallSavings}%`);

  console.log("\n✅ Media optimization complete!");
  console.log("\n📝 Next Steps:");
  console.log("1. Update image references in content files to use .webp versions");
  console.log("2. Use Next.js Image component with multiple formats via next/image");
  console.log("3. Update services.ts to reference optimized poster images");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
