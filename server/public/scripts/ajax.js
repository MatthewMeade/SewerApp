const post = (url, data) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = res => {
      if (xhr.status != 200) reject(xhr.status);
      else resolve(JSON.parse(xhr.responseText));
    };
    xhr.send(JSON.stringify(data));
  });
