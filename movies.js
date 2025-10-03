export default async function handler(req, res) {
  const apiKey = process.env.OMDB_API_KEY;
  const { search, id } = req.query;

  let url = "";
  if (search) url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${search}`;
  if (id) url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}
