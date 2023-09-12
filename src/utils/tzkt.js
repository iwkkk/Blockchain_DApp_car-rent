import axios from "axios";

export const fetchStorage = async () => {
  const res = await axios.get(
    "https://api.ghostnet.tzkt.io/v1/contracts/KT1UCGH6tR18iaQfQWoJPxjo2x8cTTuULQPG/storage"
  );
  return res.data;
};
