/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgreementTemplate } from '../types';

export const AGREEMENT_TEMPLATES: AgreementTemplate[] = [
  {
    id: 'model-release',
    title: 'Model Release Form (Standard)',
    category: 'Release',
    description: 'Grant of permission from model to photographer to use and license photographs for commercial, promotional, and social media uses.',
    fieldsRequired: ['photographerName', 'companyName', 'modelName', 'date', 'location'],
    content: {
      en: `MODEL RELEASE AGREEMENT

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Model Name: {{MODEL}}
Shoot Date: {{DATE}}
Shoot Location: {{LOCATION}}

For valuable consideration received, I hereby grant {{PHOTOGRAPHER}} and their legal representatives and assigns, the irrevocable and unrestricted right to use and publish photographs of me, or in which I may be included, for editorial, trade, advertising, and any other purpose and in any manner and medium; and to alter and composite the same without restriction and without my inspection or approval.

I hereby release {{PHOTOGRAPHER}} and their legal representatives and assigns from all claims and liability relating to said photographs.

This agreement shall be binding upon me, my heirs, legal representatives, and assigns. I acknowledge that I have read this release before signing, and I fully understand the contents, meaning, and impact of this release.`,
      af: `MODELVRYWARINGSOOREENKOMS

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Model Naam: {{MODEL}}
Sessie Datum: {{DATE}}
Sessie Ligging: {{LOCATION}}

Vir waardevolle vergoeding ontvang, verleen ek hiermee aan {{PHOTOGRAPHER}} en hul wettige verteenwoordigers en opvolgers, die onherroeplike en onbeperkte reg om foto's van my te gebruik en te publiseer vir redaksionele, handels-, advertensie- en enige ander doeleindes, op enige wyse en in enige medium; en om dieselfde te wysig sonder beperking en sonder my inspeksie of goedkeuring.

Ek vrywaar hiermee {{PHOTOGRAPHER}} en hul wettige verteenwoordigers en opvolgers van alle eise en aanspreeklikheid wat verband hou met genoemde foto's.

Hierdie ooreenkoms is bindend op my, my erfgename, wettige verteenwoordigers en opvolgers. Ek erken dat ek hierdie vrystelling gelees het voor ondertekening, en dat ek die inhoud en impak ten volle verstaan.`,
      zu: `ISIVUMELWANO SOKUK KHULULWA KWEMODELI

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Igama leModeli: {{MODEL}}
Usuku Lomsebenzi: {{DATE}}
Indawo Yomsebenzi: {{LOCATION}}

Ngembuyiselo ebalulekile etholiwe, ngipha igunya elingaguquki nalingenamkhawulo ku-{{PHOTOGRAPHER}} kanye nabamele bona ngokomthetho, ukuthi basebenzise futhi bashicilele izithombe zami, ngezinhloso zokukhangisa, zokuhweba, nobunye ubuciko kunoma iyiphi indlela nendlela yokuxhumana; ngaphandle kokuhlola noma kokugunyaza kwami.

Ngikhulula u-{{PHOTOGRAPHER}} kanye nabamele bona ngokomthetho kuzo zonke izimangalo nezikweletu eziphathelene nalezi zithombe ezishiwo.

Lolu sivumelwano sizobophezela mina, izindlalifa zami, nabamele mina ngokomthetho. Ngiyavuma ukuthi ngisifundile lesi sivumelwano ngaphambi kokusisayina, futhi ngiyayiqonda imiphumela yakhona.`
    }
  },
  {
    id: 'minor-release',
    title: 'Minor Model Release',
    category: 'Release',
    description: 'Required when the model is under 18 years old. Requires signature of a parent or legal guardian.',
    fieldsRequired: ['photographerName', 'companyName', 'modelName', 'parentName', 'parentRelationship', 'date', 'location'],
    content: {
      en: `MINOR MODEL RELEASE AGREEMENT
(For Models Under 18 Years of Age)

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Minor Model Name: {{MODEL}}
Parent / Legal Guardian Name: {{PARENT_GUARDIAN}}
Relationship to Minor: {{GUARDIAN_RELATIONSHIP}}
Shoot Date: {{DATE}}
Shoot Location: {{LOCATION}}

I am the parent or legal guardian of the minor named above. For valuable consideration received, I hereby grant to {{PHOTOGRAPHER}} and their legal representatives and assigns, the irrevocable and unrestricted right to use and publish photographs of the minor, or in which the minor may be included, for editorial, trade, advertising, and any other purpose.

I release {{PHOTOGRAPHER}} and their legal representatives from all claims and liability relating to said photographs. 

I warrant that I am of full legal age and have the right to contract for the minor in this matter. I have read this release before signing, and I fully understand the contents.`,
      af: `MINDERJARIGE MODELVRYWARINGSOOREENKOMS
(Vir Modelle Onder 18 Jaar Oud)

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Minderjarige Model Naam: {{MODEL}}
Ouer / Voog Naam: {{PARENT_GUARDIAN}}
Verhouding tot Minderjarige: {{GUARDIAN_RELATIONSHIP}}
Sessie Datum: {{DATE}}
Sessie Ligging: {{LOCATION}}

Ek is die ouer of wettige voog van die minderjarige hierbo genoem. Vir waardevolle vergoeding ontvang, verleen ek hiermee aan {{PHOTOGRAPHER}} die onherroeplike en onbeperkte reg om foto's van die minderjarige te gebruik en te publiseer vir enige redaksionele, handels-, of advertensiedoeleindes.

Ek vrywaar {{PHOTOGRAPHER}} en hul wettige verteenwoordigers van alle eise en aanspreeklikheid. Ek waarborg dat ek meerderjarig is en die reg het om namens die minderjarige te kontrakteer.`,
      zu: `ISIVUMELWANO SOKUK KHULULWA KWEMODELI ENYANE
(Yemodeli engaphansi kweminyaka eyi-18)

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Igama Lomntwana: {{MODEL}}
Igama Lomzali / Umgadi: {{PARENT_GUARDIAN}}
Ubudlelwano Nomntwana: {{GUARDIAN_RELATIONSHIP}}
Usuku: {{DATE}}
Indawo: {{LOCATION}}

Ngingumzali noma umgadi osemthethweni wengane eshiwo ngenhla. Ngipha igunya elingaguquki ku-{{PHOTOGRAPHER}} nabamele bona ukusebenzisa izithombe zengane ngezinhloso zokukhangisa nezokushicilela.

Ngikhulula u-{{PHOTOGRAPHER}} kuzo zonke izimangalo. Ngiyavuma ukuthi nginamalungelo aphelele okusayina egameni lomntwana futhi ngisifundile lesi sivumelwano.`
    }
  },
  {
    id: 'property-release',
    title: 'Property Release Form',
    category: 'Release',
    description: 'Get written permission from property owners (homes, Airbnbs, offices, cars, artwork) to use shoot assets commercially.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'location', 'date'],
    content: {
      en: `PROPERTY RELEASE AGREEMENT

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Property Owner / Authorized Agent: {{CLIENT}}
Property Description/Location: {{LOCATION}}
Shoot Date: {{DATE}}

For valuable consideration received, I hereby grant to {{PHOTOGRAPHER}} and their legal representatives and assigns, the irrevocable and unrestricted right to photograph, video, and record the property described above, and to publish, reproduce, and license those images in any medium for advertising, commercial use, and promotion.

I warrant that I am the sole owner or authorized representative of the property, that I have the legal capacity to sign this release, and that no other consent is required. I release the photographer from any claims or liability related to the use of these images.`,
      af: `EIENDOMSVRYWARINGSOOREENKOMS

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Eiendoms-Eienaar / Gemagtigde Agent: {{CLIENT}}
Eiendom Beskrywing/Ligging: {{LOCATION}}
Sessie Datum: {{DATE}}

Vir waardevolle vergoeding ontvang, verleen ek hiermee aan {{PHOTOGRAPHER}} die onherroeplike en onbeperkte reg om die eiendom hierbo beskryf te fotografeer en te verfilm, en om daardie beelde in enige medium te publiseer vir kommersiële en promosiedoeleindes.

Ek waarborg dat ek die eienaar of gemagtigde agent is en die reg het om hierdie vrystelling te teken.`,
      zu: `ISIVUMELWANO SOKUK KHULULWA KWEMPAHLA

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Umnikazi Wempahla / Umenzeli Ogunyaziwe: {{CLIENT}}
Incazelo Yempahla / Indawo: {{LOCATION}}
Usuku Lomsebenzi: {{DATE}}

Ngipha igunya eligcwele ku-{{PHOTOGRAPHER}} ukuthi athwebule, aqophe, futhi ashicilele izithombe zale mpahla ngenhla ngezinhloso zokukhangisa nokuhweba.

Ngiyanika isiqiniseko sokuthi ngingumnikazi osemthethweni wale mpahla futhi nginamalungelo okusayina lesi sivumelwano.`
    }
  },
  {
    id: 'service-agreement',
    title: 'Photographer Service Agreement',
    category: 'Agreement',
    description: 'Service contract detailing shoot expectations, payment terms, deposit, cancellation policy, copyright, and delivery timeframe.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date', 'location', 'price'],
    content: {
      en: `PHOTOGRAPHY SERVICE AGREEMENT

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Client Name: {{CLIENT}}
Shoot Date: {{DATE}}
Location: {{LOCATION}}
Total Fee: R{{PRICE}}

1. SERVICES: The Photographer agrees to provide professional photography services as agreed.
2. FEES & PAYMENT: A non-refundable booking deposit is required to secure the date. The remaining balance must be paid before or on the day of the shoot.
3. CANCELLATION: Cancellations made less than 48 hours before the shoot will forfeit the booking deposit.
4. DELIVERY: Edited digital high-resolution images will be delivered within 14 working days via a digital gallery link.
5. COPYRIGHT & USAGE: The Photographer retains copyright of all images. The Client receives a personal use license only. Commercial licensing must be obtained in writing.`,
      af: `FOTOGRAFIE DIENSOOREENKOMS

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Kliënt Naam: {{CLIENT}}
Sessie Datum: {{DATE}}
Ligging: {{LOCATION}}
Totale Fooi: R{{PRICE}}

1. DIENSTE: Die Fotograaf stem in om professionele fotografiedienste te lewer soos ooreengekom.
2. FOOIE & BETALING: 'n Nie-terugbetaalbare deposito word vereis. Die oorblywende balans moet voor of op die dag van die sessie betaal word.
3. KANSELLASIE: Kansellasies minder as 48 uur voor die sessie gemaak, sal die deposito verbeur.
4. AFLEWERING: Geredigeerde beelde sal binne 14 werksdae via 'n digitale skakel afgelewer word.
5. KOPIEREG: Die Fotograaf behou kopiereg. Die Kliënt ontvang slegs lisensie vir persoonlike gebruik.`,
      zu: `ISIVUMELWANO SENKONZO YOKUTHWEBULA

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Igama Lendawo / Ikhasimende: {{CLIENT}}
Usuku Lomsebenzi: {{DATE}}
Indawo: {{LOCATION}}
Inkokhelo Ephelele: R{{PRICE}}

1. IZENZO: Uthwebuli uvuma ukunikeza izinkonzo zokuthwebula ezisezingeni eliphezulu.
2. INKOKHELO: Imali yokubhuka engabuyiswa iyadingeka. Enye imali kumele ikhokhwe ngaphambi noma ngosuku lomsebenzi.
3. UKUKHANSELA: Uma ukhansela ngaphansi kwezikhathi eziyi-48 umsebenzi ungakaqali, imali yediphozi iyalahleka.
4. UKULETHWA: Izithombe ezilungisiwe zizolethwa zingakapheli izinsuku zomsebenzi ezingu-14 ngesixhumanisi sewebhu.
5. ILUNGELO LOMTHWETHULI: Uthwebuli ugcina amalungelo azo zonke izithombe.`
    }
  },
  {
    id: 'tfp-agreement',
    title: 'TFP (Trade For Portfolio) Agreement',
    category: 'Agreement',
    description: 'Collaboration contract between photographer and model where no cash is exchanged, and both receive edited images for self-promotion.',
    fieldsRequired: ['photographerName', 'companyName', 'modelName', 'date', 'location'],
    content: {
      en: `TFP (TRADE FOR PORTFOLIO) AGREEMENT

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Model Name: {{MODEL}}
Shoot Date: {{DATE}}
Shoot Location: {{LOCATION}}

The Photographer and the Model agree to collaborate on this shoot on a Trade-For-Portfolio (TFP) basis.
1. COMPENSATION: No monetary payment will be exchanged between the parties.
2. DELIVERABLES: The Photographer agrees to deliver at least 10 high-resolution edited digital files to the Model within 14 days of the shoot.
3. USAGE: Both parties may use the images for self-promotion, social media, portfolios, and websites.
4. COMMERCIAL RESTRICTIONS: Neither party may sell, license, or commercially exploit these images without explicit prior written consent from the other party.
5. CREDIT: When posting images online, both parties agree to tag/credit each other.`,
      af: `TFP (RUIL VIR PORTFEULJE) OOREENKOMS

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Model Naam: {{MODEL}}
Sessie Datum: {{DATE}}
Ligging: {{LOCATION}}

Die Fotograaf en Model stem in om saam te werk op 'n TFP (Trade-For-Portfolio) basis.
1. VERGOEDING: Geen geldelike betalings word tussen partye gemaak nie.
2. LEWERINGS: Die Fotograaf sal ten minste 10 geredigeerde beelde binne 14 dae aan die Model lewer.
3. GEBRUIK: Albei partye mag die beelde gebruik vir selfpromosie, sosiale media, en portfeuljes.
4. BEPERKINGS: Geen kommersiële verkope word toegelaat sonder skriftelike toestemming nie.`,
      zu: `ISIVUMELWANO SE-TFP (UKUSHINTSHISANA NGEZITHOMBE)

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Igama leModeli: {{MODEL}}
Usuku Lomsebenzi: {{DATE}}
Indawo: {{LOCATION}}

Uthwebuli nemodeli bavumelana ngokusebenzisana ngesisekelo se-TFP (Trade For Portfolio).
1. INKOKHELO: Ayikho imali ezokhokhwa phakathi kwalezi zinhlangothi zombili.
2. OKULINDELEKILE: Uthwebuli uzohlinzeka ngezithombe ezingaphezu kwezi-10 ezilungisiwe zingakapheli izinsuku eziyi-14.
3. UKUSEBENZISA: Bobabili bangasebenzisa izithombe ekuzikhangiseni nasezinkundleni zokuxhumana.
4. UKUBEKELWA IMINGCELE: Akekho ovumeleke ukuthengisa lezi zithombe ngezinhloso zokuhweba ngaphandle kwemvume.`
    }
  },
  {
    id: 'content-creator',
    title: 'Content Creator Agreement',
    category: 'Agreement',
    description: 'Contract specifying deliverables, deadlines, commercial licensing, and social media posting guidelines for influencers and brands.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date', 'price'],
    content: {
      en: `CONTENT CREATOR AGREEMENT

Brand/Agency: {{CLIENT}} (via {{COMPANY}})
Creator/Photographer: {{PHOTOGRAPHER}}
Campaign Date: {{DATE}}
Total Compensation: R{{PRICE}}

1. DELIVERABLES: The Creator agrees to produce and deliver:
   - 3x high-quality commercial Instagram posts
   - 1x Instagram Reel/TikTok video (minimum 15 seconds)
2. TIMELINE: First drafts must be sent for approval by {{DATE}}. Final approved assets must be published according to the campaign schedule.
3. OWNERSHIP & LICENSE: The Brand is granted a non-exclusive, worldwide, 1-year license to use the content for paid advertising and social media. The Creator retains moral rights.
4. EXCLUSIVITY: The Creator will not work with competing brands for 30 days post-campaign.`,
      af: `INHOUDSKEPPER OOREENKOMS

Handelsmerk/Agentskap: {{CLIENT}} (via {{COMPANY}})
Skepper/Fotograaf: {{PHOTOGRAPHER}}
Veldtog Datum: {{DATE}}
Totale Vergoeding: R{{PRICE}}

1. LEWERINGS: Die Skepper stem in om te produseer en te lewer:
   - 3x kommersiële Instagram-plasings
   - 1x Instagram Reel/TikTok-video
2. TYDLYN: Eerste konsepte moet voor {{DATE}} gestuur word vir goedkeuring.
3. LISENSIERING: Handelsmerk kry nie-eksklusiewe, wêreldwye lisensie vir 1 jaar vir sosiale media en betaalde advertensies.`,
      zu: `ISIVUMELWANO SOKWAKHA OKUQUKETHWE

I-Brand/Agency: {{CLIENT}} (via {{COMPANY}})
Umdali/Uthwebuli: {{PHOTOGRAPHER}}
Usuku Lomkhankaso: {{DATE}}
Inkokhelo: R{{PRICE}}

1. OKULETHWAYO: Umdali uvuma ukuletha:
   - Imibhalo emi-3 ye-Instagram yekhwalithi ephezulu
   - Ividiyo eyodwa ye-Instagram Reel noma i-TikTok
2. ISIKHATHI: Izinhlaka zokuqala kufanele zithunyelwe ngaphambi komhlaka-{{DATE}} ukuze zigunyazwe.
3. AMALUNGELO: Uhlobo lunikezwa ilayisense engaxhomekile emhlabeni jikelele yonyaka ongu-1.`
    }
  },
  {
    id: 'licensing-agreement',
    title: 'Image Licensing Agreement',
    category: 'Licensing',
    description: 'Specify terms of image usage: territory, duration, media channels, exclusivity, and transfer limits.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date', 'price'],
    content: {
      en: `IMAGE LICENSING AGREEMENT

Licensor (Photographer): {{PHOTOGRAPHER}} ({{COMPANY}})
Licensee (Client): {{CLIENT}}
Agreement Date: {{DATE}}
License Fee: R{{PRICE}}

1. GRANT OF LICENSE: The Licensor hereby grants the Licensee a non-exclusive, non-transferable license to use the delivered images.
2. PERMITTED MEDIA: Licensee may use the images in digital formats, social media, company website, and printed corporate brochures.
3. EXCLUDED USES: Print advertising, billboards, television, and resale/distribution of the files are strictly prohibited without a separate commercial license extension.
4. TERRITORY & DURATION: This license is valid in South Africa for a duration of 2 years from the date of this agreement.
5. CREDIT: A photographer credit (Photo by {{PHOTOGRAPHER}}) is required wherever reasonable.`,
      af: `BEELDLISENSIERINGSOOREENKOMS

Lisensie-gewer: {{PHOTOGRAPHER}} ({{COMPANY}})
Lisensie-nemer: {{CLIENT}}
Datum: {{DATE}}
Lisensie Fooi: R{{PRICE}}

1. TOESTANNING VAN LISENSIE: Die Lisensie-gewer verleen hiermee 'n nie-eksklusiewe, nie-oordraagbare lisensie.
2. TOEGELATE MEDIA: Digitale formate, sosiale media, korporatiewe webwerf en brosjures.
3. GEBIED & DUUR: Geldig in Suid-Afrika vir 'n duur van 2 jaar vanaf die datum van ooreenkoms.`,
      zu: `ISIVUMELWANO SELAYISENSE YESITHOMBE

Umnikezeli Layisense: {{PHOTOGRAPHER}} ({{COMPANY}})
Utholi-Layisense: {{CLIENT}}
Usuku: {{DATE}}
Imali Ye-layisense: R{{PRICE}}

1. UKUPHWA KWELAYISENSE: Umthwebuli unika ilayisense engadluliselwe komunye umuntu.
2. IZINKUNDLA EZIVUMELEKILE: Izinkundla zokuxhumana, iwebhusayithi yenkampani, nezincwajana ezishicilelwe.
3. INDAWO NESIKHATHI: Lolu layisense lusebenza eNingizimu Afrika isikhathi esiyiminyaka emi-2.`
    }
  },
  {
    id: 'copyright-transfer',
    title: 'Copyright Transfer Agreement',
    category: 'Licensing',
    description: 'Legally assign and sell full ownership of the intellectual property of the images from the photographer to the client.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date', 'price'],
    content: {
      en: `INTELLECTUAL PROPERTY & COPYRIGHT TRANSFER

Transferor (Photographer): {{PHOTOGRAPHER}} ({{COMPANY}})
Transferee (Client): {{CLIENT}}
Transfer Date: {{DATE}}
Consideration/Payment: R{{PRICE}}

For valuable consideration received, the Transferor hereby assigns, transfers, and sells to the Transferee all of the Transferor's right, title, and interest in and to the photography works created on {{DATE}}.

This transfer includes all copyright, the right to modify, distribute, reproduce, license, or sell the works in any media worldwide. The Transferor warrants they are the sole creator and original copyright holder. The Transferor retains the non-exclusive right to use the images solely for personal promotional portfolio purposes.`,
      af: `OUTEURSREG OORDRAG OOREENKOMS

Oordraer (Fotograaf): {{PHOTOGRAPHER}} ({{COMPANY}})
Ontvanger (Kliënt): {{CLIENT}}
Oordrag Datum: {{DATE}}
Vergoeding: R{{PRICE}}

Die Oordraer dra hiermee alle regte, titel, en belange in die fotografiese werke wat op {{DATE}} geskep is, oor aan die Ontvanger. Dit sluit alle outeursreg, die reg om te wysig, versprei en lisensieer in. Die fotograaf behou die reg om beelde slegs vir eie portfeuljedoeleindes te gebruik.`,
      zu: `ISIVUMELWANO SOKUDLULISELA AMALUNGELO OMBHALO

Umdlulisi (Uthwebuli): {{PHOTOGRAPHER}} ({{COMPANY}})
Umdluliselwa (Ikhasimende): {{CLIENT}}
Usuku Lokudlulisa: {{DATE}}
Inkokhelo: R{{PRICE}}

Ngalokhu umdlulisi udlulisela futhi udayisela umdluliselwa wonke amalungelo akhe nobuwena kulezi zithombe ezidalwe ngomhlaka-{{DATE}}. Lokhu kuhlanganisa amalungelo okushicilela, ukushintsha, nokusabalalisa emhlabeni jikelele.`
    }
  },
  {
    id: 'print-release',
    title: 'Print Release Form',
    category: 'Release',
    description: 'Allow clients to print digital images at high resolution anywhere, whilst photographer retains core copyright.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date'],
    content: {
      en: `DIGITAL IMAGE PRINT RELEASE

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Client Name: {{CLIENT}}
Release Date: {{DATE}}

{{PHOTOGRAPHER}} hereby grants the Client named above a non-exclusive, perpetual, personal print release to print high-resolution digital image files delivered to them.

Under this agreement, the Client may print unlimited copies for personal use, framing, gifting, and personal albums. The Client may not use the images for commercial gain, advertising, contests, or resell the files in any format. The original copyright remains with {{PHOTOGRAPHER}}.`,
      af: `DIGITALE AFDRUKVRYSTELLING

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Kliënt Naam: {{CLIENT}}
Datum: {{DATE}}

{{PHOTOGRAPHER}} verleen hiermee aan die Kliënt 'n nie-eksklusiewe, ewige, persoonlike afdrukvrystelling vir hoë-resolusie beelde gelewer. Kliënt mag onbeperkte kopieë druk vir persoonlike gebruik. Geen kommersiële herverkoop word toegelaat nie.`,
      zu: `ISIVUMELWANO SOKUSHICILELA IZITHOMBE

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Igama Lekhasimende: {{CLIENT}}
Usuku: {{DATE}}

U-{{PHOTOGRAPHER}} unika ikhasimende igunya laphakade nelingelona elokuhweba lokushicilela izithombe ezinhle ezilethwe kuye. Ikhasimende lingashicilela amakhophi angenamkhawulo asetshenziswa emakhaya kuphela.`
    }
  },
  {
    id: 'event-notice',
    title: 'Event Photography Notice',
    category: 'Notice',
    description: 'Notice of crowd release for public events, conferences, or weddings notifying attendees that photography is occurring.',
    fieldsRequired: ['photographerName', 'companyName', 'location', 'date'],
    content: {
      en: `EVENT PHOTOGRAPHY & CROWD RELEASE NOTICE

Organizer/Photographer: {{PHOTOGRAPHER}} ({{COMPANY}})
Event Venue: {{LOCATION}}
Date: {{DATE}}

Please be advised that photography and video recording are taking place at this event. By entering these premises, you consent to being photographed, filmed, and/or otherwise recorded.

Your entry constitutes your consent to such photography and recording, and to any use, in any and all media, of your appearance, voice, and name for any purpose in connection with this event and promotional material. If you do not wish to be photographed, please inform the photographer or the event staff.`,
      af: `KENNISGEWING VAN GELEENTHEIDSFOTOGRAFIE

Organiseerder/Fotograaf: {{PHOTOGRAPHER}} ({{COMPANY}})
Plek: {{LOCATION}}
Datum: {{DATE}}

Neem asseblief kennis dat fotografie en video-opnames by hierdie geleentheid plaasvind. Deur hierdie perseel te betree, stem u in dat u gefotografeer en verfilm mag word. U toegang verleen toestemming vir die gebruik van u voorkoms en stem in promosiemateriaal.`,
      zu: `ISAZISO SOKUTHWETSHULWA KWEMICIMBI

Umgqugquzeli/Uthwebuli: {{PHOTOGRAPHER}} ({{COMPANY}})
Indawo: {{LOCATION}}
Usuku: {{DATE}}

Sicela wazi ukuthi ukuthwetshulwa nokurekhodwa kwevidiyo kuyenzeka kulo mcimbi. Ngokungena kule ndawo, uyavuma ukuthi uthwetshulwe futhi urekhodwe. Uma ungathandi ukuthwetshulwa, sicela wazise umthwebuli noma abasebenzi bomcimbi.`
    }
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'Extra',
    description: 'Keep exclusive campaigns, pre-launch products, and high-profile shoots strictly confidential.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'date'],
    content: {
      en: `CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT (NDA)

Disclosing Party: {{CLIENT}} (via {{COMPANY}})
Receiving Party: {{PHOTOGRAPHER}}
Effective Date: {{DATE}}

The parties agree to share proprietary concepts or pre-release commercial items for the sole purpose of executing the photography shoot.
1. CONFIDENTIAL INFORMATION: Any and all images, RAW backups, concepts, product styling, client list, and dates are confidential.
2. OBLIGATIONS: The Photographer agrees not to share, leak, publish, post, or talk about the photographs or confidential data on social media or with third parties prior to the official launch date or without written brand approval.
3. REMEDIES: Violations will lead to immediate contract termination and claim for full commercial damages.`,
      af: `VERTROULIKHEIDSOOREENKOMS (NDA)

Openbarende Party: {{CLIENT}} (via {{COMPANY}})
Ontvangende Party: {{PHOTOGRAPHER}}
Datum: {{DATE}}

Partye stem in om vertroulike konsepte of produkte te deel vir die doeleindes van die fotosessie. Die fotograaf stem in om geen beelde te lek, deel of publiseer voor die amptelike bekendstellingsdatum nie.`,
      zu: `ISIVUMELWANO SOKUGCINA IMFIHLO (NDA)

Oveza Ulwazi: {{CLIENT}} (via {{COMPANY}})
Othola Ulwazi: {{PHOTOGRAPHER}}
Usuku: {{DATE}}

Izinhlangothi zombili zivuma ukwabelana ngolwazi lwemfihlo ngomsebenzi wokuthwebula. Umthwebuli uvuma ukuthi angasabalalisi izithombe noma ukwazisa abantu ngaphambi kokuba umkhankaso uqalwe ngokusemthethweni.`
    }
  },
  {
    id: 'drone-consent',
    title: 'Drone Operations Consent',
    category: 'Extra',
    description: 'Ensure safety compliance and land-owner consent for drone/aerial operations during real estate or wedding shoots.',
    fieldsRequired: ['photographerName', 'companyName', 'location', 'date'],
    content: {
      en: `DRONE OPERATIONS & AERIAL PHOTOGRAPHY CONSENT

Operator: {{PHOTOGRAPHER}} ({{COMPANY}})
Property/Site Owner: {{CLIENT}}
Site Address: {{LOCATION}}
Operation Date: {{DATE}}

I, the undersigned client or property representative, hereby grant consent for drone/aerial photography operations to be conducted on the premises.
1. SAFETY ASSURANCE: Drone operations will be conducted in full compliance with SACAA (South African Civil Aviation Authority) regulations by a competent pilot.
2. PRIVACY & LIABILITY: The operator agrees not to capture images of neighboring private properties. The owner releases the operator from any minor disturbances related to drone flights over open land.`,
      af: `DRONE-OPERASIES EN LUGBEELD TOESTEMMING

Operateur: {{PHOTOGRAPHER}} ({{COMPANY}})
Eienaar/Verteenwoordiger: {{CLIENT}}
Ligging: {{LOCATION}}
Datum: {{DATE}}

Hiermee verleen ek toestemming dat drone-operasies en lugfotografie op die perseel gedoen kan word in ooreenstemming met SACAA regulasies vir veiligheid.`,
      zu: `ISIVUMELWANO SOKUSEBENZISA IDRONE NOKUTHWEBULA NGEZULU

Osebenzisa Idrone: {{PHOTOGRAPHER}} ({{COMPANY}})
Umnikazi Wendawo: {{CLIENT}}
Indawo: {{LOCATION}}
Usuku: {{DATE}}

Ngalokhu nginika imvume yokuthi kusetshenziswe idrone yokuthwebula ezulwini kule ndawo eshiwo ngenhla, kulandelwa imithetho yokuphepha ye-SACAA.`
    }
  },
  {
    id: 'coffee-shop-collab',
    title: 'Coffee Shop & Brand Collaboration Agreement',
    category: 'Agreement',
    description: 'Trade contract where photographer provides free social media asset packages in exchange for venue use, free products, and brand cross-tagging.',
    fieldsRequired: ['photographerName', 'companyName', 'clientName', 'location', 'date'],
    content: {
      en: `LOCAL BUSINESS & VENUE COLLABORATION AGREEMENT
(Coffee Shop & Brand Trade-for-Assets)

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Business / Venue Partner: {{CLIENT}}
Location: {{LOCATION}}
Collab Date: {{DATE}}

This agreement outlines the collaboration between the Photographer and the Business Partner. Both parties agree to a mutual value-for-value trade with no monetary compensation.

1. ACCESS & VENUE USE: The Business Partner grants the Photographer exclusive or semi-exclusive access to shoot on the premises on {{DATE}}.
2. COMPLIMENTARY PRODUCTS: The Business Partner agrees to provide the Photographer and team with complimentary beverages/food during the shoot as a hospitality gesture.
3. DELIVERABLES: The Photographer will deliver a "Free Asset Package" consisting of:
   - At least 15 high-quality edited digital images optimized for social media/web.
   - 2x B-roll video clips or Reels/TikTok-ready clips.
   - Delivery will be within 10 business days via a secure digital link.
4. LICENSE & USAGE:
   - The Business Partner receives a non-exclusive, perpetual, worldwide license to use the delivered assets on their social media, website, and digital menus.
   - The Business Partner may NOT resell or license these images to third parties.
   - The Photographer retains full copyright and the right to use the images for promotional, website, and portfolio use.
5. CREDITING & COLLABORATION: Both parties agree to credit each other in all public posts (e.g., tagging @{{COMPANY}} and the business partner's handle).`,
      af: `PLAASLIKE BESIGHEID & LIGGING SAMEWERKINGSOOREENKOMS
(Koffiewinkel- en Handelsmerk-bates Ruil)

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Besigheids- / Liggingvennoot: {{CLIENT}}
Ligging: {{LOCATION}}
Samewerkingsdatum: {{DATE}}

Hierdie ooreenkoms beskryf die samewerking tussen die Fotograaf en die Besigheidsvennoot. Albei partye stem in tot 'n wedersydse waarde-vir-waarde ruil sonder geldelike vergoeding.

1. TOEGANG: Die Besigheidsvennoot verleen aan die Fotograaf toegang om op die perseel te verfilm op {{DATE}}.
2. GASVRYHEID: Die Besigheidsvennoot stem in om gratis koffie/drankies/etes aan die fotospan te voorsien tydens die sessie.
3. LEWERINGS: Die Fotograaf sal 'n gratis bate-pakket lewer bestaande uit:
   - Ten minste 15 hoë-gehalte geredigeerde beelde vir sosiale media/webwerf.
   - Aflewering binne 10 werksdae via 'n veilige skakel.
4. LISENSIERING: Besigheidsvennoot kry 'n nie-eksklusiewe, ewige lisensie vir sosiale media en webwerf gebruik. Kopiereg bly by {{PHOTOGRAPHER}}.
5. ERKENNING: Albei partye stem in om mekaar te merk en te erken op alle sosiale media plasings.`,
      zu: `ISIVUMELWANO SOKUSEBENZISANA NEBHIZINISI LENDAWO
(Ukuhwebelana Kwezithombe Ne-Coffee Shop)

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Uzakwethu Webhizinisi / Indawo: {{CLIENT}}
Indawo: {{LOCATION}}
Usuku: {{DATE}}

Lolu sivumelwano sichaza ukusebenzisana phakathi koThwebuli noZakwethu weBhizinisi. Bobabili bavumelana ngokushintshisana ngezinsizakalo ngaphandle kwenkokhelo yemali.

1. UKUNGENA ENDAWENI: Uzakwethu ukhulula indawo ukuba kuthwetshulwe kuyo ngomhlaka-{{DATE}}.
2. UKUDLA NEZIPHUZO: Uzakwethu uvuma ukunikeza ithimba lika-{{PHOTOGRAPHER}} iziphuzo noma ukudla mahhala ngesikhathi somsebenzi.
3. OKULINDELEKILE: Uthwebuli uzohlinzeka nge-"Free Asset Package" ehlanganisa:
   - Izithombe ezingu-15 ezinhle ezilungiselwe ezokuxhumana.
   - Ukulethwa zingakapheli izinsuku zomsebenzi ezingu-10.
4. UKUSEBENZISA: Ibhizinisi lithola imvume yokusebenzisa lezi zithombe ezinkundleni zokuxhumana nakuwebhusayithi. Amalungelo okushicilela ahlala ku-{{PHOTOGRAPHER}}.
5. UKUBONGA: Bobabili bavuma ukbhalana ngezibongo nokufaka amagama ezinkundleni zokuxhumana.`
    }
  },
  {
    id: 'tfp-social-collab',
    title: 'TFP Model Collaboration & Promo Agreement',
    category: 'Agreement',
    description: 'Modern Trade-for-Portfolio agreement specifying creative direction, high-res deliverables, mandatory social media tagging, and mutual licensing.',
    fieldsRequired: ['photographerName', 'companyName', 'modelName', 'location', 'date'],
    content: {
      en: `TFP MODEL COLLABORATION & SOCIAL MEDIA AGREEMENT
(Trade-For-Portfolio and Digital Promotion)

Photographer / Studio: {{PHOTOGRAPHER}} ({{COMPANY}})
Collaborating Model: {{MODEL}}
Shoot Location: {{LOCATION}}
Shoot Date: {{DATE}}

This agreement establishes the terms for a creative Trade-For-Portfolio (TFP) photoshoot collaboration, emphasizing mutual promotional value, social media engagement, and asset delivery.

1. NO MONETARY COMPENSATION: This is a professional trade. Neither party will charge the other for their time or services.
2. CREATIVE DIRECTION & STYLE: The creative direction is mutually agreed upon prior to the shoot. Both parties agree to show up fully prepared with clothing, styling, and equipment as discussed.
3. PHOTOGRAPHER DELIVERABLES:
   - The Photographer will deliver at least 12 high-resolution, professionally edited digital assets.
   - Delivery will be within 14 days of the shoot via a secure gallery.
   - The Photographer retains sole artistic control over selection and editing style. No raw unedited files will be delivered.
4. USAGE RIGHTS:
   - Both the Model and the Photographer are granted non-exclusive rights to use the edited images in their portfolios, websites, social media channels, and model comp cards.
   - Neither party may sell, license, or submit these images to magazines/publications for commercial gain without the other party's written consent.
5. SOCIAL MEDIA PROMOTION & TAGGING:
   - When posting the images on social media platforms (Instagram, TikTok, Pinterest, etc.), both parties agree to prominently tag and credit the other party in the caption.
   - Format: "Photo by @{{COMPANY}} | Model @{{MODEL}}"`,
      af: `TFP SAMEWERKING & SOSIALE MEDIA OOREENKOMS
(Ruil vir Portfeulje en Digitale Promosie)

Fotograaf / Ateljee: {{PHOTOGRAPHER}} ({{COMPANY}})
Model: {{MODEL}}
Ligging: {{LOCATION}}
Datum: {{DATE}}

Hierdie ooreenkoms reël die samewerking vir 'n kreatiewe TFP-fotosessie met die klem op promosie-waarde en sosiale media erkenning.

1. GEEN BETALING: Geen geld word tussen partye uitgeruil nie.
2. LEWERINGS: Die fotograaf sal ten minste 12 hoë-resolusie geredigeerde beelde binne 14 dae lewer via 'n digitale gallery. Geen RAW-beelde word verskaf nie.
3. GEBRUIK: Albei partye mag die beelde gebruik vir portfeuljes en sosiale media. Geen kommersiële verkoop sonder toestemming nie.
4. ERKENNING: Albei partye stem in om mekaar duidelik te merk op alle plasings.`,
      zu: `ISIVUMELWANO SE-TFP NEMIDIALI YEZINKUNDLA ZOKUXHUMANA
(Ukuphana Ngezithombe Nokukhangisana)

Uthwebuli / Isitudiyo: {{PHOTOGRAPHER}} ({{COMPANY}})
Imodeli: {{MODEL}}
Indawo: {{LOCATION}}
Usuku: {{DATE}}

Lolu sivumelwano sihlelwe ukulawula ukusebenzisana kwe-TFP phakathi kwethu kanti kukhonjelwe kakhulu ukukhuthazana ezinkundleni zokuxhumana.

1. AKUKHO MALI: Awukho umshado wezimali kulo msebenzi.
2. OKULINDELEKILE: Uthwebuli uzohlinzeka ngezithombe eziyi-12 ezinhle kakhulu ezilungisiwe ngaphansi kwezinsuku eziyi-14. Azikho izithombe ezingalungisiwe (RAW) ezizothunyelwa.
3. AMALUNGELO: Bobabili banelungelo lokusebenzisa lezi zithombe ezincwadini zabo nasezinkundleni zokuxhumana.
4. UKUBHALA AMAGAMA: Lapho ushicilela isithombe, kumele ubhale igama lomunye umuntu ngokugqamile.`
    }
  }
];
