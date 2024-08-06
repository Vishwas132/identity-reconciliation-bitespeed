import { contact } from "./../types/contact.js";

export const createResponseBody = (contacts: contact[]) => {
  const primaryContactId = contacts[0].linkedId || contacts[0].id;
  const emails = [
    ...new Set<string | null>(contacts.map((contact: contact) => contact.email)),
  ];
  const phoneNumbers = [
    ...new Set<string | null>(
      contacts.map((contact: contact) => contact.phoneNumber),
    ),
  ];
  const secondaryContactIds = contacts
    .map((contact: contact) =>
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