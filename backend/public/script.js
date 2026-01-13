const API_URL = "http://localhost:1010";

// ================= HELPER =================
function $(id) {
    return document.getElementById(id);
}

// ================= RENDER =================
function renderItems(data) {
    const tbody = $("items");
    tbody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="cell-wrap">${item.name}</div>
            </td>
            <td>
                <div class="cell-wrap">${item.qty}</div>
            </td>
            <td>
                <div class="cell-wrap">
                    <button onclick="editItem(${item.id}, '${item.name}', ${item.qty})">Edit</button>
                    <button onclick="deleteItem(${item.id})">Hapus</button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// ================= LOAD / SEARCH =================
async function loadItems(keyword = "") {
    const url = keyword
        ? `${API_URL}/items?search=${encodeURIComponent(keyword)}`
        : `${API_URL}/items`;

    const res = await fetch(url);
    const data = await res.json();
    renderItems(data);
}

// ================= ADD =================
async function addItem() {
    const name = $("name").value.trim();
    const qty = parseInt($("qty").value);

    if (!name || isNaN(qty)) {
        alert("Isi nama dan jumlah");
        return;
    }

    await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, qty })
    });

    $("name").value = "";
    $("qty").value = "";

    loadItems();
}

// ================= DELETE =================
async function deleteItem(id) {
    await fetch(`${API_URL}/items/${id}`, {
        method: "DELETE"
    });
    loadItems();
}

// ================= EDIT =================
async function editItem(id, oldName, oldQty) {
    const name = prompt("Nama barang:", oldName);
    if (name === null) return;

    const qty = prompt("Jumlah:", oldQty);
    if (qty === null) return;

    await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, qty: parseInt(qty) })
    });

    loadItems();
}

// ================= SEARCH =================
function searchItems() {
    const keyword = $("search").value.trim();
    loadItems(keyword);
}

// ================= START =================
document.addEventListener("DOMContentLoaded", () => {
    loadItems();
});
