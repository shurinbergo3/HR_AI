export type Locale = "en" | "pl";

export const dict: Record<Locale, Record<string, string>> = {
  en: {
    title: "AI HR Assistant",
    subtitle: "Paste a job description, upload a resume, and get an expert hiring analysis.",
    jobDescLabel: "Job Description",
    jobDescPlaceholder: "Paste the full job description here…",
    uploadLabel: "Upload Resume (PDF or DOCX)",
    uploadHint: "Drag & drop or click to browse",
    uploadedFile: "Uploaded:",
    analyzeBtn: "Analyze Candidate",
    analyzingBtn: "Analyzing…",
    resultHeading: "Analysis Result",
    errorNoJob: "Please provide a job description.",
    errorNoResume: "Please upload a resume file.",
    errorGeneric: "Something went wrong. Please try again.",
  },
  pl: {
    title: "Asystent HR AI",
    subtitle: "Wklej opis stanowiska, prześlij CV i uzyskaj ekspercką analizę rekrutacyjną.",
    jobDescLabel: "Opis stanowiska",
    jobDescPlaceholder: "Wklej pełny opis stanowiska tutaj…",
    uploadLabel: "Prześlij CV (PDF lub DOCX)",
    uploadHint: "Przeciągnij i upuść lub kliknij, aby przeglądać",
    uploadedFile: "Przesłano:",
    analyzeBtn: "Analizuj kandydata",
    analyzingBtn: "Analizowanie…",
    resultHeading: "Wynik analizy",
    errorNoJob: "Podaj opis stanowiska.",
    errorNoResume: "Prześlij plik z CV.",
    errorGeneric: "Coś poszło nie tak. Spróbuj ponownie.",
  },
};
