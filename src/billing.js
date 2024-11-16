import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

// Elementos del DOM
const billingContainer = document.getElementById('billing-container');
const showBillingButton = document.getElementById('show-billing-button');
const addBillForm = document.getElementById('add-bill-form');
const billList = document.getElementById('bill-list');

// Mostrar la sección de facturación cuando el botón sea clicado
showBillingButton.addEventListener('click', () => {
  billingContainer.classList.remove('hidden');
  fetchBills(); // Obtener las facturas cuando se abre la sección de facturación
});

// Agregar una nueva factura
addBillForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const client = document.getElementById('bill-client').value;
  const amount = document.getElementById('bill-amount').value;
  const date = document.getElementById('bill-date').value;

  try {
    await addDoc(collection(db, 'bills'), {
      client: client,
      amount: parseFloat(amount),
      date: date,
    });

    alert('Factura agregada exitosamente');
    addBillForm.reset();
    fetchBills(); // Refrescar la lista de facturas después de agregar una nueva
  } catch (error) {
    console.error('Error al agregar factura:', error);
    alert('Hubo un error al agregar la factura.');
  }
});

// Obtener y mostrar todas las facturas
async function fetchBills() {
  billList.innerHTML = ''; // Limpiar la lista actual

  try {
    const querySnapshot = await getDocs(collection(db, 'bills'));
    querySnapshot.forEach((doc) => {
      const bill = doc.data();
      const listItem = document.createElement('li');
      listItem.classList.add('bill-item');

      listItem.innerHTML = `
        <div class="bill-info">
          <span id="bill-${doc.id}">
            Cliente: ${bill.client} - Monto: $${bill.amount.toFixed(2)} - Fecha: ${bill.date}
          </span>
          <button class="edit-bill-button" data-id="${doc.id}">Editar</button>
          <button class="delete-bill-button" data-id="${doc.id}">Eliminar</button>
        </div>
      `;

      // Botón para eliminar la factura
      const deleteButton = listItem.querySelector('.delete-bill-button');
      deleteButton.addEventListener('click', () => deleteBill(doc.id));

      // Botón para editar la factura
      const editButton = listItem.querySelector('.edit-bill-button');
      editButton.addEventListener('click', () => editBill(doc.id, bill));

      billList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error al obtener facturas:', error);
  }
}

// Eliminar una factura
async function deleteBill(billId) {
  try {
    await deleteDoc(doc(db, 'bills', billId));
    alert('Factura eliminada exitosamente');
    fetchBills(); // Refrescar la lista de facturas después de eliminar
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    alert('Hubo un error al eliminar la factura.');
  }
}

// Editar una factura
function editBill(billId, bill) {
  const billElement = document.getElementById(`bill-${billId}`);
  billElement.innerHTML = `
    <input type="text" id="edit-client-${billId}" value="${bill.client}">
    <input type="number" id="edit-amount-${billId}" value="${bill.amount}">
    <input type="date" id="edit-date-${billId}" value="${bill.date}">
    <button class="save-bill-button" data-id="${billId}">Guardar</button>
    <button class="cancel-bill-button" data-id="${billId}">Cancelar</button>
  `;

  // Botón para guardar los cambios
  const saveButton = billElement.querySelector('.save-bill-button');
  saveButton.addEventListener('click', () => saveBill(billId));

  // Botón para cancelar la edición
  const cancelButton = billElement.querySelector('.cancel-bill-button');
  cancelButton.addEventListener('click', () => cancelEditBill(billId, bill));
}

// Guardar los cambios realizados a una factura
async function saveBill(billId) {
  const client = document.getElementById(`edit-client-${billId}`).value;
  const amount = parseFloat(document.getElementById(`edit-amount-${billId}`).value);
  const date = document.getElementById(`edit-date-${billId}`).value;

  try {
    const billRef = doc(db, 'bills', billId);
    await updateDoc(billRef, {
      client: client,
      amount: amount,
      date: date,
    });

    alert('Factura actualizada exitosamente');
    fetchBills(); // Refrescar la lista de facturas después de actualizar
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    alert('Hubo un error al actualizar la factura.');
  }
}

// Cancelar la edición de la factura
function cancelEditBill(billId, bill) {
  const billElement = document.getElementById(`bill-${billId}`);
  billElement.innerHTML = `
    Cliente: ${bill.client} - Monto: $${bill.amount.toFixed(2)} - Fecha: ${bill.date}
    <button class="edit-bill-button" data-id="${billId}">Editar</button>
    <button class="delete-bill-button" data-id="${billId}">Eliminar</button>
  `;

  // Reasignar eventos a los botones de editar y eliminar
  const editButton = billElement.querySelector('.edit-bill-button');
  editButton.addEventListener('click', () => editBill(billId, bill));

  const deleteButton = billElement.querySelector('.delete-bill-button');
  deleteButton.addEventListener('click', () => deleteBill(billId));
}
