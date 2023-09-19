import request from "./main.js";

const query = new URLSearchParams(location.search);

const categoryId = query.get("categoryId");

async function getProducts() {
  try {
    let { data } = await request.get(`teacher/${teacherId}/student`);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

getProducts();
