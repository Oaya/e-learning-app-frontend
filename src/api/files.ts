import axios from "axios";

// Active Storage requires a Base64 checksum (Content-MD5-ish).
async function checksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hashBuffer);
  return btoa(String.fromCharCode(...bytes));
}

export async function directUploadToActiveStorage(file: File): Promise<string> {
  const token = localStorage.getItem("jwt");
  const url = `${import.meta.env.VITE_API_URL}/rails/active_storage/direct_uploads`;

  // Step 1: Get the direct upload URL and headers from the backend
  const response = await axios.post(
    url,
    {
      blob: {
        filename: file.name,
        content_type: file.type,
        byte_size: checksum(file),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("Direct upload response:", response);

  //Step 2: Upload the file directly to the storage service
  await axios.put(response.data.direct_upload.url, file, {
    headers: response.data.direct_upload.headers,
  });

  //return the blob signed ID to be used in the backend
  return response.data.signed_id;
}
