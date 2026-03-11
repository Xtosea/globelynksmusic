#!/bin/bash

# ==========================
# CONFIG
# ==========================
BUCKET="mp3-storage"
BUILD_DIR="frontend/build"

echo "🚀 Starting deployment to R2 bucket: $BUCKET"
cd $BUILD_DIR || { echo "Build folder not found! Run 'npm run build' first."; exit 1; }

# ==========================
# Upload index.html
# ==========================
echo "📄 Uploading index.html..."
wrangler r2 object put $BUCKET/index.html --file index.html --content-type text/html --remote

# ==========================
# Upload CSS
# ==========================
for cssfile in static/css/*.css; do
    echo "🎨 Uploading $cssfile ..."
    wrangler r2 object put $BUCKET/$cssfile --file $cssfile --content-type text/css --remote
done

# ==========================
# Upload JS
# ==========================
for jsfile in static/js/*.js; do
    echo "📝 Uploading $jsfile ..."
    wrangler r2 object put $BUCKET/$jsfile --file $jsfile --content-type application/javascript --remote
done

# ==========================
# Upload Media (images, mp3)
# ==========================
for mediafile in static/media/*; do
    mime=$(file --mime-type -b $mediafile)
    echo "🖼️ Uploading $mediafile with MIME $mime ..."
    wrangler r2 object put $BUCKET/$mediafile --file $mediafile --content-type $mime --remote
done

echo "✅ Deployment complete! Your Worker should now serve all frontend assets."