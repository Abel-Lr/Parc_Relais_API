const getAPIJson = async () => {
  const url = process.env["API_URL"];
  const username = process.env["API_EMAIL"];
  const pwd = process.env["API_PWD"];

  const buffer = Buffer.from(`${username}:${pwd}`);
  const buffer64bits = buffer.toString("base64");
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${buffer64bits}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

module.exports = getAPIJson;
