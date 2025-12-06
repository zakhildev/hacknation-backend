declare interface IAskBody {
  userId: string;
  data: {
    task: 'title' | 'summarize' | 'answer' | 'form';
    content?: string;
    prompt?: string;
  };
  clearMemory: boolean;
}
