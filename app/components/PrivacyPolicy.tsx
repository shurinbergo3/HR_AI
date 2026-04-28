"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { Locale } from "@/lib/locale";

interface PrivacyPolicyProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

export function PrivacyPolicy({ open, onClose, locale }: PrivacyPolicyProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = locale === "pl" ? <PolicyPL /> : <PolicyEN />;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-heavy relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-white/40 transition-colors"
          aria-label={locale === "pl" ? "Zamknij" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>
        <article className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-strong:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
          {content}
        </article>
      </div>
    </div>
  );
}

function PolicyPL() {
  return (
    <>
      <h2>Polityka Prywatności i Informacja RODO</h2>
      <p><em>Ostatnia aktualizacja: 28 kwietnia 2026 r.</em></p>

      <h3>1. Administrator danych</h3>
      <p>
        Administratorem danych osobowych przetwarzanych w ramach aplikacji <strong>AI HR Assistant</strong> jest osoba
        prowadząca aplikację, kontakt: <a href="mailto:sumotry@gmail.com">sumotry@gmail.com</a>.
      </p>

      <h3>2. Jakie dane przetwarzamy</h3>
      <ul>
        <li>Treść opisu stanowiska wprowadzona przez użytkownika.</li>
        <li>Treść przesłanego CV (imię, nazwisko, dane kontaktowe, doświadczenie, wykształcenie, umiejętności i inne dane zawarte przez kandydata w dokumencie).</li>
        <li>Adres IP — wyłącznie w celu ochrony przed nadużyciami (rate limiting), bez zapisu w bazie danych.</li>
        <li>Dane techniczne przeglądarki niezbędne do działania serwisu.</li>
      </ul>

      <h3>3. Cel i podstawa prawna</h3>
      <ul>
        <li><strong>Świadczenie usługi analizy CV</strong> — art. 6 ust. 1 lit. b RODO (wykonanie usługi na rzecz użytkownika).</li>
        <li><strong>Analiza danych osobowych kandydatów</strong> — opiera się na podstawie prawnej, którą zapewnia użytkownik
          (recruiter / pracodawca), tj. zgoda kandydata (art. 6 ust. 1 lit. a RODO) lub uzasadniony interes
          (art. 6 ust. 1 lit. f RODO). Użytkownik oświadcza posiadanie takiej podstawy zaznaczając pole zgody RODO przed analizą.</li>
        <li><strong>Bezpieczeństwo serwisu</strong> — art. 6 ust. 1 lit. f RODO (uzasadniony interes administratora).</li>
      </ul>

      <h3>4. Okres przechowywania</h3>
      <p>
        Aplikacja <strong>nie przechowuje</strong> opisów stanowisk ani CV w bazie danych. Dane są przetwarzane
        w pamięci serwera wyłącznie na czas wygenerowania analizy, a następnie usuwane. Wynik analizy jest przechowywany
        tylko w przeglądarce użytkownika do momentu odświeżenia strony.
      </p>

      <h3>5. Odbiorcy danych — przekazywanie do państw trzecich</h3>
      <p>
        Treść opisu stanowiska oraz CV jest przekazywana do dostawcy modeli AI:
      </p>
      <ul>
        <li><strong>Groq, Inc.</strong> (USA) — przetwarzanie w celu wygenerowania analizy. Standardowe Klauzule Umowne
          (SCC) zgodnie z decyzją Komisji Europejskiej 2021/914.</li>
        <li><strong>Vercel Inc.</strong> (USA) — hosting aplikacji.</li>
      </ul>
      <p>
        Przekazywanie do USA odbywa się w oparciu o mechanizmy zgodne z rozdziałem V RODO (SCC oraz Data Privacy
        Framework, jeśli odbiorca jest certyfikowany).
      </p>

      <h3>6. Prawa osoby, której dane dotyczą</h3>
      <p>Zgodnie z RODO przysługują Państwu następujące prawa:</p>
      <ul>
        <li>prawo dostępu do danych (art. 15 RODO),</li>
        <li>prawo do sprostowania (art. 16 RODO),</li>
        <li>prawo do usunięcia („prawo do bycia zapomnianym&quot;, art. 17 RODO),</li>
        <li>prawo do ograniczenia przetwarzania (art. 18 RODO),</li>
        <li>prawo do przenoszenia danych (art. 20 RODO),</li>
        <li>prawo do sprzeciwu (art. 21 RODO),</li>
        <li>prawo do cofnięcia zgody w dowolnym momencie (art. 7 ust. 3 RODO),</li>
        <li>prawo do wniesienia skargi do <strong>Prezesa Urzędu Ochrony Danych Osobowych</strong> (UODO),
          ul. Stawki 2, 00-193 Warszawa, <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>.</li>
      </ul>

      <h3>7. Pliki cookies i Local Storage</h3>
      <p>
        Aplikacja nie wykorzystuje plików cookies do celów marketingowych ani analitycznych. Korzystamy wyłącznie
        z mechanizmu Local Storage przeglądarki w celu zapamiętania:
      </p>
      <ul>
        <li>Twojej zgody na cookies / RODO,</li>
        <li>preferowanego języka interfejsu.</li>
      </ul>
      <p>
        Te dane pozostają wyłącznie w Twojej przeglądarce i nie są przesyłane na nasz serwer. Możesz je w każdej
        chwili usunąć w ustawieniach przeglądarki.
      </p>

      <h3>8. Profilowanie i decyzje automatyczne</h3>
      <p>
        Wynik analizy AI ma charakter <strong>doradczy</strong> i służy wyłącznie wsparciu rekrutera. Aplikacja nie
        podejmuje samodzielnie decyzji wywołujących skutki prawne wobec kandydata w rozumieniu art. 22 RODO. Ostateczna
        decyzja rekrutacyjna należy do człowieka.
      </p>

      <h3>9. Obowiązki użytkownika (rekrutera)</h3>
      <p>
        Użytkownik korzystający z aplikacji jako narzędzia w procesie rekrutacji jest <strong>współadministratorem</strong>
        / administratorem danych kandydata i odpowiada za:
      </p>
      <ul>
        <li>uzyskanie zgody kandydata na przetwarzanie danych osobowych zawartych w CV oraz na korzystanie z narzędzia AI,</li>
        <li>spełnienie obowiązku informacyjnego wobec kandydata (art. 13 RODO),</li>
        <li>nieprzesyłanie danych szczególnych kategorii (art. 9 RODO) bez wyraźnej zgody.</li>
      </ul>

      <h3>10. Kontakt</h3>
      <p>
        Pytania związane z przetwarzaniem danych osobowych prosimy kierować na adres:{" "}
        <a href="mailto:sumotry@gmail.com">sumotry@gmail.com</a>.
      </p>
    </>
  );
}

