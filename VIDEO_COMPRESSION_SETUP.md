# Video Compression Setup Guide

## Quick Start

### Option 1: Windows (Recommended - Easiest)

**Step 1: Install FFmpeg via Chocolatey**
```powershell
# If you have Chocolatey installed:
choco install ffmpeg

# Verify installation:
ffmpeg -version
```

**If you don't have Chocolatey:**
```powershell
# Install Chocolatey first:
Set-ExecutionPolicy Bypass -Scope Process -Force; `
  [System.Net.ServicePointManager]::SecurityProtocol = `
  [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install FFmpeg:
choco install ffmpeg
```

**Alternative: Windows Package Manager**
```powershell
winget install ffmpeg
```

---

### Option 2: macOS

**Using Homebrew (Recommended):**
```bash
brew install ffmpeg
```

**Verify:**
```bash
ffmpeg -version
```

---

### Option 3: Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install ffmpeg

# Verify:
ffmpeg -version
```

---

## Video Compression Commands

**After FFmpeg is installed, run these commands** from the project root:

### 1. Hero Banner Video (Highest Quality)
```powershell
ffmpeg -i public/media/hero/banner_v.mp4 `
  -c:v libx264 -preset slow -b:v 1500k -crf 20 `
  -vf "scale=1280:720" -c:a aac -b:a 128k `
  public/media/hero/banner_v-new.mp4
```

**Expected:**
- Current: 2.78 MB
- After: ~1.4-1.7 MB
- Time: 3-5 minutes

---

### 2. Angular Service Demo
```powershell
ffmpeg -i public/media/service/angular.mp4 `
  -c:v libx264 -preset medium -b:v 1800k -crf 22 `
  -vf "scale=1280:720" -c:a aac -b:a 128k `
  public/media/service/angular-new.mp4
```

**Expected:**
- Current: 2.46 MB
- After: ~1.4-1.6 MB
- Time: 2-3 minutes

---

### 3. React Service Demo
```powershell
ffmpeg -i public/media/service/react_application.mp4 `
  -c:v libx264 -preset medium -b:v 1800k -crf 22 `
  -vf "scale=1280:720" -c:a aac -b:a 128k `
  public/media/service/react_application-new.mp4
```

**Expected:**
- Current: 2.67 MB
- After: ~1.5-1.7 MB
- Time: 3-4 minutes

---

### 4. Performance Service Demo
```powershell
ffmpeg -i public/media/service/performance.mp4 `
  -c:v libx264 -preset medium -b:v 1500k -crf 22 `
  -vf "scale=1280:720" -c:a aac -b:a 128k `
  public/media/service/performance-new.mp4
```

**Expected:**
- Current: 2.44 MB
- After: ~1.4-1.6 MB
- Time: 2-3 minutes

---

### Batch Compression Script (PowerShell)

Save as `compress-videos.ps1`:

```powershell
# Video compression batch script
$videos = @(
    @{
        input  = 'public/media/hero/banner_v.mp4'
        output = 'public/media/hero/banner_v-new.mp4'
        bitrate = '1500k'
        preset = 'slow'
        crf = '20'
    },
    @{
        input  = 'public/media/service/angular.mp4'
        output = 'public/media/service/angular-new.mp4'
        bitrate = '1800k'
        preset = 'medium'
        crf = '22'
    },
    @{
        input  = 'public/media/service/react_application.mp4'
        output = 'public/media/service/react_application-new.mp4'
        bitrate = '1800k'
        preset = 'medium'
        crf = '22'
    },
    @{
        input  = 'public/media/service/performance.mp4'
        output = 'public/media/service/performance-new.mp4'
        bitrate = '1500k'
        preset = 'medium'
        crf = '22'
    }
)

foreach ($video in $videos) {
    Write-Host "Compressing: $($video.input)"
    Write-Host "Output: $($video.output)"
    
    ffmpeg -i $video.input `
        -c:v libx264 `
        -preset $video.preset `
        -b:v $video.bitrate `
        -crf $video.crf `
        -vf "scale=1280:720" `
        -c:a aac `
        -b:a 128k `
        $video.output
    
    Write-Host "✓ Complete`n"
}

