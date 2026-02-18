export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) return new Response("No file uploaded", { status: 400 });

      await env.MY_BUCKET.put(file.name, file.stream(), {
        httpMetadata: { contentType: "audio/mpeg" },
      });

      return new Response(JSON.stringify({ message: "Uploaded!" }), {
        status: 200,
      });
    }

    if (url.pathname === "/api/list") {
      const files = [];
      for await (const obj of env.MY_BUCKET.list()) {
        files.push({ name: obj.key });
      }
      return new Response(JSON.stringify(files), { status: 200 });
    }

    if (url.pathname === "/api/download") {
      const fileName = url.searchParams.get("file");
      if (!fileName) return new Response("File not found", { status: 404 });

      const obj = await env.MY_BUCKET.get(fileName);
      if (!obj) return new Response("File not found", { status: 404 });

      return new Response(obj.body, {
        headers: { "Content-Type": "audio/mpeg" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};