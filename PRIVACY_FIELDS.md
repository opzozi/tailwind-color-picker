# Chrome Web Store - Adatvédelem mezők

## Egyetlen cél leírása (Single Purpose)

**Magyar:**
A bővítmény egyetlen célja, hogy a felhasználók színeket választhassanak ki bármely weboldalról az EyeDropper API segítségével, és azonnal megtalálják a legközelebbi Tailwind CSS osztálynevet. A színmatching CIE Lab színtérrel és DeltaE távolságszámítással történik, teljes mértékben offline módon, helyi feldolgozással.

**English (alternatíva):**
The extension's single purpose is to allow users to pick colors from any webpage using the EyeDropper API and instantly find the closest matching Tailwind CSS class name. Color matching uses CIE Lab color space and DeltaE distance calculation, fully offline with local processing.

---

## Storage engedély indoklása (Permission Justification)

**Magyar:**
A "storage" engedélyt az utolsó kiválasztott szín helyi tárolásához használjuk. Ez lehetővé teszi, hogy amikor a felhasználó újra megnyitja a bővítményt, az utolsó kiválasztott szín automatikusan visszaálljon. Az adatok csak a felhasználó böngészőjében tárolódnak, soha nem kerülnek külső szerverekre, és nem használunk analytics vagy tracking szolgáltatásokat.

**English (alternatíva):**
The "storage" permission is used to save the last picked color locally. This allows the extension to restore the last picked color when the user reopens it. Data is stored only in the user's browser, never sent to external servers, and no analytics or tracking services are used.

---

## Távoli kód használata (Remote Code)

**Válasz: NEM**

A bővítmény nem használ távoli kódot. Minden JavaScript kód a bővítmény csomagjában található, nincsenek külső scriptek, CDN hivatkozások vagy dinamikusan betöltött modulok. A bővítmény 100% offline működik, minden feldolgozás helyben történik.

---

## Rövid válaszok (ha rövidebb szöveg kell)

**Egyetlen cél (rövid):**
Színválasztás weboldalakról és a legközelebbi Tailwind CSS osztálynév megtalálása. Teljes mértékben offline működés, helyi feldolgozással.

**Storage indoklás (rövid):**
Az utolsó kiválasztott szín helyi mentése, hogy a felhasználó újranyitáskor visszaállítható legyen. Nincs adatküldés külső szerverekre.