Write-Host "All videos compressed!"
```

**Run it:**
```powershell
.\compress-videos.ps1
```

---

## Post-Compression Steps

### 1. Verify Quality
- Play each `-new.mp4` file
- Check video sharpness and clarity
- Verify audio is acceptable
- Test in Chrome, Firefox, Safari

### 2. Backup Originals (Optional but Recommended)
```powershell
# Create backup folder
mkdir public/media/originals -ErrorAction SilentlyContinue

# Move originals
Move-Item public/media/hero/banner_v.mp4 public/media/originals/
Move-Item public/media/service/angular.mp4 public/media/originals/
Move-Item public/media/service/react_application.mp4 public/media/originals/
Move-Item public/media/service/performance.mp4 public/media/originals/
```

### 3. Replace With Compressed Versions
```powershell
# Rename compressed files (remove -new suffix)
Rename-Item public/media/hero/banner_v-new.mp4 -NewName banner_v.mp4
Rename-Item public/media/service/angular-new.mp4 -NewName angular.mp4
Rename-Item public/media/service/react_application-new.mp4 -NewName react_application.mp4
Rename-Item public/media/service/performance-new.mp4 -NewName performance.mp4
```

### 4. Verify Production Build
```powershell
npm run build
# Should complete successfully with no errors
```

### 5. Test Videos
- Test hero video on homepage
- Test service videos on services page
- Check mobile playback
- Verify no quality degradation

---

## Expected Results

| Video | Before | After | Savings |
|-------|--------|-------|---------|
| hero/banner_v.mp4 | 2.78 MB | 1.5 MB | 46% |
| service/angular.mp4 | 2.46 MB | 1.5 MB | 39% |
| service/react_application.mp4 | 2.67 MB | 1.6 MB | 40% |
| service/performance.mp4 | 2.44 MB | 1.5 MB | 39% |
| **TOTAL** | **10.35 MB** | **5.6 MB** | **46.3%** |

---

## Compression Parameters Explained

- **-c:v libx264**: Video codec (H.264, widely compatible)
- **-preset slow**: Encoding speed (slow = better compression, slower)
- **-preset medium**: Medium speed (balance of quality and time)
- **-b:v 1500k**: Video bitrate (1500 kbps = good quality at 720p)
- **-crf 20-22**: Quality (0=lossless, 51=worst; 20=high, 22=good)
- **-vf "scale=1280:720"**: Resolution (1280x720 = standard HD)
- **-c:a aac**: Audio codec (AAC, widely compatible)
- **-b:a 128k**: Audio bitrate (128 kbps = good quality)

---

## Troubleshooting

### FFmpeg not found after installation
```powershell
# Restart PowerShell or terminal
# Then verify:
ffmpeg -version
```

### Video quality issues
- Lower the crf value (20 is higher quality than 22)
- Increase bitrate (e.g., 2000k instead of 1500k)
- Test different preset values

### Compression taking too long
- Use `-preset fast` instead of `-preset slow`
- Or let it run in background (usually 2-5 minutes per video)

### Audio missing in output
- Verify original video has audio: `ffmpeg -i input.mp4`
- Check that `-c:a aac` is specified
- Try `-c:a libfdk_aac` if system supports it

---

## Next Steps After Compression

1. ✅ Install ffmpeg
2. ✅ Run compression commands
3. ✅ Verify video quality
4. ✅ Replace original files
5. ✅ Test in production build
6. ✅ Commit compressed videos to git
7. ✅ Deploy to production

---

## Additional Resources

- [FFmpeg Official](https://ffmpeg.org/)
- [FFmpeg Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264)
- [H.264 Quality Settings](https://trac.ffmpeg.org/wiki/Encode/H.264#a2-lossless)

---

**Estimated Total Time**: 15-30 minutes (including installation)  
**Estimated Savings**: 4.8 MB (46.3% reduction)  
**Quality Impact**: Minimal (imperceptible quality loss at 720p)

