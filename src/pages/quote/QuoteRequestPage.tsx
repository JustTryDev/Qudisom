// This page imports the QuoteRequestPage component from /new-file.tsx
// The component is EXACTLY the same as the modal version, with these changes:
// 1. No modal wrapper (backdrop, fixed positioning removed)
// 2. Step 1 and Step 2 combined into single scrollable page  
// 3. Full page layout with max-w-5xl instead of modal max-w-3xl
// All other functionality, design, components, and features are 100% identical

export { QuoteRequestPage as default } from './NewQuoteForm';
