import { read } from '$app/server';
import templateFile from './template.xlsx?url';
import XlsxTemplate from 'xlsx-template';

export const generateInterviewSheet = async (data: any) => {
	const file = await read(templateFile).arrayBuffer();
	const template = new XlsxTemplate(Buffer.from(file));

	template.substitute(1, data);

	return template.generate({ type: 'base64' });
};
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
function getFormattedDate(): [string, string, string, number] {
  const now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
async function addTextToPDF() {
  const values = getFormattedDate();
  const monthYear = `December ${values[3]}`;
  const region = "CAR";
  const districtProvince = "Baguio City, Benguet del Norte";
  const district = "San Jose del Monte,";
  const province = "San Jose del Monte";
  const controlNo = "2403-12341";
  // Client data
  const religion = "Christianity";
  const citizenship = "Filipino";
  const name = "Juan Dela Cruz";
  const age = 35;
  const address = "123 Main Street, Metro Manila";
  const email = "juan@example.com";
  const individualMonthlyIncome = 25000;
  const detainedSince = "2023-01-15";
  const civilStatus: string = "Widow/Widower";
  const sex = "Male";
  const educationalAttainment = "Bachelor's Degree";
  const languageDialect = "Tagalog";
  const contactNo = "09123456789";
  const spouse = "Maria Dela Cruz";
  const addressOfSpouse = "123 Main Street, Metro Manila";
  const spouseContactNo = "09883291238";
  const placeOfDetention = "Metro Manila Detention Center";

  // Interviewee data
  const intervieweeName = "Adolph Blaine Charles David Earl Frederick";
  const intervieweeAddress = "456 Elm Street, Metro Manila";
  const relationshipToClient = "Friend";
  const intervieweeAge = 35;
  const intervieweeSex = "Male";
  const intervieweeCivilStatus = "Married";
  const intervieweeContactNo = "09876543210";
  const intervieweeEmail = "pedro@example.com";
  const natureOfRequest: string = "Others";
  const otherNatureOfRequest = "Jail Visitation";
  const PDLStatus: string = "No"; // Set initial value to "No"
  const natureOfTheCase: string = "Criminal";
  const caseSpecs: string = "RA 1234125323";

  const clientClasses: (string | Record<string, string>)[] = [
    "Drug-Related Duty",
    "Tenant in Agrarian Case",
    "OFW - Land-based",
    "OFW - Sea-based",
    "Victim of Terrorism (R.A. No. 9372)",
    "Victim of Torture (R.A. No. 9745)",
    "Victim of Trafficking (R.A. No. 9208)",
    "Former Rebels (FRs) and Former Violent Extremists (FVEs)",
    "Refugee/Evacuee",
    { "Indigenous People": "Quezon Hill, Baguio" },
  ];

  const clientInvolvement: (string | Record<string, string>)[] = [
    "Plaintiff",
    "Accused",
    "Defendant",
    "Oppositor",
    "Petitioner",
    "Respondent",
    "Complainant",
    "Accused",
    { Others: "Quezon Hill, Baguio" },
  ];
  const adverseParty: string[] = [
    "Plaintiff/Complainant",
    "Defendant/Respondent/Accused",
    "Oppositor/Others",
  ];
  const adversePartyName =
    "Bador et al., asldj alsdlkjas aslkdjas lsdajsdlj lasdljasljd lasdjasdl jasldjasldj";
  const adversePartyAddress =
    "addressasjkdaskl alksjdaskj lasjdlaksj laksjdlasjd lasjdalsdj lasjdasljd lasdjasdlj";
  const factsOfTheCase =
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
  const natureOfOffence =
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
  const courtPendingStatus: string = "No";
  const titleOfCaseDocketNum =
    "al;skdjasj asl;kdjasjld al;ksjdasjlkdasdasd asdasd asdas asdasdas asdasd al;jsdjlasd";
  const courtBodyTribunal =
    "aslkdjaslkj alskjdlkjads ljkasdljas lkajsdljdsa lajsdljads lasjdjldas lkjasljd jlaksdjlas ljasddljaljsd lajsasldjasl ljasdjlasldjasdljdjsl";
  const proofOfIndegency: (string | Record<string, string>)[] = [
    "Income Tax Return",
    "Certification from Barangay",
    "Certification from DSWD",
    { Others: "Quezon Hill, Baguio" },
  ];
  // Load existing PDF
  const pdfBytes = fs.readFileSync("../form_template/information-sheet.pdf");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  // Get the first page of the PDF
  const firstPage = pdfDoc.getPages()[0];

  // Add text to the first page
  firstPage.drawText(controlNo, {
    x: 90,
    y: 863,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(values[0], {
    x: 70,
    y: 875,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(region, {
    x: 250,
    y: 895,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(districtProvince, {
    x: 250,
    y: 885,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(monthYear, {
    x: 300,
    y: 152,
    size: 8.5,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(district, {
    x: 380,
    y: 162,
    size: 8.5,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(province, {
    x: 380,
    y: 152,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(values[2].toString(), {
    x: 250,
    y: 152,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(monthYear, {
    x: 332,
    y: 212,
    size: 8.5,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(district, {
    x: 405,
    y: 220,
    size: 8.5,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(province, {
    x: 405,
    y: 212,
    size: 8.5,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(values[2].toString(), {
    x: 285,
    y: 212,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  firstPage.drawText(name, {
    x: 70,
    y: 705,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(age.toString(), {
    x: 320,
    y: 705,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(sex, {
    x: 370,
    y: 705,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  firstPage.drawText(religion, {
    x: 100,
    y: 691,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(educationalAttainment, {
    x: 390,
    y: 691,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(citizenship, {
    x: 100,
    y: 677,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(languageDialect, {
    x: 390,
    y: 677,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(address, {
    x: 100,
    y: 663,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(contactNo, {
    x: 390,
    y: 663,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(email, {
    x: 100,
    y: 649,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(individualMonthlyIncome.toString(), {
    x: 150,
    y: 635,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  if (PDLStatus === "Yes") {
    // yes detained
    firstPage.drawRectangle({
      x: 96,
      y: 622,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(detainedSince, {
      x: 100,
      y: 607,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
    firstPage.drawText(placeOfDetention, {
      x: 390,
      y: 607,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  } else if (PDLStatus === "No") {
    // no detained
    firstPage.drawRectangle({
      x: 130,
      y: 622,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  }
  if (natureOfRequest === "Legal Advice") {
    // legal advice
    firstPage.drawRectangle({
      x: 34,
      y: 772,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (natureOfRequest === "Legal Documentation") {
    // legal documentation
    firstPage.drawRectangle({
      x: 203,
      y: 772,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (
    natureOfRequest === "Representation in Court/Quasi-Judicial Bodies"
  ) {
    // rep in court
    firstPage.drawRectangle({
      x: 335,
      y: 772,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (natureOfRequest === "Inquest Legal Assistance") {
    // inquest legal assist
    firstPage.drawRectangle({
      x: 34,
      y: 760,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (natureOfRequest === "Mediation/Conciliation") {
    // mediation
    firstPage.drawRectangle({
      x: 203,
      y: 760,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (natureOfRequest === "Administration of Oath") {
    // admin of oath
    firstPage.drawRectangle({
      x: 335,
      y: 760,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
  } else if (natureOfRequest === "Others") {
    // others
    firstPage.drawRectangle({
      x: 34,
      y: 748,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(otherNatureOfRequest, {
      x: 80,
      y: 748,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  }

  if (natureOfTheCase === "Criminal") {
    // CRIMINAL
    firstPage.drawRectangle({
      x: 34,
      y: 504,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(caseSpecs, {
      x: 85,
      y: 504,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  } else if (natureOfTheCase === "Administrative") {
    // ADMINISTRATIVE
    firstPage.drawRectangle({
      x: 34,
      y: 490,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(caseSpecs, {
      x: 105,
      y: 490,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  } else if (natureOfTheCase === "Appealed") {
    // APPEALED
    firstPage.drawRectangle({
      x: 206,
      y: 490,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(caseSpecs, {
      x: 265,
      y: 490,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  } else if (natureOfTheCase === "Civil") {
    // CIVIL
    firstPage.drawRectangle({
      x: 206,
      y: 504,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(caseSpecs, {
      x: 265,
      y: 504,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  } else if (natureOfTheCase === "Labor") {
    // LABOR
    firstPage.drawRectangle({
      x: 370,
      y: 504,
      width: 7,
      height: 7,
      color: rgb(0, 0, 0),
      borderColor: undefined, // No border
    });
    firstPage.drawText(caseSpecs, {
      x: 420,
      y: 504,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
  }

  for (const clientClass of clientClasses) {
    if (typeof clientClass === "string") {
      if (clientClass === "Child in Conflict with the Law") {
        firstPage.drawRectangle({
          x: 34,
          y: 458,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Senior Citizen") {
        // SENIOR
        firstPage.drawRectangle({
          x: 205,
          y: 458,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Woman Client") {
        // Woman
        firstPage.drawRectangle({
          x: 34,
          y: 444,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "VAWC Victim") {
        // VAWC CLIENT
        firstPage.drawRectangle({
          x: 105,
          y: 444,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Refugee/Evacuee") {
        // REFUGEE
        firstPage.drawRectangle({
          x: 205,
          y: 444,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Law Enforcer") {
        // LAW ENFORCER
        firstPage.drawRectangle({
          x: 34,
          y: 430,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Drug-Related Duty") {
        // DRUG DUTY
        firstPage.drawRectangle({
          x: 105,
          y: 430,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Tenant in Agrarian Case") {
        // AGRAGRIAN
        firstPage.drawRectangle({
          x: 205,
          y: 430,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "OFW - Land-based") {
        // OFW LAND BASE
        firstPage.drawRectangle({
          x: 34,
          y: 416,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "OFW - Sea-based") {
        // OFW SEA BASE
        firstPage.drawRectangle({
          x: 34,
          y: 402,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Victim of Terrorism (R.A. No. 9372)") {
        // TERRORISM
        firstPage.drawRectangle({
          x: 205,
          y: 416,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Victim of Torture (R.A. No. 9745)") {
        // TORTURE
        firstPage.drawRectangle({
          x: 205,
          y: 402,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (clientClass === "Victim of Trafficking (R.A. No. 9208)") {
        // TRAFFICKING
        firstPage.drawRectangle({
          x: 205,
          y: 388,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (
        clientClass ===
        "Former Rebels (FRs) and Former Violent Extremists (FVEs)"
      ) {
        // FR FVE
        firstPage.drawRectangle({
          x: 34,
          y: 388,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      } else if (
        clientClass === "Petitioner for Voluntary Rehabilatation (Drugs)"
      ) {
        // DRUGS
        firstPage.drawRectangle({
          x: 366,
          y: 388,
          width: 7,
          height: 7,
          color: rgb(0, 0, 0),
          borderColor: undefined, // No border
        });
      }
    } else if (
      typeof clientClass === "object" &&
      clientClass.hasOwnProperty("PWD")
    ) {
      // PWD
      firstPage.drawRectangle({
        x: 366,
        y: 402,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      firstPage.drawText(clientClass["PWD"], {
        x: 473,
        y: 402,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    } else if (
      typeof clientClass === "object" &&
      clientClass.hasOwnProperty("Foreign National")
    ) {
      // FOREIGN
      firstPage.drawRectangle({
        x: 366,
        y: 458,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      firstPage.drawText(clientClass["Foreign National"], {
        x: 456,
        y: 458,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    } else if (
      typeof clientClass === "object" &&
      clientClass.hasOwnProperty("Urban Poor")
    ) {
      // URBAN
      firstPage.drawRectangle({
        x: 366,
        y: 444,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      firstPage.drawText(clientClass["Urban Poor"], {
        x: 430,
        y: 444,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    } else if (
      typeof clientClass === "object" &&
      clientClass.hasOwnProperty("Rural Poor")
    ) {
      // RURAL POOR
      firstPage.drawRectangle({
        x: 366,
        y: 430,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      firstPage.drawText(clientClass["Rural Poor"], {
        x: 430,
        y: 430,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    } else if (
      typeof clientClass === "object" &&
      clientClass.hasOwnProperty("Indigenous People")
    ) {
      // INDIGENOUS
      firstPage.drawRectangle({
        x: 366,
        y: 416,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      firstPage.drawText(clientClass["Indigenous People"], {
        x: 455,
        y: 416,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    }
  }

  // PARTY/REP
  firstPage.drawText(name, {
    x: 200,
    y: 365,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  firstPage.drawText(civilStatus, {
    x: 473,
    y: 705,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  if (civilStatus === "Married" || civilStatus === "Widow/Widower") {
    // Married or Widow/Widower
    firstPage.drawText(spouse, {
      x: 390,
      y: 649,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
    firstPage.drawText(addressOfSpouse, {
      x: 390,
      y: 635,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });
    firstPage.drawText(spouseContactNo, {
      x: 390,
      y: 621,
      size: 10,
      color: rgb(0, 0, 0), // Black
    });

    if (civilStatus === "Married") {
      // Married
      firstPage.drawRectangle({
        x: 298,
        y: 294,
        width: 5,
        height: 5,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
    } else if (civilStatus === "Widow/Widower") {
      // Widow/Widower
      firstPage.drawRectangle({
        x: 469,
        y: 294,
        width: 5,
        height: 5,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
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
      borderColor: undefined, // No border
    });
  }

  firstPage.drawText(intervieweeName, {
    x: 70,
    y: 573,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(intervieweeAge.toString(), {
    x: 320,
    y: 573,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(intervieweeSex, {
    x: 370,
    y: 573,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(intervieweeCivilStatus, {
    x: 473,
    y: 573,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  firstPage.drawText(intervieweeAddress, {
    x: 73,
    y: 559,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(intervieweeContactNo, {
    x: 345,
    y: 559,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(relationshipToClient, {
    x: 125,
    y: 545,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(intervieweeEmail, {
    x: 320,
    y: 545,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  firstPage.drawText(districtProvince, {
    x: 25,
    y: 330,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(name, {
    x: 100,
    y: 294,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(spouse, {
    x: 350,
    y: 294,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(address, {
    x: 100,
    y: 282,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  firstPage.drawText(individualMonthlyIncome.toString(), {
    x: 230,
    y: 246,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  const secondPage = pdfDoc.getPages()[1];
  for (const item of clientInvolvement) {
    if (typeof item === "string") {
      switch (item) {
        case "Plaintiff":
          secondPage.drawRectangle({
            x: 67,
            y: 928,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Accused":
          secondPage.drawRectangle({
            x: 213,
            y: 902,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Defendant":
          secondPage.drawRectangle({
            x: 213,
            y: 928,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Oppositor":
          secondPage.drawRectangle({
            x: 362,
            y: 928,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Petitioner":
          secondPage.drawRectangle({
            x: 67,
            y: 915,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Respondent":
          secondPage.drawRectangle({
            x: 213,
            y: 915,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Complainant":
          secondPage.drawRectangle({
            x: 67,
            y: 902,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
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
        borderColor: undefined, // No border
      });
      const key = Object.keys(item)[0];
      secondPage.drawText(item[key], {
        x: 410,
        y: 915,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    }
  }
  for (const item of adverseParty) {
    if (typeof item === "string") {
      switch (item) {
        case "Plaintiff/Complainant":
          secondPage.drawRectangle({
            x: 67,
            y: 871,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Defendant/Respondent/Accused":
          secondPage.drawRectangle({
            x: 67,
            y: 858,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
        case "Oppositor/Others":
          secondPage.drawRectangle({
            x: 293,
            y: 871,
            width: 7,
            height: 7,
            color: rgb(0, 0, 0),
            borderColor: undefined, // No border
          });
          break;
      }
    }
  }
  for (const item of proofOfIndegency) {
    if (item === "Income Tax Return") {
      secondPage.drawRectangle({
        x: 33,
        y: 229,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
    } else if (item === "Certification from Barangay") {
      secondPage.drawRectangle({
        x: 144,
        y: 229,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
    } else if (item === "Certification from DSWD") {
      secondPage.drawRectangle({
        x: 295,
        y: 229,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
    } else if (typeof item === "object" && item.hasOwnProperty("Others")) {
      secondPage.drawRectangle({
        x: 415,
        y: 229,
        width: 7,
        height: 7,
        color: rgb(0, 0, 0),
        borderColor: undefined, // No border
      });
      secondPage.drawText(item["Others"], {
        x: 425,
        y: 217,
        size: 10,
        color: rgb(0, 0, 0), // Black
      });
    }
  }
  if (courtPendingStatus === "Yes") {
    secondPage.drawText("X", {
      x: 322,
      y: 358,
      size: 12,
      color: rgb(1, 1, 1), // Black
    });
  } else if (courtPendingStatus === "No") {
    secondPage.drawText("X", {
      x: 357,
      y: 358,
      size: 12,
      color: rgb(1, 1, 1), // Black
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
        color: rgb(0, 0, 0), // Black
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
      color: rgb(0, 0, 0), // Black
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
      color: rgb(0, 0, 0), // Black
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
      color: rgb(0, 0, 0), // Black
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
      color: rgb(0, 0, 0), // Black
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
      color: rgb(0, 0, 0), // Black
  });
  yCoordinate -= 13; // Decrease y-coordinate by 13 for the next line
}

  // PARTY/REP
  secondPage.drawText(name, {
    x: 190,
    y: 150,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });

  const thirdPage = pdfDoc.getPages()[2];
  thirdPage.drawText(getFormattedDate()[0], {
    x: 100,
    y: 75,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  thirdPage.drawText(name, {
    x: 105,
    y: 122,
    size: 10,
    color: rgb(0, 0, 0), // Black
  });
  // Save the modified PDF
  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync("../info-sheet.pdf", modifiedPdfBytes);
}

addTextToPDF()
  .then(() => {
    console.log("Text added to PDF");
  })
  .catch((error) => {
    console.error("Error adding text to PDF:", error);
  });
