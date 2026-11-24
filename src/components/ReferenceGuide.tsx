const AKK_PREPS = [
  { word: 'durch', meaning: 'through', example: 'durch den Park' },
  { word: 'für', meaning: 'for', example: 'für meine Schwester' },
  { word: 'gegen', meaning: 'against, around', example: 'gegen den Plan' },
  { word: 'ohne', meaning: 'without', example: 'ohne meinen Pass' },
  { word: 'um', meaning: 'around, at', example: 'um den Tisch / um 8 Uhr' },
  { word: 'bis', meaning: 'until, up to', example: 'bis nächsten Montag' },
  { word: 'entlang', meaning: 'along', example: 'den Fluss entlang' },
];

const DAT_PREPS = [
  { word: 'aus', meaning: 'from, out of', example: 'aus der Küche' },
  { word: 'außer', meaning: 'apart from', example: 'außer dem Chef' },
  { word: 'bei', meaning: 'at, near, with', example: 'beim Arzt' },
  { word: 'gegenüber', meaning: 'opposite', example: 'gegenüber dem Bahnhof' },
  { word: 'mit', meaning: 'with, by', example: 'mit dem Fahrrad' },
  { word: 'nach', meaning: 'after, to cities', example: 'nach dem Essen' },
  { word: 'seit', meaning: 'since, for', example: 'seit einem Monat' },
  { word: 'von', meaning: 'from, of, by', example: 'vom Bahnhof' },
  { word: 'zu', meaning: 'to', example: 'zum Supermarkt / zur Post' },
];

const CONTRACTIONS = [
  { short: 'im', expanded: 'in + dem (Dat)' },
  { short: 'ins', expanded: 'in + das (Akk)' },
  { short: 'am', expanded: 'an + dem (Dat)' },
  { short: 'ans', expanded: 'an + das (Akk)' },
  { short: 'zum', expanded: 'zu + dem (Dat)' },
  { short: 'zur', expanded: 'zu + der (Dat)' },
  { short: 'beim', expanded: 'bei + dem (Dat)' },
  { short: 'vom', expanded: 'von + dem (Dat)' },
  { short: 'aufs', expanded: 'auf + das (Akk)' },
  { short: 'fürs', expanded: 'für + das (Akk)' },
  { short: 'durchs', expanded: 'durch + das (Akk)' },
  { short: 'ums', expanded: 'um + das (Akk)' },
];