function PolicyEN() {
  return (
    <>
      <h2>Privacy Policy &amp; GDPR/RODO Notice</h2>
      <p><em>Last updated: 28 April 2026</em></p>

      <h3>1. Data Controller</h3>
      <p>
        The controller of personal data processed within the <strong>AI HR Assistant</strong> application is the
        operator of the application. Contact: <a href="mailto:sumotry@gmail.com">sumotry@gmail.com</a>.
      </p>

      <h3>2. Data we process</h3>
      <ul>
        <li>The job description text you provide.</li>
        <li>The contents of uploaded CVs (name, contact details, experience, education, skills, and other information included by the candidate in the document).</li>
        <li>IP address — solely for abuse prevention (rate limiting), not stored in a database.</li>
        <li>Technical browser data necessary for the service to function.</li>
      </ul>

      <h3>3. Purpose &amp; legal basis</h3>
      <ul>
        <li><strong>Providing the CV analysis service</strong> — Art. 6(1)(b) GDPR (performance of a service).</li>
        <li><strong>Processing of candidate personal data</strong> — relies on a lawful basis ensured by the user
          (recruiter / employer): the candidate&apos;s consent (Art. 6(1)(a) GDPR) or legitimate interest
          (Art. 6(1)(f) GDPR). The user attests to having such a basis by ticking the RODO consent box before analysis.</li>
        <li><strong>Service security</strong> — Art. 6(1)(f) GDPR (legitimate interest of the controller).</li>
      </ul>

      <h3>4. Retention period</h3>
      <p>
        The application <strong>does not store</strong> job descriptions or CVs in any database. Data is processed
        in server memory only for the duration of generating the analysis, then discarded. The analysis result is
        retained only in your browser until you refresh the page.
      </p>

      <h3>5. Recipients — international transfers</h3>
      <p>The job description and CV are transmitted to AI model providers:</p>
      <ul>
        <li><strong>Groq, Inc.</strong> (USA) — processing for the purpose of generating analysis. Standard
          Contractual Clauses (SCCs) under Commission Decision 2021/914.</li>
        <li><strong>Vercel Inc.</strong> (USA) — application hosting.</li>
      </ul>
      <p>
        Transfers to the USA take place under mechanisms compliant with Chapter V GDPR (SCCs and the Data Privacy
        Framework where the recipient is certified).
      </p>

      <h3>6. Your rights</h3>
      <p>Under GDPR/RODO you have the following rights:</p>
      <ul>
        <li>right of access (Art. 15 GDPR),</li>
        <li>right to rectification (Art. 16 GDPR),</li>
        <li>right to erasure / &quot;right to be forgotten&quot; (Art. 17 GDPR),</li>
        <li>right to restriction of processing (Art. 18 GDPR),</li>
        <li>right to data portability (Art. 20 GDPR),</li>
        <li>right to object (Art. 21 GDPR),</li>
        <li>right to withdraw consent at any time (Art. 7(3) GDPR),</li>
        <li>right to lodge a complaint with the <strong>President of the Personal Data Protection Office (UODO)</strong>,
          ul. Stawki 2, 00-193 Warsaw, Poland — <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">uodo.gov.pl</a>.</li>
      </ul>

      <h3>7. Cookies and Local Storage</h3>
      <p>
        We do not use cookies for marketing or analytics purposes. We only use the browser&apos;s Local Storage to remember:
      </p>
      <ul>
        <li>your cookie / RODO consent,</li>
        <li>your preferred interface language.</li>
      </ul>
      <p>
        This data stays in your browser and is not transmitted to our server. You may clear it at any time in your
        browser settings.
      </p>

      <h3>8. Profiling and automated decisions</h3>
      <p>
        AI analysis results are <strong>advisory</strong> and intended solely to support the recruiter. The application
        does not autonomously make decisions producing legal effects on the candidate within the meaning of Art. 22 GDPR.
        The final hiring decision remains with a human.
      </p>

      <h3>9. User (recruiter) responsibilities</h3>
      <p>
        A user using the application as a recruitment tool is the <strong>controller / co-controller</strong> of the
        candidate&apos;s data and is responsible for:
      </p>
      <ul>
        <li>obtaining the candidate&apos;s consent for processing personal data contained in the CV and for using AI tooling,</li>
        <li>fulfilling the information obligation toward the candidate (Art. 13 GDPR),</li>
        <li>not submitting special categories of data (Art. 9 GDPR) without explicit consent.</li>
      </ul>

      <h3>10. Contact</h3>
      <p>
        Questions about personal data processing: <a href="mailto:sumotry@gmail.com">sumotry@gmail.com</a>.
      </p>
    </>
  );
}
