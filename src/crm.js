import { auth, db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Elementos del DOM
const crmContainer = document.getElementById('crm-container');
const showCrmButton = document.getElementById('show-crm-button');
const addClientForm = document.getElementById('add-client-form');
const clientList = document.getElementById('client-list');

// Mostrar la sección CRM cuando el botón sea clicado
showCrmButton.addEventListener('click', () => {
  crmContainer.classList.remove('hidden');
  fetchClients(); // Obtener los clientes cuando se abre el CRM
});

// Agregar un nuevo cliente
addClientForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('client-name').value;
  const email = document.getElementById('client-email').value;
  const phone = document.getElementById('client-phone').value;

  try {
    await addDoc(collection(db, 'clients'), {
      name: name,
      email: email,
      phone: phone,
    });

    alert('Cliente agregado exitosamente');
    addClientForm.reset();
    fetchClients(); // Refrescar la lista de clientes después de agregar uno nuevo
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    alert('Hubo un error al agregar el cliente.');
  }
});

// Obtener y mostrar todos los clientes
async function fetchClients() {
  clientList.innerHTML = ''; // Limpiar la lista actual

  try {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    querySnapshot.forEach((doc) => {
      const client = doc.data();
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span id="client-${doc.id}">
          ${client.name} - ${client.email} - ${client.phone}
        </span>
        <button class="edit-button" data-id="${doc.id}">Editar</button>
        <button class="delete-button" data-id="${doc.id}">Eliminar</button>
      `;

      // Botón para eliminar el cliente
      const deleteButton = listItem.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => deleteClient(doc.id));

      // Botón para editar el cliente
      const editButton = listItem.querySelector('.edit-button');
      editButton.addEventListener('click', () => editClient(doc.id, client));

      clientList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
  }
}

// Eliminar un cliente
async function deleteClient(clientId) {
  try {
    await deleteDoc(doc(db, 'clients', clientId));
    alert('Cliente eliminado exitosamente');
    fetchClients(); // Refrescar la lista de clientes después de eliminar
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    alert('Hubo un error al eliminar el cliente.');
  }
}

// Editar un cliente
function editClient(clientId, client) {
  // Crear elementos para la edición en línea
  const clientElement = document.getElementById(`client-${clientId}`);
  clientElement.innerHTML = `
    <input type="text" id="edit-name-${clientId}" value="${client.name}">
    <input type="email" id="edit-email-${clientId}" value="${client.email}">
    <input type="text" id="edit-phone-${clientId}" value="${client.phone}">
    <button class="save-button" data-id="${clientId}">Guardar</button>
    <button class="cancel-button" data-id="${clientId}">Cancelar</button>
  `;

  // Botón para guardar los cambios
  const saveButton = clientElement.querySelector('.save-button');
  saveButton.addEventListener('click', () => saveClient(clientId));

  // Botón para cancelar la edición
  const cancelButton = clientElement.querySelector('.cancel-button');
  cancelButton.addEventListener('click', () => cancelEdit(clientId, client));
}

// Guardar los cambios realizados a un cliente
async function saveClient(clientId) {
  const name = document.getElementById(`edit-name-${clientId}`).value;
  const email = document.getElementById(`edit-email-${clientId}`).value;
  const phone = document.getElementById(`edit-phone-${clientId}`).value;

  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      name: name,
      email: email,
      phone: phone,
    });

    alert('Cliente actualizado exitosamente');
    fetchClients(); // Refrescar la lista de clientes después de actualizar
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    alert('Hubo un error al actualizar el cliente.');
  }
}

// Cancelar la edición del cliente
function cancelEdit(clientId, client) {
  const clientElement = document.getElementById(`client-${clientId}`);
  clientElement.innerHTML = `
    ${client.name} - ${client.email} - ${client.phone}
  `;
  // Agregar de nuevo los botones de editar y eliminar
  const editButton = document.createElement('button');
  editButton.textContent = 'Editar';
  editButton.classList.add('edit-button');
  editButton.setAttribute('data-id', clientId);
  editButton.addEventListener('click', () => editClient(clientId, client));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.classList.add('delete-button');
  deleteButton.setAttribute('data-id', clientId);
  deleteButton.addEventListener('click', () => deleteClient(clientId));

  // Colocar ambos botones juntos en el mismo contenedor
  clientElement.appendChild(editButton);
  clientElement.appendChild(deleteButton);
}