export function ReferenceGuide() {
  return (
    <section
      id="grammar-reference"
      className="grid gap-6 mt-2 pt-6 border-t border-[var(--outline-variant)]"
      aria-labelledby="ref-heading"
    >
      <div>
        <p className="font-label text-xs font-semibold tracking-wider text-[var(--primary)] mb-1">
          Grammar Reference Guide
        </p>
        <h2
          id="ref-heading"
          className="font-headline text-xl sm:text-2xl font-semibold text-[var(--on-surface)]"
        >
          Complete Preposition &amp; Declension Reference
        </h2>
      </div>

      {/* Akkusativ & Dativ Prepositions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
          <p className="font-label text-xs font-semibold text-[var(--primary)] mb-1">
            Direct Object · Wen oder was?
          </p>
          <h3 className="font-headline text-lg font-semibold text-[var(--on-surface)] mb-3">
            Akkusativ Prepositions
          </h3>
          <ul className="divide-y divide-[var(--outline-variant)] mb-4">
            {AKK_PREPS.map((item) => (
              <li key={item.word} className="flex justify-between gap-3 py-1.5 text-[0.9375rem]">
                <span className="font-bold text-[var(--primary)]">{item.word}</span>
                <span className="text-right">
                  {item.meaning} (<em className="text-[var(--on-surface-variant)]">{item.example}</em>)
                </span>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm" aria-label="Akkusativ article endings">
              <thead>
                <tr className="bg-[var(--surface-container)] text-[var(--on-surface-variant)] font-label text-xs">
                  <th className="py-2 px-2 text-left font-semibold">Gender</th>
                  <th className="py-2 px-2 text-left font-semibold">Definite</th>
                  <th className="py-2 px-2 text-left font-semibold">Indefinite</th>
                  <th className="py-2 px-2 text-left font-semibold">Negative / Poss.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]">
                <tr>
                  <td className="py-2 px-2">Masculine</td>
                  <td className="py-2 px-2 font-bold">den</td>
                  <td className="py-2 px-2 font-bold">einen</td>
                  <td className="py-2 px-2">keinen / meinen</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Feminine</td>
                  <td className="py-2 px-2 font-bold">die</td>
                  <td className="py-2 px-2 font-bold">eine</td>
                  <td className="py-2 px-2">keine / meine</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Neuter</td>
                  <td className="py-2 px-2 font-bold">das</td>
                  <td className="py-2 px-2 font-bold">ein</td>
                  <td className="py-2 px-2">kein / mein</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Plural</td>
                  <td className="py-2 px-2 font-bold">die</td>
                  <td className="py-2 px-2">—</td>
                  <td className="py-2 px-2">keine / meine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
          <p className="font-label text-xs font-semibold mb-1">
            Indirect Object · Wem?
          </p>
          <h3 className="font-headline text-lg font-semibold mb-3">
            Dativ Prepositions
          </h3>
          <ul className="divide-y divide-[var(--outline-variant)] mb-4">
            {DAT_PREPS.map((item) => (
              <li key={item.word} className="flex justify-between gap-3 py-1.5 text-[0.9375rem]">
                <span className="font-bold">{item.word}</span>
                <span className="text-right">
                  {item.meaning} (<em>{item.example}</em>)
                </span>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm" aria-label="Dativ article endings">
              <thead>
                <tr className="bg-[var(--surface-container-low)] text-[var(--on-surface)] font-label text-xs">
                  <th className="py-2 px-2 text-left font-semibold">Gender</th>
                  <th className="py-2 px-2 text-left font-semibold">Definite</th>
                  <th className="py-2 px-2 text-left font-semibold">Indefinite</th>
                  <th className="py-2 px-2 text-left font-semibold">Negative / Poss.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]">
                <tr>
                  <td className="py-2 px-2">Masculine</td>
                  <td className="py-2 px-2 font-bold">dem</td>
                  <td className="py-2 px-2 font-bold">einem</td>
                  <td className="py-2 px-2">keinem / meinem</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Feminine</td>
                  <td className="py-2 px-2 font-bold">der</td>
                  <td className="py-2 px-2 font-bold">einer</td>
                  <td className="py-2 px-2">keiner / meiner</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Neuter</td>
                  <td className="py-2 px-2 font-bold">dem</td>
                  <td className="py-2 px-2 font-bold">einem</td>
                  <td className="py-2 px-2">keinem / meinem</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Plural</td>
                  <td className="py-2 px-2 font-bold">den (+ -n)</td>
                  <td className="py-2 px-2">—</td>
                  <td className="py-2 px-2">keinen / meinen (+ -n)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      {/* Wechselpräpositionen & Contractions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
          <p className="font-label text-xs font-semibold text-[var(--primary)] mb-1">
            Two-Way Prepositions
          </p>
          <h3 className="font-headline text-lg font-semibold text-[var(--on-surface)] mb-2">
            Wechselpräpositionen
          </h3>
          <p className="text-[var(--on-surface-variant)] text-[0.95rem] mb-4">
            The nine prepositions <strong>an, auf, hinter, in, neben, über, unter, vor, zwischen</strong> take either Akkusativ or Dativ depending on whether the verb expresses direction or static position:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm" aria-label="Wechselpräpositionen rules">
              <thead>
                <tr className="bg-[var(--surface-container)] text-[var(--on-surface-variant)] font-label text-xs">
                  <th className="py-2 px-2 text-left font-semibold">Question</th>
                  <th className="py-2 px-2 text-left font-semibold">Case</th>
                  <th className="py-2 px-2 text-left font-semibold">Typical Verbs</th>
                  <th className="py-2 px-2 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]">
                <tr>
                  <td className="py-2.5 px-2 align-top">
                    <strong>Wohin?</strong>
                    <br />
                    <span className="text-xs text-[var(--on-surface-variant)]">Direction / motion</span>
                  </td>
                  <td className="py-2.5 px-2 align-top font-bold">Akkusativ</td>
                  <td className="py-2.5 px-2 align-top">gehen, fahren, legen, stellen, setzen, hängen</td>
                  <td className="py-2.5 px-2 align-top">
                    Ich lege das Buch auf <strong>den</strong> Tisch.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 align-top">
                    <strong>Wo?</strong>
                    <br />
                    <span className="text-xs text-[var(--on-surface-variant)]">Location / position</span>
                  </td>
                  <td className="py-2.5 px-2 align-top font-bold">Dativ</td>
                  <td className="py-2.5 px-2 align-top">sein, stehen, liegen, sitzen, hängen, wohnen</td>
                  <td className="py-2.5 px-2 align-top">
                    Das Buch liegt auf <strong>dem</strong> Tisch.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36_/_0.06)]">
          <p className="font-label text-xs font-semibold text-[var(--primary)] mb-1">
            Everyday Contractions
          </p>
          <h3 className="font-headline text-lg font-semibold text-[var(--on-surface)] mb-2">
            Common Preposition + Article Contractions
          </h3>
          <p className="text-[var(--on-surface-variant)] text-[0.95rem] mb-4">
            In written and spoken German, common prepositions frequently merge with <em>dem</em>, <em>der</em>, or <em>das</em>:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CONTRACTIONS.map((c) => (
              <div
                key={c.short}
                className="bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-[10px] px-3 py-2 flex flex-col gap-0.5"
              >
                <strong className="font-headline text-[1.05rem] text-[var(--primary)]">
                  {c.short}
                </strong>
                <span className="font-label text-xs text-[var(--on-surface-variant)]">
                  {c.expanded}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
