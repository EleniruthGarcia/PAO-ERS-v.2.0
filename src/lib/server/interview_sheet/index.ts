import { db } from '$lib/server/database';
import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from "xlsx-template";

const seed = {
    request: {
        _id: 'REQUEST-0000000',
        client_id: ['CLIENT-0000000'],
        lawyer_id: 'LAWYER-0000000',
        case_id: 'CASE-0000000',
        date: new Date(),
        type: 'request',
    },
    lawyer: {
        _id: 'LAWYER-0000000',
        title: 'Atty.',
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Doe',
        nameSuffix: 'Jr.',
    },
    client: {
        _id: 'CLIENT-0000000',
        name: 'John B. Doe Jr.',
        firstName: 'John',
        middleName: 'B.',
        lastName: 'Doe',
        nameSuffix: 'Jr.',
        dateOfBirth: new Date('2003-05-19'),
        age: new Date().getFullYear() - new Date('2003-05-19').getFullYear(),
    },
    case: {
        _id: 'CASE-0000000',
        status: 'pending',
        type: 'interview',
        location: 'Cebu City',
        purpose: 'interview',
        dateFiled: new Date(),
    },
};

export const generateInterviewSheet = async (_data: any) => {
    const data = (await db.collection('requests').aggregate([
        {
            $match: {
                _id: seed.request._id,
            }
        },
        // start processing here
        {
            $project: {
                _id: 0,
                client_id: 1,
                case_id: 1,
                date: 1,
                type: 1,
            }
        }
    ]).toArray())[0];

    const file = await read(templateFile).arrayBuffer();
    const template = new XlsxTemplate(Buffer.from(file));
    template.substitute(1, data);

    return template.generate({ type: 'base64' });
};


// upload seed data to database
db.collection<{ _id: string }>('clients').updateOne({
    _id: seed.client._id
}, {
    $set: {
        ...seed.client,
        age: { $subtract: [new Date(), '$dateOfBirth'] },
    }
}, { upsert: true });

db.collection<{ _id: string }>('requests').updateOne({
    _id: seed.request._id
}, {
    $set: {
        ...seed.request,
    }
}, { upsert: true });

db.collection<{ _id: string }>('cases').updateOne({
    _id: seed.case._id
}, {
    $set: {
        ...seed.case,
    }
}, { upsert: true });