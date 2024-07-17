import axios from "axios";

const apiUrl = "http://localhost:3000/check-star";

async function testApi() {
  try {
    // Test GET with query parameter
    const res = await axios.get(`${apiUrl}/kenny-io`);
    console.log("GET with path parameter:", res.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

testApi();
