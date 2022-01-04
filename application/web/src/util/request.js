/**
 * request
 *
 * Localized function to fetch data from a (fake/real) backend api
 */
export const request = (url, { mock, ...options } = {}) => {
  // Collects the host depending on environment variables
  const host = process.env[`REACT_APP_API_HOST`] || "http://localhost:5000/api";

  // Printing the aspects of the request
  console.log("Req: " + url);
  console.log("Method: " + options.method);
  console.log("Fetch: " + host + url);
  console.log("Mock: " + mock);

  // Turn this on to see the request details
  const method = options.method ? options.method : "GET";
  //alert(`${method}: ${host}${url} + \n ${JSON.stringify(options)}`);

  // Fetches the request
  return fetch(`${host}${url}`, { ...options, credentials: "include" }).then(
    (data) => {
      // Turn this on when you want to see the received data
      // alert(JSON.stringify(data))

      // Returns the data in JSON form
      return data.json();
    }
  );
};
