import dotenv from "dotenv";
dotenv.config();

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

export async function generateMap(latitude: number, longitude: number) {
  const zoomLevel = 6; // Уровень масштабирования для отображения области 1000x1000 км
  const size256 = 256;
  const size1024 = 1280;

  const url256 =
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${longitude},${latitude},${zoomLevel}/${size256}x${size256}?access_token=${MAPBOX_API_KEY}`;
  const url1024 =
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${longitude},${latitude},${zoomLevel}/${size1024}x${size1024}?access_token=${MAPBOX_API_KEY}`;

  const [base64_256, base64_1024] = await Promise.all([
    fetchImageAsBase64(url256),
    fetchImageAsBase64(url1024),
  ]);

  return {
    map256: base64_256,
    map1024: base64_1024,
  };
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);

  const buffer = await response.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
}
