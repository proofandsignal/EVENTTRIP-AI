import {evaluateReferral} from "../src/core/referral-preflight.js";
import {VERIFIED_PARTNER_PERMISSIONS} from "../src/data/partner-permissions.js";
const now=Date.parse("2026-10-24T09:00:00Z");
const denied=evaluateReferral({now});
console.log("PUBLIC REPOSITORY DEFAULT:",denied.status,denied.reason);
console.log("Verified program permissions:",VERIFIED_PARTNER_PERMISSIONS.length);
// Reserved .example addresses only. No outgoing requests or actual affiliate links.
const project={id:"SYNTHETIC_PROJECT",status:"VERIFIED",channel:"website",websiteUrl:"https://eventtrip.example"};
const partner={projectId:project.id,programId:"SYNTHETIC_PROGRAM",status:"APPROVED",termsAccepted:true,
  approvalEvidenceRef:"synthetic-only",approvedHosts:["link.partner.example"],allowedLinkTypes:["DEEPLINK"]};
const link={projectId:project.id,programId:partner.programId,status:"VERIFIED",type:"DEEPLINK",mode:"LINK_ONLY",
  verificationEvidenceRef:"synthetic-only",verifiedAt:"2026-10-24T08:00:00Z",
  bookingUrl:"https://link.partner.example/synthetic-placeholder"};
const simulation=evaluateReferral({project,partner,link,now});
console.log("SYNTHETIC POLICY TEST, NOT PARTNER APPROVAL:",simulation.status);
if(denied.ready||!simulation.ready||VERIFIED_PARTNER_PERMISSIONS.length)process.exitCode=1;
