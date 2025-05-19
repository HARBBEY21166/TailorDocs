
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// Extract text from DOCX file
export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from the document.');
  }
};

// Convert text to DOCX and download
export const convertToDocx = (content: string, filename: string): void => {
  try {
    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(para => para.trim().length > 0);
    
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs.map(para => {
            // Check if paragraph is likely a heading (e.g., starts with "# " or is all uppercase)
            const isHeading = /^[A-Z\s]+:$/.test(para) || para.startsWith("# ");
            
            return new Paragraph({
              heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
              children: [new TextRun({ text: para, bold: isHeading })],
              spacing: { after: 200 }
            });
          }),
        },
      ],
    });

    // Generate and save document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${filename}.docx`);
    });
  } catch (error) {
    console.error('Error creating DOCX:', error);
    throw new Error('Failed to create document.');
  }
};

// Convert cover letter to DOCX
export const convertCoverLetterToDocx = (content: string, filename: string): void => {
  try {
    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(para => para.trim().length > 0);
    
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs.map((para, index) => {
            // First few lines are contact information
            const isContactInfo = index < 5;
            // Check for bullet points
            const isBulletPoint = para.trim().startsWith('•') || para.trim().startsWith('-');
            
            return new Paragraph({
              alignment: isContactInfo ? AlignmentType.RIGHT : AlignmentType.LEFT,
              bullet: isBulletPoint ? { level: 0 } : undefined,
              children: [new TextRun({ text: para, bold: index === 0 })],
              spacing: { after: 200 }
            });
          }),
        },
      ],
    });

    // Generate and save document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${filename}.docx`);
    });
  } catch (error) {
    console.error('Error creating cover letter DOCX:', error);
    throw new Error('Failed to create document.');
  }
};
