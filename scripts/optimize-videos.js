#!/usr/bin/env node
/**
 * Video Optimization Script
 * Analyzes video files and provides compression recommendations
 * Requires ffmpeg for actual compression
 */

const fs = require("fs");
const path = require("path");

const MEDIA_DIR = path.join(__dirname, "../public/media");

const VIDEO_TARGETS = [
  {
    path: "hero/banner_v.mp4",
    description: "Hero banner video (LCP candidate)",
    currentSize: 2.78, // MB
    recommendations: {
      bitrate: "1500k",
      resolution: "1280x720",
      codec: "libx264",
      preset: "slow",
      crf: 20,
    },
    estimatedSavings: "40-50%",
  },
  {
    path: "service/angular.mp4",
    description: "Angular service demo video",
    currentSize: 2.46,
    recommendations: {
      bitrate: "1800k",
      resolution: "1280x720",
      codec: "libx264",
      preset: "medium",
      crf: 22,
    },
    estimatedSavings: "35-45%",
  },
  {
    path: "service/react_application.mp4",
    description: "React/Next.js service demo",
    currentSize: 2.67,
    recommendations: {
      bitrate: "1800k",
      resolution: "1280x720",
      codec: "libx264",
      preset: "medium",
      crf: 22,
    },
    estimatedSavings: "35-45%",
  },
  {
    path: "service/performance.mp4",
    description: "Performance optimization demo",
    currentSize: 2.44,
    recommendations: {
      bitrate: "1500k",
      resolution: "1280x720",
      codec: "libx264",
      preset: "medium",
      crf: 22,
    },
    estimatedSavings: "35-45%",
  },
];

function analyzeVideos() {
  console.log("🎬 VIDEO OPTIMIZATION ANALYSIS");
  console.log("==============================\n");

  let totalCurrent = 0;
  let totalEstimatedOptimized = 0;

  console.log("📊 Video Files Found:\n");

  for (const video of VIDEO_TARGETS) {
    const fullPath = path.join(MEDIA_DIR, video.path);
    const exists = fs.existsSync(fullPath);
    const sizeStr = video.currentSize.toFixed(2);

    console.log(`📹 ${video.path}`);
    console.log(`   Description: ${video.description}`);
    console.log(`   Current Size: ${sizeStr} MB`);
    console.log(`   Est. Savings: ${video.estimatedSavings}`);
    console.log(`   Status: ${exists ? "✓ Found" : "✗ Not found"}`);

    if (exists) {
      totalCurrent += video.currentSize;
      const avgSavings = parseInt(video.estimatedSavings.split("-")[1]) / 100;
      totalEstimatedOptimized += video.currentSize * (1 - avgSavings);
    }

    console.log(`\n   Recommended Compression:\n`);
    const rec = video.recommendations;
    console.log(`   ffmpeg -i "${video.path}" \\`);
    console.log(`     -c:v ${rec.codec} \\`);
    console.log(`     -preset ${rec.preset} \\`);
    console.log(`     -b:v ${rec.bitrate} \\`);
    console.log(`     -crf ${rec.crf} \\`);
    console.log(`     -vf "scale=${rec.resolution}" \\`);
    console.log(`     -c:a aac -b:a 128k \\`);
    console.log(`     "output-compressed.mp4"\n`);
  }

  console.log("\n📊 COMPRESSION SUMMARY");
  console.log("======================");
  console.log(`Total Current Video Size: ${totalCurrent.toFixed(2)} MB`);
  console.log(
    `Estimated After Compression: ${totalEstimatedOptimized.toFixed(2)} MB`
  );
  console.log(
    `Estimated Savings: ${((1 - totalEstimatedOptimized / totalCurrent) * 100).toFixed(1)}%`
  );

  console.log("\n💡 RECOMMENDATIONS");
  console.log("==================");
  console.log("1. Install ffmpeg:");
  console.log("   Windows (Chocolatey): choco install ffmpeg");
  console.log("   macOS (Homebrew): brew install ffmpeg");
  console.log("   Linux: sudo apt-get install ffmpeg\n");

  console.log("2. Batch compress all videos:");
  console.log("   node scripts/batch-compress-videos.js\n");

  console.log("3. Test compressed videos for quality:");
  console.log("   - Verify sharpness and clarity");
  console.log("   - Check motion smoothness");
  console.log("   - Test across browsers\n");

  console.log("4. Replace originals once verified:");
  console.log("   - Backup originals first");
  console.log("   - Update video references if needed\n");

  console.log("⏱️  ESTIMATED COMPRESSION TIME");
  console.log("============================");
  console.log("Total videos: " + VIDEO_TARGETS.length);
  console.log("Est. time per video: 5-10 minutes (depends on source)");
  console.log("Total est. time: 20-40 minutes\n");

  console.log("✨ Additional Benefits of Video Compression:");
  console.log("- Faster video delivery worldwide");
  console.log("- Reduced bandwidth costs");
  console.log("- Better mobile experience");
  console.log("- Faster page load times");
  console.log("- Lower hosting costs");
}

analyzeVideos();
