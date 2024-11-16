import { auth, db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

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
      listItem.textContent = `${client.name} - ${client.email} - ${client.phone}`;
      
      // Botón para eliminar el cliente
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteClient(doc.id));

      listItem.appendChild(deleteButton);
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
