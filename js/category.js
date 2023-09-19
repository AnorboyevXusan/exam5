import request from "./main.js";
import { LIMIT } from "./const.js";

const categoriesRow = document.querySelector(".categories-row");
const searchInput = document.querySelector(".search-input");
const totalCategories = document.querySelector(".total-categories");
const pagination = document.querySelector(".pagination");
const categoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#category-modal");
const submitBtn = document.querySelector(
  ".category-form button[type='submit']"
);
const openModalBtn = document.querySelector(".open-modal-btn");

let search = "";
let activePage = 1;
let selected = null;

function getCategoryCard({ id, lastName, avatar , fristName, isMarried , email, groups , phoneNuber}) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card bg-danger-subtle">
        <img
          src="${avatar}"
          class="card-img-top object-fit-cover"
          height="300"
          alt="..."
        />
        <div class="card-body">
          <h4 class="card-title">${lastName} ${fristName}</h4>
          <a href="${email}">${email}</a>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
            isMarried${isMarried}
            </label>
            <p><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>:${ phoneNuber}</p>
            <p>N-${groups}</p>
          </div>
          <div>
            <button editId="${id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
            <button deleteId="${id}" class="btn btn-danger">Delete</button>
            <a href="product.html?categoryId=${id}" class="btn btn-primary">See products ${id}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function getCategories() {
  try {

    let params = { name: search };

    let { data } = await request.get("teacher", { params });

    params = { ...params, page: activePage, limit: LIMIT };

    let { data: dataPgtn } = await request.get("teacher", { params });

    let len = data.length;

    let pages = Math.ceil(len / LIMIT);

    pagination.innerHTML = `<li class="page-item ${
      activePage === 1 ? "disabled" : ""
    }"><button page="-" class="page-link">Previous</button></li>`;

    for (let page = 1; page <= pages; page++) {
      pagination.innerHTML += `<li class="page-item ${
        activePage === page ? "active" : ""
      }"><button page="${page}" class="page-link">${page}</button></li>`;
    }

    pagination.innerHTML += `<li class="page-item ${
      activePage === pages ? "disabled" : ""
    }"><button page="+" class="page-link">Next</button></li>`;

    totalCategories.textContent = len;
    categoriesRow.innerHTML = "";

    dataPgtn.map((category) => {
      categoriesRow.innerHTML += getCategoryCard(category);
    });
  } catch (err) {
    console.log(err.response.data);
  }
}

getCategories();

searchInput.addEventListener("keyup", function () {
  search = this.value;
  getCategories();
});

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page === "-") {
    activePage--;
  } else if (page === "+") {
    activePage++;
  } else {
    activePage = +page;
  }
  getCategories();
});

categoryForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    if (this.checkValidity()) {
      let category = {
        name: this.name.value,
        image: this.image.value,
      };
      if (selected === null) {
        await request.post("teacher", category);
      } else {
        await request.put(`teacher/${selected}`, category);
      }
      getCategories();
      bootstrap.Modal.getInstance(categoryModal).hide();
    } else {
      this.classList.add("was-validated");
    }
  } catch (err) {
    console.log(err);
  }
});

openModalBtn.addEventListener("click", function () {
  selected = null;
  submitBtn.textContent = "Add category";

  categoryForm.name.value = "";
  categoryForm.image.value = "";
});

categoriesRow.addEventListener("click", async function (e) {
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");

    if (editId) {
      selected = editId;
      submitBtn.textContent = "Save category";
      let { data } = await request.get(`teacher/${editId}`);
      categoryForm.name.value = data.name;
      categoryForm.image.value = data.image;
    }
    if (deleteId) {
      let deleteConfirm = confirm(
        "Are you sure you want to delete this category?"
      );
      if (deleteConfirm) {
        await request.delete(`teacher/${deleteId}`);
        getCategories();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
