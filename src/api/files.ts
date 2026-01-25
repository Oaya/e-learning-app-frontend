import axios from "axios";
import SparkMD5 from "spark-md5";

async function md5Base64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const raw = SparkMD5.ArrayBuffer.hash(buffer, true); // raw binary string
  return btoa(raw); // base64
}

export async function directUploadToActiveStorage(
  file: File,
  kind: string,
): Promise<string> {
  const token = localStorage.getItem("jwt");
  const url = `${import.meta.env.VITE_API_URL}/api/rails/active_storage/direct_uploads`;

  // Step 1: Get the direct upload URL and headers from the backend
  const response = await axios.post(
    url,
    {
      filename: file.name,
      content_type: file.type,
      byte_size: file.size,
      checksum: await md5Base64(file),
      kind,
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
