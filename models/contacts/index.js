import fs from 'fs/promises'
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('models', 'contacts', 'contacts.json');

const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
    const results = await fs.readFile(contactsPath);
    return JSON.parse(results);  
}

export const getContactById = async (id) => {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === id);
    return result || null;
}

export const removeContact = async (id) => {
    const contacts = await listContacts();
    const i = contacts.findIndex(item => item.id === id);
    if(i === -1){
        return null;
    }
    const [result] = contacts.splice(i, 1)
    await updateContacts(contacts);
    return result  
}

export const addContact = async ({name, email, phone}) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

export const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);// знаходимо id контакту що треба оновити
  if(index === -1){// якщо немає такого id - повертаємо null
      return null;
  }
  contacts[index] = {...contacts[index], ...data};// оновлюємо фільм даними, що передали
  // перезаписуємо JSON   
  await updateContact(contacts);
  return contacts[index];// повертаємо оновлений об'єкт
}

// export default {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// }
