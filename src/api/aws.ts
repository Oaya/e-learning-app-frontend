import axios from "axios";

export async function getPresignedUrl(file: File): Promise<{
  key: string;
  put_url: string;
}> {
  const token = localStorage.getItem("jwt");
  const url = `${import.meta.env.VITE_API_URL}/api/aws/presigned_url`;

  const res = await axios.post(
    url,
    {
      filename: file.name,
      content_type: file.type,
      byte_size: file.size,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  console.log("Presign thumbnail response:", res.data);

  return res.data;
}

// Upload directly to S3
export async function uploadToS3(putUrl: string, file: File) {
  await axios.put(putUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
}

export async function deleteS3Object(key: string): Promise<void> {
  const token = localStorage.getItem("jwt");
  const url = `${import.meta.env.VITE_API_URL}/api/aws/delete_object`;

  await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
    data: { key }, // axios sends body for DELETE this way
  });
}
