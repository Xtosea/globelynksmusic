export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

    // ================= CORS PREFLIGHT =================
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    // ================= STATIC FILES =================
    if (
      request.method === "GET" &&
      (
        url.pathname === "/" ||
        url.pathname === "/index.html" ||
        url.pathname === "/styles.css" ||
        url.pathname.startsWith("/images/") ||
        url.pathname.startsWith("/music/")
      )
    ) {
      const key = url.pathname === "/" ? "index.html" : url.pathname.slice(1)

      const object = await env.R2_BUCKET.get(key)
      if (!object) {
        return new Response("File not found", { status: 404 })
      }

      return new Response(object.body, {
        headers: {
          "Content-Type": getContentType(key),
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders,
        },
      })
    }

    // ================= LIST SONGS =================
    if (url.pathname === "/api/list") {
      const listed = await env.R2_BUCKET.list({ prefix: "meta/" })
      const files = []

      for (const obj of listed.objects) {
        const data = await env.R2_BUCKET.get(obj.key)
        if (data) {
          const meta = JSON.parse(await data.text())

          // Ensure defaults (for old songs)
          meta.likes = meta.likes || 0
          meta.views = meta.views || 0

          files.push(meta)
        }
      }

      return new Response(JSON.stringify(files), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // ================= UPLOAD =================
    if (url.pathname === "/api/upload" && request.method === "POST") {
      const formData = await request.formData()

      const file = formData.get("file")
      const image = formData.get("image")
      const artist = formData.get("artist")
      const title = formData.get("title")

      if (!file || !artist || !title) {
        return new Response("Missing fields", { status: 400 })
      }

      const id = Date.now()

      await env.R2_BUCKET.put(`music/${id}.mp3`, file.stream())
      if (image) {
        await env.R2_BUCKET.put(`images/${id}.jpg`, image.stream())
      }

      await env.R2_BUCKET.put(
        `meta/${id}.json`,
        JSON.stringify({
          id,
          artist,
          title,
          file: `music/${id}.mp3`,
          image: image ? `images/${id}.jpg` : "",
          downloads: 0,
          likes: 0,      // ✅ NEW
          views: 0       // ✅ NEW
        })
      )

      return new Response(JSON.stringify({ message: "Uploaded" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // ================= DOWNLOAD COUNT =================
    if (url.pathname === "/api/count") {
      const file = url.searchParams.get("file")
      if (!file) return new Response("Invalid file", { status: 400 })

      const id = file.split("/")[1]?.replace(".mp3", "")
      const metaObj = await env.R2_BUCKET.get(`meta/${id}.json`)
      if (!metaObj) return new Response("Metadata not found", { status: 404 })

      const meta = JSON.parse(await metaObj.text())
      meta.downloads = (meta.downloads || 0) + 1

      await env.R2_BUCKET.put(`meta/${id}.json`, JSON.stringify(meta))

      return new Response("Counted", { headers: corsHeaders })
    }

    // ================= LIKE =================
    if (url.pathname === "/api/like" && request.method === "POST") {
      const id = url.searchParams.get("id")
      if (!id) return new Response("Missing ID", { status: 400 })

      const metaObj = await env.R2_BUCKET.get(`meta/${id}.json`)
      if (!metaObj) return new Response("Song not found", { status: 404 })

      const meta = JSON.parse(await metaObj.text())
      meta.likes = (meta.likes || 0) + 1

      await env.R2_BUCKET.put(`meta/${id}.json`, JSON.stringify(meta))

      return new Response(JSON.stringify({ likes: meta.likes }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // ================= VIEW =================
    if (url.pathname === "/api/view" && request.method === "POST") {
      const id = url.searchParams.get("id")
      if (!id) return new Response("Missing ID", { status: 400 })

      const metaObj = await env.R2_BUCKET.get(`meta/${id}.json`)
      if (!metaObj) return new Response("Song not found", { status: 404 })

      const meta = JSON.parse(await metaObj.text())
      meta.views = (meta.views || 0) + 1

      await env.R2_BUCKET.put(`meta/${id}.json`, JSON.stringify(meta))

      return new Response(JSON.stringify({ views: meta.views }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    // ================= DOWNLOAD / IMAGE =================
    if (
      url.pathname.startsWith("/api/download") ||
      url.pathname.startsWith("/api/image")
    ) {
      const file = url.searchParams.get("file")
      if (!file) return new Response("File not found", { status: 404 })

      const obj = await env.R2_BUCKET.get(file)
      if (!obj) return new Response("File not found", { status: 404 })

      return new Response(obj.body, {
        headers: {
          "Content-Type": getContentType(file),
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders,
        },
      })
    }

    return new Response("Not found", { status: 404 })
  },
}

// ================= CONTENT TYPE HELPER =================
function getContentType(file) {
  const ext = file.split(".").pop().toLowerCase()

  switch (ext) {
    case "html": return "text/html; charset=UTF-8"
    case "css": return "text/css"
    case "js": return "application/javascript"
    case "jpg":
    case "jpeg": return "image/jpeg"
    case "png": return "image/png"
    case "mp3": return "audio/mpeg"
    case "json": return "application/json"
    default: return "application/octet-stream"
  }
}