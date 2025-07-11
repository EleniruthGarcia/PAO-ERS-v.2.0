//src>lib>server>interview_sheet>index.ts
import { read } from '$app/server';
import templateFile from './template.pdf?url';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export const generateInterviewSheet = async (data: any) => {
	if (data.length < 1) return { name: '', blob: '', type: '', error: true };
	if (data.length > 1) {
		const zip = new JSZip();

		for (const item of data) zip.file(`Interview Sheet_${item.name}.pdf`, await addTextToPDF(item));

		return {
			name: `Interview Sheet_${data[0].controlNo}.zip`,
			blob: await zip.generateAsync({ type: 'blob' }),
			type: 'application/zip'
		};
	}

	// Ensure we pass a proper ArrayBuffer to Blob (not SharedArrayBuffer)
	const pdfBytes = await addTextToPDF(data[0]);
	let arrayBuffer: ArrayBuffer;
	if (pdfBytes instanceof Uint8Array) {
		arrayBuffer = ArrayBuffer.prototype.slice.call(pdfBytes.buffer, pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
	} else if (Object.prototype.toString.call(pdfBytes) === '[object ArrayBuffer]') {
		arrayBuffer = pdfBytes;
	} else {
		throw new Error('Unsupported pdfBytes type');
	}

	return {
		name: `Interview Sheet_${data[0].controlNo}.pdf`,
		blob: new Blob([arrayBuffer], { type: 'application/pdf' }),
		type: 'application/pdf',
		error: false
	};
};

function getFormattedDate(): [string, string, string, number] {
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
		'December'
	];

	const day = now.getDate();
	const monthIndex = now.getMonth();
	const year = now.getFullYear();

	// Create the formatted date string in "Month Day, Year" format
	const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
	const dayWithSuffix = addOrdinalSuffix(day);

	return [formattedDate, monthNames[monthIndex], dayWithSuffix, year];
}

function addOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) {
		return `${day}th`;
	}
	switch (day % 10) {
		case 1:
			return `${day}st`;
		case 2:
			return `${day}nd`;
		case 3:
			return `${day}rd`;
		default:
			return `${day}th`;
	}
}
async function addTextToPDF(data: any) {
	const values = getFormattedDate();
	const monthYear = getFormattedDate()[1] + ', ' + getFormattedDate()[3];
	const {
		// branch data
		region,
		districtProvince,
		district,
		province,
		controlNo,
		interviewer,

		// client data
		religion,
		citizenship,
		name,
		age,
		address,
		email,
		individualMonthlyIncome,
		detainedSince,
		civilStatus,
		sex,
		educationalAttainment,
		languageDialect,
		contactNo,
		spouse,
		addressOfSpouse,
		spouseContactNo,
		placeOfDetention,
		proofOfIndigency,

		// interviewee data
		intervieweeName,
		intervieweeAddress,
		relationshipToClient,
		intervieweeAge,
		intervieweeSex,
		intervieweeCivilStatus,
		intervieweeContactNo,
		intervieweeEmail,

		// nature of service
		natureOfService,
		otherNature,
		PDLStatus, // from client.detained
		natureOfTheCase,
		caseSpecs,

		// client class
		clientClasses,
		clientInvolvement,
		lawEnforcer,
		foreignNational,
		pwd,
		indigenousPeople,
		urbanPoor,
		ruralPoor,

		adversePartyInvolvement,
		adversePartyName,
		adversePartyAddress,
		factsOfTheCase,
		causeOfActionOrNatureOfOffence,
		pendingInCourt,
		titleOfCaseDocketNum,
		court
	} = data;

	// Load existing PDF
	const pdfBytes = await read(templateFile).arrayBuffer();
	const pdfDoc = await PDFDocument.load(pdfBytes);
	// Get the first page of the PDF
	const firstPage = pdfDoc.getPages()[0];

	const publicAtty = 'Atty. ' + interviewer;

	// Add text to the first page
	firstPage.drawText(controlNo ?? 'N/A', {
		x: 90,
		y: 863,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	//Attorney Name
	firstPage.drawText(publicAtty, {
		x: 90,
		y: 790,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[0] ?? 'N/A', {
		x: 70,
		y: 875,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(region ?? 'N/A', {
		x: 250,
		y: 895,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(district ?? 'N/A', {
		x: 250,
		y: 885,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(monthYear ?? 'N/A', {
		x: 300,
		y: 152,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	// firstPage.drawText(district ?? 'N/A', {
	// 	x: 380,
	// 	y: 162,
	// 	size: 8,
	// 	color: rgb(0, 0, 0) // Black
	// });
	firstPage.drawText(districtProvince ?? 'N/A', {
		x: 380,
		y: 152,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[2]?.toString() ?? 'N/A', {
		x: 250,
		y: 152,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(monthYear ?? 'N/A', {
		x: 332,
		y: 212,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	// firstPage.drawText(district ?? 'N/A', {
	// 	x: 405,
	// 	y: 220,
	// 	size: 8,
	// 	color: rgb(0, 0, 0) // Black
	// });
	firstPage.drawText(districtProvince ?? 'N/A', {
		x: 405,
		y: 212,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[2]?.toString() ?? 'N/A', {
		x: 285,
		y: 212,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(name ?? 'N/A', {
		x: 70,
		y: 705,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(age?.toString() ?? 'N/A', {
		x: 320,
		y: 705,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(sex ?? 'N/A', {
		x: 370,
		y: 705,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const religionTxt = religion ? religion : 'N/A';
	firstPage.drawText(religionTxt ?? 'N/A', {
		x: 90,
		y: 691,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(educationalAttainment ?? 'N/A', {
		x: 390,
		y: 691,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const citizen = citizenship ? citizenship : 'N/A';
	firstPage.drawText(citizen ?? 'N/A', {
		x: 100,
		y: 677,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const language = languageDialect ? languageDialect : 'N/A';
	firstPage.drawText(language ?? 'N/A', {
		x: 390,
		y: 677,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(address ?? 'N/A', {
		x: 80,
		y: 663,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(contactNo ?? 'N/A', {
		x: 390,
		y: 663,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const clientEmail = email ? email : 'N/A';
	firstPage.drawText(clientEmail ?? 'N/A', {
		x: 80,
		y: 649,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const MonthlyIncome = individualMonthlyIncome ? individualMonthlyIncome : 'N/A';
	firstPage.drawText(MonthlyIncome ?? 'N/A', {
		x: 150,
		y: 635,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	if (PDLStatus) {
		// yes detained
		firstPage.drawRectangle({
			x: 96,
			y: 622,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(detainedSince ?? 'N/A', {
			x: 100,
			y: 607,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText(placeOfDetention ?? 'N/A', {
			x: 390,
			y: 607,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		// no detained
		firstPage.drawRectangle({
			x: 130,
			y: 622,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText('N/A', {
			x: 100,
			y: 607,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText('N/A', {
			x: 390,
			y: 607,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (natureOfService.includes('Legal Advice')) {
		// legal advice
		firstPage.drawRectangle({
			x: 34,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (natureOfService.includes('Legal Documentation')) {
		// legal documentation
		firstPage.drawRectangle({
			x: 203,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (natureOfService.includes('Representation in Court or Quasi-Judicial Bodies')) {
		// rep in court
		firstPage.drawRectangle({
			x: 335,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (natureOfService.includes('Inquest Legal Assistance')) {
		// inquest legal assist
		firstPage.drawRectangle({
			x: 34,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (natureOfService.includes('Mediation or Conciliation')) {
		// mediation
		firstPage.drawRectangle({
			x: 203,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (natureOfService.includes('Administration of Oath')) {
		// admin of oath
		firstPage.drawRectangle({
			x: 335,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (
		natureOfService.includes('Others') ||
		natureOfService.includes('Home Visitation') ||
		natureOfService.includes('Jail Visitation') ||
		natureOfService.includes('Limited Services')
	) {
		// others
		firstPage.drawRectangle({
			x: 34,
			y: 748,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		let otherNatures = '';
		if (natureOfService.includes('Home Visitation')) {
			otherNatures += 'Home Visitation/';
		}
		if (natureOfService.includes('Jail Visitation')) {
			otherNatures += 'Jail Visitation/';
		}
		if (natureOfService.includes('Limited Services')) {
			otherNatures += 'Limited Services/';
		}
		otherNatures += otherNature;
		firstPage.drawText(otherNature ?? 'N/A', {
			x: 80,
			y: 748,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}
	if (natureOfTheCase === 'Criminal') {
		// CRIMINAL
		firstPage.drawRectangle({
			x: 34,
			y: 504,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs ?? 'N/A', {
			x: 85,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 85,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (natureOfTheCase === 'Administrative') {
		// ADMINISTRATIVE
		firstPage.drawRectangle({
			x: 34,
			y: 490,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs ?? 'N/A', {
			x: 105,
			y: 490,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 105,
			y: 490,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (natureOfTheCase === 'Appealed') {
		// APPEALED
		firstPage.drawRectangle({
			x: 206,
			y: 490,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs ?? 'N/A', {
			x: 265,
			y: 490,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 265,
			y: 490,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (natureOfTheCase === 'Civil') {
		// CIVIL
		firstPage.drawRectangle({
			x: 206,
			y: 504,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs ?? 'N/A', {
			x: 265,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 265,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (natureOfTheCase === 'Labor') {
		// LABOR
		firstPage.drawRectangle({
			x: 370,
			y: 504,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs ?? 'N/A', {
			x: 420,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 420,
			y: 504,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	for (const clientClass of clientClasses) {
		if (typeof clientClass === 'string') {
			if (clientClass === 'Child in Conflict with the Law') {
				firstPage.drawRectangle({
					x: 34,
					y: 458,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Senior Citizen') {
				// SENIOR
				firstPage.drawRectangle({
					x: 205,
					y: 458,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Woman Client') {
				// Woman
				firstPage.drawRectangle({
					x: 34,
					y: 444,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'VAWC Victim') {
				// VAWC CLIENT
				firstPage.drawRectangle({
					x: 105,
					y: 444,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Refugee or Evacuee') {
				// REFUGEE
				firstPage.drawRectangle({
					x: 205,
					y: 444,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Drug-Related Duty') {
				// DRUG DUTY
				firstPage.drawRectangle({
					x: 105,
					y: 430,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Tenant in Agrarian Case') {
				// AGRAGRIAN
				firstPage.drawRectangle({
					x: 205,
					y: 430,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'OFW (Land-Based)') {
				// OFW LAND BASE
				firstPage.drawRectangle({
					x: 34,
					y: 416,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'OFW (Sea-Based)') {
				// OFW SEA BASE
				firstPage.drawRectangle({
					x: 34,
					y: 402,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Victim of Terrorism (R.A. No. 9372)') {
				// TERRORISM
				firstPage.drawRectangle({
					x: 205,
					y: 416,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Victim of Torture (R.A. No. 9745)') {
				// TORTURE
				firstPage.drawRectangle({
					x: 205,
					y: 402,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Victim of Trafficking (R.A. No. 9208)') {
				// TRAFFICKING
				firstPage.drawRectangle({
					x: 205,
					y: 388,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Former Rebels (FRs) and Former Violent Extremists (FVEs)') {
				// FR FVE
				firstPage.drawRectangle({
					x: 34,
					y: 388,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			} else if (clientClass === 'Petitioner for Voluntary Rehabilitation (Drugs)') {
				// DRUGS
				firstPage.drawRectangle({
					x: 366,
					y: 388,
					width: 7,
					height: 7,
					color: rgb(0, 0, 0),
					borderColor: undefined // No border
				});
			}
		}
	}
	if (lawEnforcer) {
		// LAW ENFORCER
		firstPage.drawRectangle({
			x: 34,
			y: 430,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (pwd) {
		// PWD
		firstPage.drawRectangle({
			x: 366,
			y: 402,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(pwd ?? 'N/A', {
			x: 473,
			y: 402,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 485,
			y: 402,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (foreignNational) {
		// FOREIGN
		firstPage.drawRectangle({
			x: 366,
			y: 458,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(foreignNational ?? 'N/A', {
			x: 456,
			y: 458,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 455,
			y: 458,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	if (urbanPoor) {
		// URBAN
		firstPage.drawRectangle({
			x: 366,
			y: 444,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(urbanPoor ?? 'N/A', {
			x: 430,
			y: 444,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 425,
			y: 444,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}
	if (ruralPoor) {
		// RURAL POOR
		firstPage.drawRectangle({
			x: 366,
			y: 430,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(ruralPoor ?? 'N/A', {
			x: 430,
			y: 430,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 425,
			y: 430,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}
	if (indigenousPeople) {
		// INDIGENOUS
		firstPage.drawRectangle({
			x: 366,
			y: 416,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(indigenousPeople ?? 'N/A', {
			x: 455,
			y: 416,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 455,
			y: 416,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	// PARTY/REP
	firstPage.drawText(name ?? 'N/A', {
		x: 205,
		y: 365,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(civilStatus ?? 'N/A', {
		x: 473,
		y: 705,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const addressPartner = addressOfSpouse ? addressOfSpouse : 'N/A';
	const contactPartner = spouseContactNo ? spouseContactNo : 'N/A';
	const partner1 = spouse ? spouse : 'N/A';
	const partner = spouse ? spouse : 'N/A';

	firstPage.drawText(partner ?? 'N/ASP', {
		x: 350,
		y: 294,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(addressPartner ?? 'N/A', {
		x: 380,
		y: 635,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(contactPartner ?? 'N/A', {
		x: 390,
		y: 621,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(partner1 ?? 'N/A', {
		x: 340,
		y: 649,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	if (civilStatus === 'Married') {
		// Married
		firstPage.drawRectangle({
			x: 298,
			y: 294,
			width: 5,
			height: 5,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (civilStatus === 'Single') {
		// Single
		firstPage.drawRectangle({
			x: 265,
			y: 294,
			width: 5,
			height: 5,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (civilStatus === 'Widow/Widower') {
		firstPage.drawRectangle({
			x: 469,
			y: 294,
			width: 5,
			height: 5,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}

	firstPage.drawText(intervieweeName ?? 'N/A', {
		x: 70,
		y: 573,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeAge?.toString() ?? 'N/A', {
		x: 320,
		y: 573,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeSex ?? 'N/A', {
		x: 370,
		y: 573,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeCivilStatus ?? 'N/A', {
		x: 473,
		y: 573,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(intervieweeAddress ?? 'N/A', {
		x: 78,
		y: 559,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeContactNo ?? 'N/A', {
		x: 345,
		y: 559,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(relationshipToClient ?? 'N/A', {
		x: 125,
		y: 545,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	if (intervieweeEmail) {
		firstPage.drawText(intervieweeEmail ?? 'N/A', {
			x: 320,
			y: 545,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 320,
			y: 545,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}

	firstPage.drawText(districtProvince ?? 'N/A', {
		x: 25,
		y: 330,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(name ?? 'N/A', {
		x: 70,
		y: 294,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(address ?? 'N/A', {
		x: 100,
		y: 282,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	const MonthlyIncome1 = individualMonthlyIncome ? individualMonthlyIncome : 'N/A';
	firstPage.drawText(MonthlyIncome1?.toString() ?? 'N/A', {
		x: 230,
		y: 246,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});

	const secondPage = pdfDoc.getPages()[1];
	for (const item of clientInvolvement) {
		if (typeof item === 'string') {
			switch (item) {
				case 'Plaintiff':
					secondPage.drawRectangle({
						x: 67,
						y: 928,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Accused':
					secondPage.drawRectangle({
						x: 213,
						y: 902,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Defendant':
					secondPage.drawRectangle({
						x: 213,
						y: 928,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Oppositor':
					secondPage.drawRectangle({
						x: 362,
						y: 928,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Petitioner':
					secondPage.drawRectangle({
						x: 67,
						y: 915,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Respondent':
					secondPage.drawRectangle({
						x: 213,
						y: 915,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Complainant':
					secondPage.drawRectangle({
						x: 67,
						y: 902,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
			}
		} else {
			secondPage.drawRectangle({
				x: 362,
				y: 915,
				width: 7,
				height: 7,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
			const key = Object.keys(item)[0];
			secondPage.drawText(item[key] ?? 'N/A', {
				x: 410,
				y: 915,
				size: 8,
				color: rgb(0, 0, 0) // Black
			});
		}
	}
	for (const item of adversePartyInvolvement ?? []) {
		if (typeof item === 'string') {
			switch (item) {
				case 'Plaintiff or Complainant':
					secondPage.drawRectangle({
						x: 67,
						y: 871,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Defendant, Respondent, or Accused':
					secondPage.drawRectangle({
						x: 67,
						y: 858,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Oppositor or Others':
					secondPage.drawRectangle({
						x: 293,
						y: 871,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
			}
		}
	}
	if (proofOfIndigency.includes('Income Tax Return')) {
		secondPage.drawRectangle({
			x: 33,
			y: 229,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (proofOfIndigency.includes('Certification from Barangay')) {
		secondPage.drawRectangle({
			x: 144,
			y: 229,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (proofOfIndigency.includes('Certification from DSWD')) {
		secondPage.drawRectangle({
			x: 295,
			y: 229,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	}
	if (proofOfIndigency && proofOfIndigency.length > 0) {
		secondPage.drawRectangle({
			x: 415,
			y: 229,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		secondPage.drawText(proofOfIndigency ?? 'N/A', {
			x: 425,
			y: 217,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
	}
	// }
	if (pendingInCourt === true) {
		secondPage.drawText('X', {
			x: 322,
			y: 358,
			size: 12,
			color: rgb(1, 1, 1) // Black
		});
	} else if (pendingInCourt === false) {
		secondPage.drawText('X', {
			x: 357,
			y: 358,
			size: 12,
			color: rgb(1, 1, 1) // Black
		});
	} else {
		secondPage.drawText(pendingInCourt ?? 'N/A', {
			x: 357,
			y: 358,
			size: 12,
			color: rgb(1, 1, 1) // Black
		});
	}
	var adversePartyMaxLength = 48;
	var yCoordinate = 845;
	for (let i = 0; i < adversePartyName?.length; i += adversePartyMaxLength) {
		const textChunk = adversePartyName.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 70,
			y: yCoordinate,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 48;
	var yCoordinate = 845;
	for (let i = 0; i < adversePartyAddress?.length; i += adversePartyMaxLength) {
		const textChunk = adversePartyAddress?.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 330,
			y: yCoordinate,
			size: 8,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 100;
	var yCoordinate = 798;
	for (let i = 0; i < factsOfTheCase?.length; i += adversePartyMaxLength) {
		const textChunk = factsOfTheCase.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 50,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 100;
	var yCoordinate = 492;
	for (let i = 0; i < causeOfActionOrNatureOfOffence.length; i += adversePartyMaxLength) {
		const textChunk = causeOfActionOrNatureOfOffence.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 50,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 60;
	var yCoordinate = 344;
	for (let i = 0; i < titleOfCaseDocketNum?.length; i += adversePartyMaxLength) {
		const textChunk = titleOfCaseDocketNum.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 190,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 60;
	var yCoordinate = 295;
	const judiciary = court ? court : 'N/A';
	for (let i = 0; i < judiciary?.length; i += adversePartyMaxLength) {
		const textChunk = judiciary.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk ?? 'N/A', {
			x: 130,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}

	// PARTY/REP
	// secondPage.drawText(name ?? 'N/A', {
	// 	x: 190,
	// 	y: 150,
	// 	size: 8,
	// 	color: rgb(0, 0, 0) // Black
	// });

	const thirdPage = pdfDoc.getPages()[2];
	thirdPage.drawText(getFormattedDate()[0] ?? 'N/A', {
		x: 100,
		y: 75,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	thirdPage.drawText(name ?? 'N/A', {
		x: 105,
		y: 122,
		size: 8,
		color: rgb(0, 0, 0) // Black
	});
	// Save the modified PDF
	return await pdfDoc.save();
}