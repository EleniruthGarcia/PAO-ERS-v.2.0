import { read } from '$app/server';
import templateFile from './template.pdf?url';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';

export const generateInterviewSheet = async (data: any) => {
	if (data.length < 1) return { name: '', blob: '', type: '', error: true };
	if (data.length > 1) {
		const zip = new JSZip();

		for (const item of data)
			zip.file(`Interview Sheet_${item.controlNo}.pdf`, await addTextToPDF(item));

		return {
			name: `Interview Sheet_${data[0].name}.zip`,
			blob: await zip.generateAsync({ type: 'blob' }),
			type: 'application/zip'
		};
	}

	return {
		name: `Interview Sheet_${data[0].name}.pdf`,
		blob: new Blob([await addTextToPDF(data[0])], { type: 'application/pdf' }),
		type: 'application/pdf'
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
		natureOfRequest,
		otherNatureOfRequest,
		PDLStatus, // from client.detained
		natureOfTheCase,
		caseSpecs,

		// client class
		clientClasses,
		clientInvolvement,
		foreignNational,
		pwd,
		indigenousPeople,
		urbanPoor,
		ruralPoor,

		adverseParty,
		adversePartyName,
		adversePartyAddress,
		factsOfTheCase,
		natureOfOffence,
		courtPendingStatus,
		titleOfCaseDocketNum,
		courtBodyTribunal
	} = data;

	// Load existing PDF
	const pdfBytes = await read(templateFile).arrayBuffer();
	const pdfDoc = await PDFDocument.load(pdfBytes);
	// Get the first page of the PDF
	const firstPage = pdfDoc.getPages()[0];

	// Add text to the first page
	firstPage.drawText(controlNo, {
		x: 90,
		y: 863,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[0], {
		x: 70,
		y: 875,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(region, {
		x: 250,
		y: 895,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(districtProvince, {
		x: 250,
		y: 885,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(monthYear, {
		x: 300,
		y: 152,
		size: 8.5,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(district, {
		x: 380,
		y: 162,
		size: 8.5,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(province, {
		x: 380,
		y: 152,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[2].toString(), {
		x: 250,
		y: 152,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(monthYear, {
		x: 332,
		y: 212,
		size: 8.5,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(district, {
		x: 405,
		y: 220,
		size: 8.5,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(province, {
		x: 405,
		y: 212,
		size: 8.5,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(values[2].toString(), {
		x: 285,
		y: 212,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(name, {
		x: 70,
		y: 705,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(age.toString(), {
		x: 320,
		y: 705,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(sex, {
		x: 370,
		y: 705,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(religion, {
		x: 90,
		y: 691,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(educationalAttainment, {
		x: 390,
		y: 691,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(citizenship, {
		x: 100,
		y: 677,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(languageDialect, {
		x: 390,
		y: 677,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(address, {
		x: 800,
		y: 663,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(contactNo, {
		x: 390,
		y: 663,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(email, {
		x: 100,
		y: 649,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(individualMonthlyIncome, {
		x: 150,
		y: 635,
		size: 10,
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
		firstPage.drawText(detainedSince, {
			x: 100,
			y: 607,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText(placeOfDetention, {
			x: 390,
			y: 607,
			size: 10,
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
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText('N/A', {
			x: 390,
			y: 607,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	}
	if (natureOfRequest === 'Legal Advice') {
		// legal advice
		firstPage.drawRectangle({
			x: 34,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Legal Documentation') {
		// legal documentation
		firstPage.drawRectangle({
			x: 203,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Representation in Court/Quasi-Judicial Bodies') {
		// rep in court
		firstPage.drawRectangle({
			x: 335,
			y: 772,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Inquest Legal Assistance') {
		// inquest legal assist
		firstPage.drawRectangle({
			x: 34,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Mediation/Conciliation') {
		// mediation
		firstPage.drawRectangle({
			x: 203,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Administration of Oath') {
		// admin of oath
		firstPage.drawRectangle({
			x: 335,
			y: 760,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
	} else if (natureOfRequest === 'Others') {
		// others
		firstPage.drawRectangle({
			x: 34,
			y: 748,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(otherNatureOfRequest, {
			x: 80,
			y: 748,
			size: 10,
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
		firstPage.drawText(caseSpecs, {
			x: 85,
			y: 504,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else if (natureOfTheCase === 'Administrative') {
		// ADMINISTRATIVE
		firstPage.drawRectangle({
			x: 34,
			y: 490,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs, {
			x: 105,
			y: 490,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else if (natureOfTheCase === 'Appealed') {
		// APPEALED
		firstPage.drawRectangle({
			x: 206,
			y: 490,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs, {
			x: 265,
			y: 490,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else if (natureOfTheCase === 'Civil') {
		// CIVIL
		firstPage.drawRectangle({
			x: 206,
			y: 504,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs, {
			x: 265,
			y: 504,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else if (natureOfTheCase === 'Labor') {
		// LABOR
		firstPage.drawRectangle({
			x: 370,
			y: 504,
			width: 7,
			height: 7,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText(caseSpecs, {
			x: 420,
			y: 504,
			size: 10,
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
			} else if (clientClass === 'Law Enforcer') {
				// LAW ENFORCER
				firstPage.drawRectangle({
					x: 34,
					y: 430,
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
		firstPage.drawText(pwd, {
			x: 473,
			y: 402,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 485,
			y: 402,
			size: 10,
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
		firstPage.drawText(foreignNational, {
			x: 456,
			y: 458,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 455,
			y: 458,
			size: 10,
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
		firstPage.drawText(urbanPoor, {
			x: 430,
			y: 444,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 425,
			y: 444,
			size: 10,
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
		firstPage.drawText(ruralPoor, {
			x: 430,
			y: 430,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 425,
			y: 430,
			size: 10,
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
		firstPage.drawText(indigenousPeople, {
			x: 455,
			y: 416,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	} else {
		firstPage.drawText('N/A', {
			x: 455,
			y: 416,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	}

	// PARTY/REP
	firstPage.drawText(name, {
		x: 200,
		y: 365,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(civilStatus, {
		x: 473,
		y: 705,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	if (civilStatus === 'Married') {
		// Married or Widow/Widower
		firstPage.drawText(spouse, {
			x: 390,
			y: 649,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText(addressOfSpouse, {
			x: 390,
			y: 635,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText(spouseContactNo, {
			x: 390,
			y: 621,
			size: 10,
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
		} else if (civilStatus === 'Widow/Widower') {
			// Widow/Widower
			firstPage.drawRectangle({
				x: 469,
				y: 294,
				width: 5,
				height: 5,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
			firstPage.drawText('N/A', {
				x: 390,
				y: 649,
				size: 10,
				color: rgb(0, 0, 0) // Black
			});
			firstPage.drawText('N/A', {
				x: 390,
				y: 635,
				size: 10,
				color: rgb(0, 0, 0) // Black
			});
			firstPage.drawText('N/A', {
				x: 390,
				y: 621,
				size: 10,
				color: rgb(0, 0, 0) // Black
			});
		}
	} else {
		// Single
		firstPage.drawRectangle({
			x: 265,
			y: 294,
			width: 5,
			height: 5,
			color: rgb(0, 0, 0),
			borderColor: undefined // No border
		});
		firstPage.drawText('N/A', {
			x: 390,
			y: 649,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText('N/A', {
			x: 390,
			y: 635,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		firstPage.drawText('N/A', {
			x: 390,
			y: 621,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
	}

	firstPage.drawText(intervieweeName, {
		x: 70,
		y: 573,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeAge.toString(), {
		x: 320,
		y: 573,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeSex, {
		x: 370,
		y: 573,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeCivilStatus, {
		x: 473,
		y: 573,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(intervieweeAddress, {
		x: 73,
		y: 559,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeContactNo, {
		x: 345,
		y: 559,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(relationshipToClient, {
		x: 125,
		y: 545,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(intervieweeEmail, {
		x: 320,
		y: 545,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	firstPage.drawText(districtProvince, {
		x: 25,
		y: 330,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(name, {
		x: 100,
		y: 294,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(spouse, {
		x: 350,
		y: 294,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(address, {
		x: 100,
		y: 282,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	firstPage.drawText(individualMonthlyIncome.toString(), {
		x: 230,
		y: 246,
		size: 10,
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
			secondPage.drawText(item[key], {
				x: 410,
				y: 915,
				size: 10,
				color: rgb(0, 0, 0) // Black
			});
		}
	}
	for (const item of adverseParty) {
		if (typeof item === 'string') {
			switch (item) {
				case 'Plaintiff/Complainant':
					secondPage.drawRectangle({
						x: 67,
						y: 871,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Defendant/Respondent/Accused':
					secondPage.drawRectangle({
						x: 67,
						y: 858,
						width: 7,
						height: 7,
						color: rgb(0, 0, 0),
						borderColor: undefined // No border
					});
					break;
				case 'Oppositor/Others':
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
	for (const item of proofOfIndigency) {
		if (item === 'Income Tax Return') {
			secondPage.drawRectangle({
				x: 33,
				y: 229,
				width: 7,
				height: 7,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
		} else if (item === 'Certification from Barangay') {
			secondPage.drawRectangle({
				x: 144,
				y: 229,
				width: 7,
				height: 7,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
		} else if (item === 'Certification from DSWD') {
			secondPage.drawRectangle({
				x: 295,
				y: 229,
				width: 7,
				height: 7,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
		} else if (typeof item === 'object' && item.hasOwnProperty('Others')) {
			secondPage.drawRectangle({
				x: 415,
				y: 229,
				width: 7,
				height: 7,
				color: rgb(0, 0, 0),
				borderColor: undefined // No border
			});
			secondPage.drawText(item['Others'], {
				x: 425,
				y: 217,
				size: 10,
				color: rgb(0, 0, 0) // Black
			});
		}
	}
	if (courtPendingStatus === 'Yes') {
		secondPage.drawText('X', {
			x: 322,
			y: 358,
			size: 12,
			color: rgb(1, 1, 1) // Black
		});
	} else if (courtPendingStatus === 'No') {
		secondPage.drawText('X', {
			x: 357,
			y: 358,
			size: 12,
			color: rgb(1, 1, 1) // Black
		});
	} else {
	}
	var adversePartyMaxLength = 48;
	var yCoordinate = 845;
	for (let i = 0; i < adversePartyName.length; i += adversePartyMaxLength) {
		const textChunk = adversePartyName.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 70,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 48;
	var yCoordinate = 845;
	for (let i = 0; i < adversePartyAddress.length; i += adversePartyMaxLength) {
		const textChunk = adversePartyAddress.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 330,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 100;
	var yCoordinate = 798;
	for (let i = 0; i < factsOfTheCase.length; i += adversePartyMaxLength) {
		const textChunk = factsOfTheCase.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 50,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 100;
	var yCoordinate = 492;
	for (let i = 0; i < natureOfOffence.length; i += adversePartyMaxLength) {
		const textChunk = natureOfOffence.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 50,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 60;
	var yCoordinate = 344;
	for (let i = 0; i < titleOfCaseDocketNum.length; i += adversePartyMaxLength) {
		const textChunk = titleOfCaseDocketNum.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 190,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}
	var adversePartyMaxLength = 60;
	var yCoordinate = 295;
	for (let i = 0; i < courtBodyTribunal.length; i += adversePartyMaxLength) {
		const textChunk = courtBodyTribunal.substring(i, i + adversePartyMaxLength);
		secondPage.drawText(textChunk, {
			x: 130,
			y: yCoordinate,
			size: 10,
			color: rgb(0, 0, 0) // Black
		});
		yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
	}

	// PARTY/REP
	secondPage.drawText(name, {
		x: 190,
		y: 150,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});

	const thirdPage = pdfDoc.getPages()[2];
	thirdPage.drawText(getFormattedDate()[0], {
		x: 100,
		y: 75,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	thirdPage.drawText(name, {
		x: 105,
		y: 122,
		size: 10,
		color: rgb(0, 0, 0) // Black
	});
	// Save the modified PDF
	return await pdfDoc.save();
}
