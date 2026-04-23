//valittu asiakasid on tyhjä
let selectedCustomerId = null;
//DOM puu
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#customer-form form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // estää sivun uudelleenlatauksen

    // Kerää lomakkeen tiedot
    const newCustomer = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      birth_date: document.getElementById("birthDate").value
    };

    try { //lähetys
      const res = await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      });

      alert("Customer has been added successfully");
      console.log("Log Info: A new customer has been created");

      if (!res.ok) {
        throw new Error("Failed to add customer");
      }

      // Tyhjennä lomake
      form.reset();

      // Päivitä lista
      loadCustomers();

    } catch (err) {
      console.error(err);
      alert("Error adding customer");
      console.log("Log Info: Error during adding process");
    }
  });
});

//customer-list sisältää tiedot asiakkaista
async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try { //hakee backendistä asiakkaiden tiedot
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    // Clear placeholder
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    // Create simple list
    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      //funktio asiakkaan tietojen lataamiselle lomakkeeseen
      function loadFormWithCustomerInfo(person) {
        document.getElementById("firstName").value = person.first_name;
        document.getElementById("lastName").value = person.last_name;
        document.getElementById("email").value = person.email;
        document.getElementById("phone").value = person.phone || "";
        document.getElementById("birthDate").value = person.birth_date || "";
      };

      //tapahtuman kuuntelijat eli klikatessa tapahtuu jotain
      div.addEventListener("click", () => {
        loadFormWithCustomerInfo(person);
        selectedCustomerId = person.id; // klikatun käyttäjän id
        console.log("Customer clicked:");
        console.log(person);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

//asiakkaan poisto
async function deleteCustomer() {
  if (!selectedCustomerId) {
    alert("No customer selected");
    console.log("Log Info: no customer selected");
    return;
  }

  try {
    const res = await fetch(`/api/persons/${selectedCustomerId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete the customer");
    }

    alert("Customer has been deleted");
    console.log("Log Info: an existing customer has been deleted");

    //lomakkeen tyhjennys
    document.getElementById("customer-form-inputs").reset();
    selectedCustomerId = null;

    loadCustomers();

    } catch (err) {
      console.error(err);
      alert("Error deleting the customer");
    }

}
  

// Run on page load
loadCustomers();