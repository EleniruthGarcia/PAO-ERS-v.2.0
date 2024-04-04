import db from '$lib/server/database';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types';
import { generateInterviewSheet } from '$lib/server/interview_sheet';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        event.cookies.set('redirect', '/clients/' + event.params.id, { path: '/' });
        redirect(
            '/login',
            { type: 'warning', message: 'You must be logged in to access this page!' },
            event
        );
    }

    const client = await db.clients.findOne({ _id: event.params.id });
    if (!client) {
        redirect(
            '/clients',
            { type: 'warning', message: 'Client not found!' },
            event
        );
    }

    return {
        breadcrumbs: [
            { href: '/', text: 'PAO-ERS' },
            { href: '/clients', text: 'Clients' },
            {
                href: '/clients/' + event.params.id,
                text: client.name
            }
        ],
        client
    };
};


export const actions = {
    default: async (event) => {
        if (!event.locals.user) {
            redirect(
                '/login',
                { type: 'warning', message: 'You must be logged in to access this page!' },
                event
            );
        }

        const { month } = Object.fromEntries(await event.request.formData());

        const data_ = db.requests.aggregate([{
            $match: {}
        }]);

        let data = {
            region: 'CAR',
            district: 'Baguio City',
            month: 'December',
            day: '15',
            year: '2023',
            barangay: 'BAGUIO CITY JAIL',
            lawyer: 'CECILIA F. BACANI',
            f10: [
                { date: '12/15/2023', name: 'Acaso, Mary Ann y Bariso', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Alonzo, Sunshine y Lucas', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Agoyos, April Lyn y Eyas', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Almazan, Britch ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Amurao, Kristel Lorelaine', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Abelinde, Elsa', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Balbuena,Shaina Fane ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Balicha, Rosario y Abuyog', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Banatao, Maricar y Salingbay', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Basman, Norlailah y Rascal', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Batolne, Brigitte y Ebbes', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Batolne, Clare y Sito', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Batolne, Ruby y Ebbes', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Buenaobra, Mary Anne ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Bulatao, Cecilia y Baquilar', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Cabalo, Nicole', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Cabarlo, Nicole Ann ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Camrot, Laija y Bagonia', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Castellano, Marichu y Leyte', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Cortez, Judith y Wagtingan', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Darapiza,Jerelyn y Calindas', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'De Guzman, May-ann ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Del Mundo, Lilibeth y Flores', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'De Villes, Alma y Lazarte', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Delena, Angeline Mae ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Dao-ayen, Arraine y Manis', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Domingo, Mimbla y Sabado', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Domingo, Sheena ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Doss, Hazel y Gracia', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Ebra, Rasmia Ba', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Fernandez, Ferlinda ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Furto, Myra y Ruiz', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Guiles, Akira Shan y Inciong', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Kimmayong, Lyca y Ananayo', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Labasan, Amelyn y Garcia', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Lau, Romyllie y Batolne', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Lee, Anna-lynn y Bugarin', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Lorenzana, Sharry y', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Mabalot, Cynthia', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Mendoza, Jessica y Dela Cruz', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Millare, Elisa y Aguirre', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Millanes, Heijen', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Mondero, Ann Marie ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Moralde, Mercury ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Perocho, Michelle y Marco', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Perez, Raye Ann Marie ', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Postre, Mia Jane y Noquilla', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Ricablanca, Moraine Gaile ', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Salvador, Azhel y Pablo', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Segwaben, Silene', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Sibug, Grace y Ubusan', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', sex: 'F' },
                { date: '12/15/2023', name: 'Singson, Alysia y Allidem', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Tabisola, Emelyn y De Paz', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Tabula, Juvylyn y Recaplaza', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Tacadena, Judy y Ambasing', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Tandingan, Carla y Sacyat', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Taroma, Nichole y Viscara', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Tayao, Margie y Gabriel', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Torio, Veronica y Maquinto', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
                { date: '12/15/2023', name: 'Uyan, Marjorie y Bon-og', sex: 'F', problem_presented: 'LECTURE ON EXPANDED SENIOR CITIZENS ACT OF 2010', action_taken: 'OUTREACH/LECTURE', remarks: 'NA' },
            ]
        };

        return { interview_sheet: await generateInterviewSheet(data) };
    },
} satisfies Actions;
