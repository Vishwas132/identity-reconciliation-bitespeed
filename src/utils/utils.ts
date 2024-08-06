import { Contact } from "./../types/contact.js";

export function createResponseBody(contacts: Contact[]) {
  const primaryContactId = contacts[0].linkedId || contacts[0].id;
  const emails = [
    ...new Set<string | null>(contacts.map((contact: Contact) => contact.email)),
  ];
  const phoneNumbers = [
    ...new Set<string | null>(
      contacts.map((contact: Contact) => contact.phoneNumber),
    ),
  ];
  const secondaryContactIds = contacts
    .map((contact: Contact) =>
      contact.linkPrecedence === 'secondary' ? contact.id : null,
    )
    .filter((id: number | null) => id);
  return {
    contact: {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
};