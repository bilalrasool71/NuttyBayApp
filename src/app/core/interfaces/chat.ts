export interface Chat {
    chatId: number;        
    message: string; 
    isUser: boolean; 
    userId: number;     
    addedDate?: Date; 
  }