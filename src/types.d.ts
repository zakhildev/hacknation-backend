declare interface IAskBody {
  userId: string;
  data: {
    task: 'title' | 'summarize' | 'answer' | 'form' | 'rate';
    content?: string;
    prompt?: string;
  };
  clearMemory: boolean;
}
