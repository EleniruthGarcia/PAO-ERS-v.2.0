/**
 * Import necessary modules:
 * - PrismaClient for interacting with the Prisma database
 * - PDFDocument and rgb from pdf-lib for manipulating PDF documents
 * - fs (file system) module for file operations
 */
import { PrismaClient } from '@prisma/client';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

/**
 * Constant to hold the client ID used for demonstration purposes.
 * Replace this with your actual client ID for production use.
 */
const PRISMA_CLIENT_ID = 1;

/**
 * Interface defining the expected structure of a client object retrieved from the database.
 */
interface Client {
  id: number;
  firstName: string;
  middleName?: string; // Optional field
  lastName: string;
  nameSuffix?: string; // Optional field
}

/**
 * Fetches a client from the database by its ID.
 * 
 * @param {number} clientId - The ID of the client to fetch.
 * @returns {Promise<Client | null>} - A Promise that resolves to a `Client` object if found,
 *                                    otherwise null if not found or an error occurs.
 */
async function getClientById(clientId: number): Promise<Client | null> {
  const prisma = new PrismaClient();
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });
    return client;
  } catch (error) {
    console.error('Error fetching client:', error);
    return null; // Return null for error handling
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Formats the current date in the format "Month Day, Year".
 * 
 * @returns {string} - The formatted date string.
 */
function formatDate(): string {
  const now = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const day = now.getDate();
  const monthIndex = now.getMonth();
  const year = now.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
}

/**
 * Generates a consent form PDF for the provided client ID.
 * 
 * @param {number} clientId - The ID of the client for whom to generate the form.
 * @returns {Promise<void>} - An empty Promise that resolves upon completion.
 */
async function generateConsentForm(clientId: number): Promise<void> {
  const client = await getClientById(clientId);

  if (!client) {
    console.error('Client with the provided ID not found.');
    return; // Exit the function if client not found
  }

  const fullName = [client.firstName, client.middleName || '', client.lastName, client.nameSuffix || ''].join(' ');
  const filename = `${client.lastName}${PRISMA_CLIENT_ID}-consent-form.pdf`;

  try {
    const pdfBytes = fs.readFileSync('../form_template/data-privacy-consent-notice-and-form.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const firstPage = pdfDoc.getPages()[0];

    firstPage.drawText(formatDate(), {
      x: 120,
      y: 80,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
    firstPage.drawText(fullName, {
      x: 110,
      y: 125,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(filename, modifiedPdfBytes);
    console.log('Consent form generated successfully.');
  } catch (error) {
    console.error('Error generating consent form:', error);
  }
}

// Call the function with your desired client ID
generateConsentForm(PRISMA_CLIENT_ID)
  .catch((error) => {
    console.error('Error:', error);
  });