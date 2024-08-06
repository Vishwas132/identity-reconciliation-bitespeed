import { Contact } from '../types/contact.js';
import prisma from '../client.js';

export async function findPartialMatchingContacts(
  email: string | null,
  phoneNumber: string | null,
): Promise<Contact[]> {
  return prisma.contact.findMany({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createNewContact(
  email: string | null,
  phoneNumber: string | null,
  linkedId: number | null,
  linkPrecedence: string,
): Promise<Contact> {
  return prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkedId,
      linkPrecedence,
    },
  });
}

export async function updateContactToSecondary(
  contactId: number,
  newLinkedId: number,
): Promise<Contact> {
  return prisma.contact.update({
    where: { id: contactId },
    data: {
      linkedId: newLinkedId,
      linkPrecedence: 'secondary',
    },
  });
}

export async function findAllRelatedContacts(
  contactIds: number[],
): Promise<Contact[]> {
  const allRelatedContacts: Contact[] = await prisma.contact.findMany({
    where: {
      OR: [{ linkedId: { in: contactIds } }, { id: { in: contactIds } }],
    },
    orderBy: [{ createdAt: 'asc' }, { linkPrecedence: 'asc' }],
  });
  return allRelatedContacts;
}

export async function findExactMatchingContacts({
  email,
  phoneNumber,
}: {
  email: string | null;
  phoneNumber: string | null;
}): Promise<Contact | null> {
  return await prisma.contact.findFirst({
    where: {
      AND: [{ email }, { phoneNumber }],
    },
  });
}

export async function reconcileContacts(
  email: string | null,
  phoneNumber: string | null,
): Promise<Contact[]> {
  // If same record already exists, return it
  const exactMatchingContact = await findExactMatchingContacts({
    email,
    phoneNumber,
  });
  if (exactMatchingContact) {
    return [exactMatchingContact];
  }
  // Find contacts where either email or phone number match
  const partialMatchingContacts = await findPartialMatchingContacts(
    email,
    phoneNumber,
  );

  // If no matching contacts, create a new primary contact
  if (partialMatchingContacts.length === 0) {
    const newContact = await createNewContact(
      email,
      phoneNumber,
      null,
      'primary',
    );
    return [newContact];
  }

  // Find all primary contacts ids
  const primaryContactIds = [
    ...new Set(partialMatchingContacts.map(c => c.linkedId || c.id)),
  ];
  const allRelatedContacts = await findAllRelatedContacts(primaryContactIds);

  // Oldest one is the primary contact
  const primaryContact = allRelatedContacts[0];

  // Step 4: Update existing contacts if necessary
  for (const contact of allRelatedContacts) {
    if (
      contact.id !== primaryContact.id &&
      contact.linkedId !== primaryContact.id
    ) {
      contact.linkedId = primaryContact.id;
      contact.linkPrecedence = 'secondary';
      await updateContactToSecondary(contact.id, primaryContact.id);
    }
  }

  // Step 5: Create a new secondary contact if new information is provided
  if (
    (email && !allRelatedContacts.some(c => c.email === email)) ||
    (phoneNumber &&
      !allRelatedContacts.some(c => c.phoneNumber === phoneNumber))
  ) {
    const newSecondaryContact = await createNewContact(
      email,
      phoneNumber,
      primaryContact.id,
      'secondary',
    );
    allRelatedContacts.push(newSecondaryContact);
  }

  return allRelatedContacts;
}
