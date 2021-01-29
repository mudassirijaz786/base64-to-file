const fs = require("fs");
const xml2js = require("xml2js");

function xmlToObject(fileName = "/foo.xml") {
  var parser = new xml2js.Parser();
  fs.readFile(__dirname + fileName, function (err, data) {
    parser.parseString(data, function (err, result) {
      // CASE

      console.log("**** CASE STARTED **** \n");
      const { TransType } = result.TXLife.TXLifeRequest[0];
      console.log("caseType: ", TransType[0]._);
      console.log("\n**** CASE ENDED ****\n");

      // REQUEST

      console.log("**** REQUEST STARTED **** \n");
      const { TXLifeRequest } = result.TXLife;
      console.log(TXLifeRequest);
      console.log("\n**** REQUEST ENDED ****");

      // CONTACT INFO

      console.log("\n**** CONTACT INFO STARTED **** \n");
      const {
        AreaCode,
        DialNumber,
      } = result.TXLife.TXLifeRequest[0].OLifE[0].Party[0].Phone[0];
      console.log(`phoneNumber:  ${AreaCode[0]} ${DialNumber}`);
      console.log("\n**** CONTACT INFO ENDED ****");

      // ADDRESS

      console.log("\n**** ADDRESS STARTED **** \n");
      const {
        Line1,
        City,
        AddressStateTC,
        AddressCountryTC,
      } = result.TXLife.TXLifeRequest[0].OLifE[0].Party[0].Address[0];
      console.log("streetAddress: ", Line1[0]);
      console.log("city: ", City[0]);
      console.log("state: ", AddressStateTC[0]._);
      console.log("country: ", AddressCountryTC[0]._);
      console.log("\n**** ADDRESS ENDED **** \n");

      // ATTACHMENTS

      console.log("**** ATTACHMENTS STARTED **** \n");
      const {
        MimeTypeTC,
        AttachmentData,
        TransferEncodingTypeTC,
      } = result.TXLife.TXLifeRequest[0].OLifE[0].Holding[0].Policy[0].RequirementInfo[0].Attachment[0];
      console.log("type: ", MimeTypeTC[0]._);
      // Converting base64 into file/pdf/image etc
      base64_decode(`${AttachmentData[0]}`, "copy.pdf");
      console.log("encoded: ", TransferEncodingTypeTC[0]._);
      console.log("\n**** ATTACHMENTS ENDED **** \n");

      // PARTY

      console.log("**** PARTY STARTED **** \n");
      const { Party, Relation } = result.TXLife.TXLifeRequest[0].OLifE[0];
      let insuredParty = Party.filter((party) => party["$"].id === "Party_1");
      let myParty = [];
      for (let i = 0; i < Relation.length; i++) {
        const relations = Relation[i];
        let relationRoleCodes = relations["RelationRoleCode"];
        for (let j = 0; j < relationRoleCodes.length; j++) {
          const codes = relationRoleCodes[j];
          if (codes._ === "Insured") {
            if (relations["$"].RelatedObjectID === insuredParty[0]["$"].id) {
              myParty = insuredParty;
            }
          }
        }
      }
      const { Person, GovtID, Address, GovtIDTC } = myParty[0];
      console.log("firstName: ", Person[0].FirstName[0]);
      console.log("lastName: ", Person[0].LastName[0]);
      // console.log(Person[0].Occupation[0]); // It is empty
      console.log("dob: ", Person[0].BirthDate[0]);
      console.log("gender", Person[0].Gender[0]._);
      console.log("socialSecurityNumber: ", GovtID[0]);
      console.log("ssnTypeCode: ", GovtIDTC[0]._);
      console.log("citizenship: ", Address[0].City[0]);
      console.log("\n**** PARTY ENDED **** \n");

      // POLICY

      console.log("**** POLICY STARTED **** \n");
      const {
        PolNumber,
        ApplicationInfo,
        ProductType,
        RequirementInfo,
      } = result.TXLife.TXLifeRequest[0].OLifE[0].Holding[0].Policy[0];
      console.log("number: ", PolNumber[0]);
      console.log("productType: ", ProductType[0]._);
      console.log("trackingId: ", ApplicationInfo[0].TrackingID[0]);
      console.log(
        "jurisdiction: ",
        ApplicationInfo[0].ApplicationJurisdiction[0]._
      );
      console.log("signedDate: ", ApplicationInfo[0].SignedDate[0]);
      console.log(
        "requirementInfoUniqueId: ",
        RequirementInfo[0].RequirementInfoUniqueID[0]
      );
      console.log(
        "requirementDetails: ",
        RequirementInfo[0].RequirementDetails[0]
      );
      console.log("\n**** POLICY ENDED **** \n");

      const cases = {
        caseType: "",
        addresses: [],
        contactInfos: [],
        subject: {},
        policy: {},
        request: {},
        // attachments ???
      };

      cases.caseType = TransType[0]._;

      // OBJECT

      console.log("**** OBJECT STARTED **** \n");
      console.log(cases);
      console.log("\n**** OBJECT STARTED **** \n");
    });
  });
}

xmlToObject();

function base64_decode(base64str, file) {
  var bitmap = new Buffer(base64str, "base64");
  fs.writeFileSync(file, bitmap);
  console.log("**** File created from base64 encoded string ****");
}
