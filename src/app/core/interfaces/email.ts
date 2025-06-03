// email.model.ts
export interface Email {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    emailTypeId?:number;
    attachments?: File[];
  }
  