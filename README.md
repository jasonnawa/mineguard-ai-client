# MineGuard AI (proof of concept) - client
An AI-powered frontend application for uploading, analyzing, querying, and comparing documents. Users can upload PDF documents, extract structured insights (summary, key points), ask document-grounded questions through an interactive chat interface, and perform compliance gap analysis between two documents.

# Features
### Document Management

- Upload PDF documents

- Parse and extract raw text

- Store original PDF for later viewing

- Display documents in an in-app PDF viewer

- Metadata tracking (title, size, upload time)

### AI Document Analysis

- Automatic document summarization

- Extraction of key points

- Pagination for long key-point lists

- Read-more handling for long summaries

- Document-Grounded Q&A

- Ask natural-language questions about a document

- AI answers strictly based on document content

- Persistent Q&A history per document

- Chat interface presented as a modal

- Suggested prompt chips for guided questioning

### Document Comparison

- Compare two indexed documents for compliance and gap analysis

- Dropdown to select target document on document view page

- Displays structured compliance evaluation:

- Overall compliance score

- Counts of compliant, partially compliant, and non-compliant requirements

- Individual requirement evaluations with rationale and evidence

- Safe loading states for asynchronous comparisons

- Highlights compliant, partial, and non-compliant items using color-coded chips

### User Experience

- Split-view document + insights layout

- Scroll-safe panels with independent overflow

- Toast notifications for actions and errors

- Clean, modern Material UI design

- Accessible and responsive layout

# Tech Stack

- React 19

- TypeScript

- Material UI (MUI)

- React Router

- react-pdf (PDF rendering)

- react-toastify (notifications)


# Folder Structure

```text
src/
├── components/
│   ├── DocumentViewer.tsx
│   ├── DocumentInsightView.tsx
│   ├── DocumentChatModal.tsx
│   ├── DocumentComparisonView.tsx
│   ├── DocumentComparisonSection.tsx
│
├── services/
│   ├── documents.ts
│   ├── qa.ts
│
├── pages/
│   ├── DocumentView.tsx
│   ├── DocumentInsightView.tsx
│
├──api.tsx
```

### Key UI Concepts

- Document viewer, insights panel, and comparison panel rendered on the same page

- Independent scrolling containers (no viewport lock)

- Chat opens as a modal triggered from the document view

- Dropdown selection for comparison triggers a structured compliance evaluation

- Markdown rendering supported in chat responses


### Running the Project
```bash
npm install
npm run dev
```
